import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

const SITE = 'https://complexityclarified.co.uk';

export const GET: APIRoute = async () => {
	const articles = await getCollection(
		'articles',
		({ data }) => data.published
	);

	const knowledge = articles
		.sort(
			(a, b) =>
				b.data.date.getTime() - a.data.date.getTime()
		)
		.map((article) => ({
			id: article.id,
			title: article.data.title,
			description: article.data.description,
			date: article.data.date.toISOString(),
			pillar: article.data.pillar,
			tags: article.data.tags,
			url: `${SITE}/articles/${article.id}/`,
			content: article.body
		}));

	return new Response(
		JSON.stringify(
			{
				version: 1,
				generatedAt: new Date().toISOString(),
				articleCount: knowledge.length,
				articles: knowledge
			},
			null,
			2
		),
		{
			headers: {
				'Content-Type': 'application/json; charset=utf-8'
			}
		}
	);
};