const KNOWLEDGE_URL = 'http://localhost:4321/knowledge.json';

const normalise = (text = '') =>
	text
		.toLowerCase()
		.replace(/[^\p{L}\p{N}\s-]/gu, ' ')
		.replace(/\s+/g, ' ')
		.trim();

const tokenise = (text) =>
	normalise(text)
		.split(' ')
		.filter((word) => word.length > 2);

function searchKnowledge(articles, query, limit = 5) {
	const queryTerms = [...new Set(tokenise(query))];

	return articles
		.map((article) => {
			const title = normalise(article.title);
			const description = normalise(article.description);
			const pillar = normalise(article.pillar);
			const tags = article.tags.map(normalise);
			const content = normalise(article.content);

			let score = 0;

			for (const term of queryTerms) {
				if (title.includes(term)) score += 10;
				if (description.includes(term)) score += 6;
				if (tags.some((tag) => tag.includes(term))) score += 5;
				if (pillar.includes(term)) score += 3;
				if (content.includes(term)) score += 1;
			}

			return {
				...article,
				score
			};
		})
		.filter((article) => article.score > 0)
		.sort((a, b) => b.score - a.score)
		.slice(0, limit);
}

const query = process.argv.slice(2).join(' ').trim();

if (!query) {
	console.error('Usage: node scripts/test-knowledge.mjs "your question here"');
	process.exit(1);
}

try {
	const response = await fetch(KNOWLEDGE_URL);

	if (!response.ok) {
		throw new Error(`Knowledge endpoint returned ${response.status}`);
	}

	const knowledge = await response.json();
	const results = searchKnowledge(knowledge.articles, query);

	console.log('\nQUESTION');
	console.log(query);

	console.log('\nRESULTS\n');

	if (!results.length) {
		console.log('No matching articles.');
		process.exit(0);
	}

	results.forEach((article, index) => {
		console.log(`${index + 1}. ${article.title}`);
		console.log(`   Score: ${article.score}`);
		console.log(`   Pillar: ${article.pillar}`);
		console.log(`   Tags: ${article.tags.join(', ')}`);
		console.log(`   ${article.url}`);
		console.log('');
	});
} catch (error) {
	console.error('\nSearch failed:', error.message);
	console.error('Make sure Astro is running with: npm run dev');
	process.exit(1);
}
