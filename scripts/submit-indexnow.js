#!/usr/bin/env node
// Submits site URLs to the IndexNow API (Bing, Yandex, and other participating engines).
// Usage:
//   node scripts/submit-indexnow.js                 -> submits every URL in sitemap.xml
//   node scripts/submit-indexnow.js /blogs/foo/ ...  -> submits only the given path(s)

const fs = require('fs');
const path = require('path');
const https = require('https');

const HOST = 'aadityabhatnagar.online';
const KEY = '84f9b7d7034e45549f609cefd2e2d4d3';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const SITEMAP_PATH = path.join(__dirname, '..', 'sitemap.xml');

function urlsFromSitemap() {
  const xml = fs.readFileSync(SITEMAP_PATH, 'utf8');
  const matches = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)];
  return matches.map((m) => m[1]);
}

function urlsFromArgs(args) {
  return args.map((p) => (p.startsWith('http') ? p : `https://${HOST}${p}`));
}

function submit(urlList) {
  const payload = JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList,
  });

  const req = https.request(
    {
      hostname: 'api.indexnow.org',
      path: '/indexnow',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(payload),
      },
    },
    (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        console.log(`IndexNow responded ${res.statusCode}${body ? `: ${body}` : ''}`);
        console.log(`Submitted ${urlList.length} URL(s).`);
      });
    }
  );

  req.on('error', (err) => {
    console.error('IndexNow submission failed:', err.message);
    process.exitCode = 1;
  });

  req.write(payload);
  req.end();
}

const args = process.argv.slice(2);
const urlList = args.length ? urlsFromArgs(args) : urlsFromSitemap();

if (urlList.length === 0) {
  console.error('No URLs to submit.');
  process.exit(1);
}

submit(urlList);
