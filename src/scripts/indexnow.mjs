import { readFile, writeFile } from 'node:fs/promises';

const host = 'complexityclarified.co.uk';
const key = '795c5962138d41c7af3705f050de2e80';
const sitemap = await readFile(
    'dist/sitemap-0.xml',
    'utf8'
);

const cache = JSON.parse(
    await readFile(
        'src/data/indexnow-cache.json',
        'utf8'
    )
);

const urls = [
    ...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)
].map(match => match[1]);

console.log(`IndexNow: found ${urls.length} URLs in sitemap.`);

const previousUrls = cache.urls || [];

const newUrls = urls.filter(
    url => !previousUrls.includes(url)
);

console.log(
    `IndexNow: ${newUrls.length} new URL(s) found.`
);

if (newUrls.length === 0) {
    console.log('IndexNow: nothing new to submit.');
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
            urlList: newUrls
        })
    }
);

if (response.ok) {
    console.log(
        `IndexNow: submitted ${newUrls.length} new URL(s) successfully.`
    );

    await writeFile(
        'src/data/indexnow-cache.json',
        JSON.stringify({ urls }, null, 2)
    );

    console.log('IndexNow: cache updated.');
} else {
    console.error(
        `IndexNow submission failed: ${response.status} ${response.statusText}`
    );
}