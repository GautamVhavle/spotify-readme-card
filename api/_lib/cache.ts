import type { VercelResponse } from "@vercel/node";

/**
 * Every response is rendered from live playback state, so nothing in front of
 * the function should keep a copy.
 *
 * `max-age` and `s-maxage` are spelled out on purpose: some shared caches only
 * look for an explicit zero lifetime and quietly ignore `no-store` on its own.
 */
const NO_CACHE = "no-cache, no-store, must-revalidate, max-age=0, s-maxage=0";

/**
 * Tells browsers, Vercel's edge, and GitHub's image proxy to revalidate on
 * every request. `Surrogate-Control` is the directive Fastly reads first, and
 * GitHub's camo proxy runs on Fastly.
 */
export function applyNoCache(response: VercelResponse): void {
  response.setHeader("Cache-Control", NO_CACHE);
  response.setHeader("CDN-Cache-Control", NO_CACHE);
  response.setHeader("Surrogate-Control", "max-age=0, no-store");
  response.setHeader("Pragma", "no-cache");
  response.setHeader("Expires", "0");
}
