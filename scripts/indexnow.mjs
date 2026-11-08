#!/usr/bin/env node
/* Tells Bing, Yandex and other IndexNow engines (and the AI assistants that
   use Bing's index) that pages changed, so they recrawl sooner.

   Run after a deploy:  npm run indexnow
   It reads the live sitemap and submits every URL in it.

   The key must match public/<key>.txt, which is served at the site root. */

const SITE = "https://www.statoz.in";
const KEY = "5de3ca1f2d0479e180fb3af735db0780";

const sitemap = await fetch(`${SITE}/sitemap.xml`).then((res) => {
  if (!res.ok) throw new Error(`sitemap.xml returned ${res.status}`);
  return res.text();
});

const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (urlList.length === 0) throw new Error("No URLs found in sitemap.xml");

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: new URL(SITE).host,
    key: KEY,
    keyLocation: `${SITE}/${KEY}.txt`,
    urlList,
  }),
});

// 200 = accepted, 202 = accepted and key check pending.
console.log(`IndexNow: ${res.status} ${res.statusText} for ${urlList.length} URLs`);
if (res.status >= 300) process.exit(1);
