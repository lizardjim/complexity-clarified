import { readFile } from 'node:fs/promises';

const host = 'complexityclarified.co.uk';
const key = '795c5962138d41c7af3705f050de2e80';
const sitemap = await readFile(
    'dist/sitemap-0.xml',
    'utf8'
);

const urls = [
    ...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)
].map(match => match[1]);

console.log(`IndexNow: found ${urls.length} URLs in sitemap.`);

if (urls.length === 0) {
    console.log('IndexNow: nothing to submit.');
    process.exit(0);
}

const response = await fetch(
    'https://api.indexnow.org/indexnow',
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
            host,
            key,
            keyLocation: `https://${host}/${key}.txt`,
            urlList: urls
        })
    }
);

if (response.ok) {
    console.log(
        `IndexNow: submitted ${urls.length} URL(s) successfully.`
    );
} else {
    console.error(
        `IndexNow submission failed: ${response.status} ${response.statusText}`
    );

    process.exit(1);
}