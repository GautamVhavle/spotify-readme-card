/**
 * GitHub proxies README images through camo, which refuses to load remote
 * resources referenced from inside an SVG. Artwork therefore has to be
 * inlined as a data URI.
 */

const ALLOWED_HOSTS = new Set([
  "i.scdn.co",
  "mosaic.scdn.co",
  "lineup-images.scdn.co",
  "image-cdn-ak.spotifycdn.com",
  "image-cdn-fa.spotifycdn.com",
]);

const MAX_BYTES = 2_000_000;
const CACHE_LIMIT = 16;

const cache = new Map<string, string>();

export async function fetchArtwork(url: string | null): Promise<string | null> {
  if (!url) return null;

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }

  if (parsed.protocol !== "https:" || !ALLOWED_HOSTS.has(parsed.hostname)) {
    return null;
  }

  const cached = cache.get(parsed.href);
  if (cached) return cached;

  try {
    const response = await fetch(parsed.href);
    if (!response.ok) return null;

    const contentType = response.headers.get("content-type") ?? "image/jpeg";
    if (!contentType.startsWith("image/")) return null;

    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.byteLength === 0 || buffer.byteLength > MAX_BYTES) return null;

    const dataUri = `data:${contentType};base64,${buffer.toString("base64")}`;

    if (cache.size >= CACHE_LIMIT) {
      const oldest = cache.keys().next().value;
      if (oldest) cache.delete(oldest);
    }
    cache.set(parsed.href, dataUri);

    return dataUri;
  } catch {
    return null;
  }
}
