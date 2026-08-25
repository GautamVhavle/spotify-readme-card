#!/usr/bin/env node
// Ask GitHub's image proxy (camo) to drop its cached copy of every image on a
// page, so the next visitor gets a freshly rendered card.
//
// camo URLs are HMAC-signed by GitHub, so they cannot be derived locally — the
// only way to find them is to read the rendered HTML of the page they appear on.

const CAMO_URL = /https:\/\/camo\.githubusercontent\.com\/[a-f0-9]+\/[a-f0-9]+/g;

/** Pull every distinct camo image URL out of a rendered GitHub page. */
async function discover(pageUrl) {
  const response = await fetch(pageUrl, {
    headers: { "user-agent": "spotify-readme-card/purge" },
  });
  if (!response.ok) {
    throw new Error(`Could not read ${pageUrl} (HTTP ${response.status})`);
  }
  const html = await response.text();
  return [...new Set(html.match(CAMO_URL) ?? [])];
}

/** camo answers PURGE with `{"status":"ok"}` once the cached copy is gone. */
async function purge(url) {
  const response = await fetch(url, { method: "PURGE" });
  return response.ok;
}

const pages = process.argv.slice(2);
if (pages.length === 0) {
  console.error("Usage: node scripts/purge-camo.mjs <github-page-url>...");
  console.error("Example: node scripts/purge-camo.mjs https://github.com/you/you");
  process.exit(1);
}

let failures = 0;

for (const page of pages) {
  const urls = await discover(page);
  console.log(`${page} — ${urls.length} proxied image(s)`);

  for (const url of urls) {
    const ok = await purge(url);
    if (!ok) {
      failures += 1;
    }
    console.log(`  ${ok ? "purged " : "failed "} ${url.slice(0, 78)}…`);
  }
}

if (failures > 0) {
  console.error(`\n${failures} image(s) could not be purged.`);
  process.exit(1);
}

console.log("\nAll proxied images purged.");
