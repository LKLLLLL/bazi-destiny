const HOST = 'mybazidestiny.com';
const KEY = '272bd5de5baf4ae5b83bf3b043803fa9';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const urls = [...new Set(process.argv.slice(2))];

if (urls.length === 0) {
  console.error('Usage: pnpm indexnow:submit https://mybazidestiny.com/page.html [...]');
  process.exit(1);
}

for (const value of urls) {
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.hostname !== HOST) {
    throw new Error(`IndexNow URL must use the canonical host: ${value}`);
  }
}

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: urls }),
});

if (!response.ok) {
  throw new Error(`IndexNow submission failed: HTTP ${response.status} ${await response.text()}`);
}

console.log(`IndexNow accepted ${urls.length} URL(s): HTTP ${response.status}`);
