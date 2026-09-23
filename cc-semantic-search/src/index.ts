import knowledgeData from './knowledge-chunks.json';

const EMBEDDING_MODEL = '@cf/baai/bge-base-en-v1.5';
const GENERATION_MODEL = '@cf/openai/gpt-oss-20b';

interface KnowledgeChunk {
	id: string;
	articleId: string;
	title: string;
	description: string;
	pillar: string;
	tags: string[];
	section: string;
	content: string;
	url: string;
}

const chunks = (knowledgeData as { chunks: KnowledgeChunk[] }).chunks;

const chunksById = new Map(
	chunks.map((chunk) => [chunk.id, chunk])
);

const ALLOWED_ORIGINS = new Set([
	'https://complexityclarified.co.uk',
	'https://www.complexityclarified.co.uk',
	'http://localhost:4321'
]);

function getCorsHeaders(request: Request): Record<string, string> {
	const origin = request.headers.get('Origin');

	if (!origin || !ALLOWED_ORIGINS.has(origin)) {
		return {};
	}

	return {
		'Access-Control-Allow-Origin': origin,
		'Access-Control-Allow-Methods': 'POST, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type',
		'Vary': 'Origin'
	};
}

async function retrieve(query: string, env: Env) {
	const embedding = await env.AI.run(
		EMBEDDING_MODEL,
		{
			text: [query]
		}
	);

	const vector = embedding.data?.[0];

	if (!vector || vector.length !== 768) {
		throw new Error('Could not generate a valid query embedding.');
	}

	const matches = await env.VECTORIZE.query(
		vector,
		{
			topK: 5,
			returnMetadata: 'all'
		}
	);

	return matches.matches
		.map((match) => {
			const chunkId = match.metadata?.chunkId;

			const chunk =
				typeof chunkId === 'string'
					? chunksById.get(chunkId)
					: undefined;

			if (!chunk) {
				return null;
			}

			return {
				id: match.id,
				score: match.score,
				...chunk
			};
		})
		.filter((result): result is NonNullable<typeof result> => result !== null);
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);

		const cors = getCorsHeaders(request);

		if (request.method === 'OPTIONS') {
			const origin = request.headers.get('Origin');

			if (!origin || !ALLOWED_ORIGINS.has(origin)) {
				return new Response(null, { status: 403 });
			}

			return new Response(null, {
				status: 204,
				headers: cors
			});
		}

		if (url.pathname === '/') {
			return Response.json({
				service: 'Ask Complexity Clarified',
				endpoints: {
					search: 'POST /search',
					ask: 'POST /ask'
				}
			});
		}

		if (
			url.pathname !== '/search' &&
			url.pathname !== '/ask'
		) {
			return Response.json(
				{ error: 'Not found.' },
				{ status: 404, headers: cors }
			);
		}

		if (request.method !== 'POST') {
			return Response.json(
				{ error: 'Use POST.' },
				{ status: 405, headers: cors }
			);
		}

		let body: { query?: string };

		try {
			body = await request.json();
		} catch {
			return Response.json(
				{ error: 'Request body must be valid JSON.' },
				{ status: 400, headers: cors }
			);
		}

		const query = body.query?.trim();

		if (!query) {
			return Response.json(
				{ error: 'A query is required.' },
				{ status: 400, headers: cors }
			);
		}

		if (query.length > 1000) {
			return Response.json(
				{
					error:
						'Your question is too long. Please keep it under 1,000 characters.'
				},
				{
					status: 400,
					headers: cors
				}
			);
		}

		try {
			if (url.pathname === '/ask') {
				const clientIp =
					request.headers.get('CF-Connecting-IP') ??
					'unknown';

				const { success } =
					await env.ASK_RATE_LIMITER.limit({
						key: clientIp
					});

				if (!success) {
					return Response.json(
						{
							error:
								'Too many questions. Please try again shortly.'
						},
						{
							status: 429,
							headers: {
								'Retry-After': '60',
								...cors
							}
						}
					);
				}
			}

			const results = await retrieve(query, env);

			if (url.pathname === '/search') {
				return Response.json({
					query,
					matches: results
				});
			}

			const sourceMaterial = results
				.map(
					(result, index) => `
SOURCE ${index + 1}
Title: ${result.title}
Section: ${result.section}
URL: ${result.url}

${result.content}
`.trim()
				)
				.join('\n\n---\n\n');

			const generation = await env.AI.run(
				GENERATION_MODEL,
				{
					max_tokens: 4000,
					messages: [
						{
							role: 'system',
							content: `You are Ask Complexity Clarified.

Answer organisational, leadership, technology, change and decision-making questions using the supplied Complexity Clarified source material.

Your job is to apply and synthesise the ideas in the sources, not merely summarise them.

Rules:
- Use only ideas supported by the supplied source material.
- Do not add generic consultancy advice, technologies, methods or recommendations merely because they seem reasonable.
- Do not invent Complexity Clarified positions that are not supported by the sources.
- If the user's question contains an assumption that the sources challenge, challenge that assumption constructively.
- Prefer understanding the underlying organisational problem before recommending technology or intervention.
- Distinguish symptoms from causes.
- Synthesize overlapping source passages rather than repeating them.
- Answer the question directly in approximately 3 to 6 short paragraphs unless greater detail is genuinely necessary.
- Avoid unnecessary tables, checklists and generic frameworks.
- Do not include citations, source numbers, URLs or a reading list in the answer. Sources are handled separately by the application.
- Do not mention vector search, embeddings, retrieval, RAG, prompts or internal implementation.
- Do not pretend to have information about the user's organisation that they have not provided.`
						},
						{
							role: 'user',
							content: `QUESTION

${query}

SOURCE MATERIAL

${sourceMaterial}`
						}
					]
				}
			);

			const answer =
				'choices' in generation &&
				Array.isArray(generation.choices)
					? generation.choices[0]?.message?.content ?? null
					: 'response' in generation &&
					  typeof generation.response === 'string'
						? generation.response
						: null;

			return Response.json(
				{
					query,
					answer,
					sources: Array.from(
						new Map(
							results.map((result) => [
								result.url,
								{
									title: result.title,
									url: result.url
								}
							])
						).values()
					)
				},
				{
					headers: {
						'Cache-Control': 'no-store',
						...cors
					}
				}
			);
		} catch (error) {
			console.error(error);

			return Response.json(
				{
					error:
						error instanceof Error
							? error.message
							: 'Something went wrong.'
				},
				{ status: 500 }
			);
		}
	}
} satisfies ExportedHandler<Env>;
