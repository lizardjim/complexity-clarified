import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {

	const articles = await getCollection('articles');

	const searchIndex = articles.map((article) => ({
		title: article.data.title,
		description: article.data.description,
		pillar: article.data.pillar,
		tags: article.data.tags,
		url: `/articles/${article.id}/`
	}));

	return new Response(
		JSON.stringify(searchIndex),
		{
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);
};