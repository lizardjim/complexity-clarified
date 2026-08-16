import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {

    const articles = await getCollection('articles');

    const publishedArticles = articles
        .filter((article) => article.data.published)
        .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

    const feedUrl = new URL('/rss.xml', context.site).href;

    const latestArticleDate =
        publishedArticles[0]?.data.date ?? new Date();

    const categoryLabels = {
        decisions: 'Decisions',
        leadership: 'Leadership',
        technology: 'Technology',
        change: 'Change',
        'digital-transformation': 'Digital Transformation',
        ai: 'AI',
        strategy: 'Strategy',
        culture: 'Culture',
    };

    const response = await rss({
        title: 'Complexity Clarified',

        description:
            'Ideas about decision-making, leadership, technology and change for organisations navigating complexity.',

        site: context.site,

        xmlns: {
            atom: 'http://www.w3.org/2005/Atom',
            dc: 'http://purl.org/dc/elements/1.1/',
        },

        customData: `
            <language>en-gb</language>
            <lastBuildDate>${latestArticleDate.toUTCString()}</lastBuildDate>
            <atom:link
                href="${feedUrl}"
                rel="self"
                type="application/rss+xml"
            />
        `,

        items: publishedArticles.map((article) => {

            const categories = [
                article.data.pillar,
                ...(article.data.tags ?? []),
            ]
                .filter(Boolean)
                .filter(
                    (value, index, array) =>
                        array.indexOf(value) === index
                );

            return {
                title: article.data.title,
                description: article.data.description,
                pubDate: article.data.date,
                link: `/articles/${article.id}/`,

                customData: `
                    <dc:creator>James Barnett</dc:creator>
                    ${categories
                        .map(
                            (category) =>
                                `<category>${categoryLabels[category] ?? category}</category>`
                        )
                        .join('\n')}
                `,
            };
        }),
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