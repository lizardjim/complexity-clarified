import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {

    const articles = await getCollection('articles');

    const publishedArticles = articles
        .filter((article) => article.data.published)
        .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

    return rss({
        title: 'Complexity Clarified',

        description:
            'Ideas about decision-making, leadership, technology and change for organisations navigating complexity.',

        site: context.site,

        items: publishedArticles.map((article) => ({
            title: article.data.title,
            description: article.data.description,
            pubDate: article.data.date,
            link: `/articles/${article.id}/`,
        })),
    });
}