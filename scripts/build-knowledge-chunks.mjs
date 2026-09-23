const KNOWLEDGE_URL = 'http://localhost:4321/knowledge.json';
const OUTPUT = 'data/knowledge-chunks.json';

import { mkdir, writeFile } from 'node:fs/promises';

function chunkArticle(article) {
	const lines = article.content.split('\n');

	const chunks = [];
	let heading = 'Introduction';
	let buffer = [];

	const saveChunk = () => {
		const content = buffer.join('\n').trim();

		if (!content) return;

		chunks.push({
			id: `${article.id}-${chunks.length + 1}`,
			articleId: article.id,
			title: article.title,
			description: article.description,
			pillar: article.pillar,
			tags: article.tags,
			section: heading,
			content,
			url: article.url
		});

		buffer = [];
	};

	for (const line of lines) {
		const match = line.match(/^#{2,3}\s+(.+)$/);

		if (match) {
			saveChunk();

			heading = match[1]
				.replace(/\*\*/g, '')
				.replace(/\*/g, '')
				.trim();

			continue;
		}

		buffer.push(line);
	}

	saveChunk();

	return chunks;
}

try {
	const response = await fetch(KNOWLEDGE_URL);

	if (!response.ok) {
		throw new Error(
			`Knowledge endpoint returned ${response.status}`
		);
	}

	const knowledge = await response.json();

	const chunks = knowledge.articles.flatMap(chunkArticle);

	await mkdir('data', { recursive: true });

	await writeFile(
		OUTPUT,
		JSON.stringify(
			{
				version: 1,
				articleCount: knowledge.articles.length,
				chunkCount: chunks.length,
				chunks
			},
			null,
			2
		)
	);

	console.log('');
	console.log(`Articles: ${knowledge.articles.length}`);
	console.log(`Chunks:   ${chunks.length}`);
	console.log(`Written:  ${OUTPUT}`);
	console.log('');

	for (const article of knowledge.articles) {
		const count = chunks.filter(
			(chunk) => chunk.articleId === article.id
		).length;

		console.log(`${count.toString().padStart(2)}  ${article.title}`);
	}

	console.log('');

} catch (error) {
	console.error('Failed:', error.message);
	console.error('Make sure Astro is running with: npm run dev');
	process.exit(1);
}
