import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {

    const articles = await getCollection('articles');

    const publishedArticles = articles
        .filter((article) => article.data.published)
        .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

    const response = await rss({
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

    const xml = await response.text();

    const styledXml = xml.replace(
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<?xml version="1.0" encoding="UTF-8"?>\n<?xml-stylesheet type="text/xsl" href="/rss-style.xsl"?>'
    );

    return new Response(styledXml, {
        headers: response.headers,
    });
}