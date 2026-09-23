import { readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';

const INPUT = 'data/knowledge-chunks.json';
const OUTPUT = 'data/embeddings.ndjson';
const MODEL = '@cf/baai/bge-base-en-v1.5';

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;

if (!accountId) {
	console.error('CLOUDFLARE_ACCOUNT_ID is not set.');
	process.exit(1);
}

function getWranglerToken() {
	try {
		const output = execFileSync(
			'npx',
			['wrangler', 'auth', 'token', '--json'],
			{
				encoding: 'utf8',
				stdio: ['ignore', 'pipe', 'ignore']
			}
		);

		const credentials = JSON.parse(output);

		if (!credentials.token) {
			throw new Error('Wrangler returned no token.');
		}

		return credentials.token;

	} catch (error) {
		throw new Error(
			`Could not obtain OAuth token from Wrangler: ${error.message}`
		);
	}
}

const token = getWranglerToken();

const source = JSON.parse(
	await readFile(INPUT, 'utf8')
);

console.log(`Loaded ${source.chunks.length} chunks.`);
console.log(`Embedding with ${MODEL}...\n`);

const records = [];

for (let i = 0; i < source.chunks.length; i++) {
	const chunk = source.chunks[i];

	const text = [
		`Article: ${chunk.title}`,
		`Section: ${chunk.section}`,
		`Description: ${chunk.description}`,
		`Pillar: ${chunk.pillar}`,
		`Tags: ${chunk.tags.join(', ')}`,
		'',
		chunk.content
	].join('\n');

	const response = await fetch(
		`https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${MODEL}`,
		{
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				text: [text]
			})
		}
	);

	if (!response.ok) {
		const body = await response.text();

		throw new Error(
			`Embedding failed for ${chunk.id}: ${response.status}\n${body}`
		);
	}

	const result = await response.json();

	const vector = result.result?.data?.[0];

	if (!Array.isArray(vector)) {
		throw new Error(
			`No embedding returned for ${chunk.id}`
		);
	}

	if (vector.length !== 768) {
		throw new Error(
			`Unexpected vector size ${vector.length} for ${chunk.id}`
		);
	}

	records.push(
		JSON.stringify({
			id: chunk.id,
			values: vector,
			metadata: {
				articleId: chunk.articleId,
				title: chunk.title,
				section: chunk.section,
				pillar: chunk.pillar,
				url: chunk.url
			}
		})
	);

	console.log(
		`[${String(i + 1).padStart(2)}/${source.chunks.length}] ${chunk.title} — ${chunk.section}`
	);
}

await writeFile(
	OUTPUT,
	records.join('\n') + '\n'
);

console.log('');
console.log(`Created ${OUTPUT}`);
console.log(`${records.length} vectors ready for Vectorize.`);
