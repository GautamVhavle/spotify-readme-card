export interface Track {
  isPlaying: boolean;
  title: string;
  artist: string;
  album: string;
  url: string;
  artworkUrl: string | null;
  playedAt: string | null;
}

const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const NOW_PLAYING_ENDPOINT = "https://api.spotify.com/v1/me/player/currently-playing";
const RECENTLY_PLAYED_ENDPOINT =
  "https://api.spotify.com/v1/me/player/recently-played?limit=1";

/** Access tokens live for an hour, so reuse them while the lambda stays warm. */
let cachedToken: { value: string; expiresAt: number } | null = null;

function readCredentials() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      "Missing SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET or SPOTIFY_REFRESH_TOKEN",
    );
  }

  return { clientId, clientSecret, refreshToken };
}

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.value;
  }

  const { clientId, clientSecret, refreshToken } = readCredentials();
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    throw new Error(`Spotify token request failed (${response.status})`);
  }

  const data = (await response.json()) as {
    access_token: string;
    expires_in: number;
  };

  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };

  return cachedToken.value;
}

interface SpotifyItem {
  type?: string;
  name?: string;
  artists?: { name: string }[];
  album?: { name?: string; images?: { url: string; width: number }[] };
  external_urls?: { spotify?: string };
}

/** Spotify returns artwork widest-first; pick the smallest image that still looks sharp. */
function pickArtwork(item: SpotifyItem): string | null {
  const images = item.album?.images ?? [];
  const usable = images.filter((image) => image.width >= 240);
  const best = usable.length ? usable[usable.length - 1] : images[0];
  return best?.url ?? null;
}

function toTrack(
  item: SpotifyItem | undefined,
  isPlaying: boolean,
  playedAt: string | null,
): Track | null {
  if (!item || item.type !== "track" || !item.name) return null;

  return {
    isPlaying,
    title: item.name,
    artist: (item.artists ?? []).map((artist) => artist.name).join(", "),
    album: item.album?.name ?? "",
    url: item.external_urls?.spotify ?? "https://open.spotify.com",
    artworkUrl: pickArtwork(item),
    playedAt,
  };
}

async function getJson<T>(url: string, accessToken: string): Promise<T | null> {
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (response.status === 204 || response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`Spotify request failed (${response.status}): ${url}`);
  }

  return (await response.json()) as T;
}

/** Current track if something is playing, otherwise the most recently played one. */
export async function resolveTrack(): Promise<Track | null> {
  const accessToken = await getAccessToken();

  const current = await getJson<{ item?: SpotifyItem; is_playing?: boolean }>(
    NOW_PLAYING_ENDPOINT,
    accessToken,
  );

  const playing = toTrack(current?.item, Boolean(current?.is_playing), null);
  if (playing?.isPlaying) return playing;

  const recent = await getJson<{
    items?: { track?: SpotifyItem; played_at?: string }[];
  }>(RECENTLY_PLAYED_ENDPOINT, accessToken);

  const lastPlay = recent?.items?.[0];
  return toTrack(lastPlay?.track, false, lastPlay?.played_at ?? null) ?? playing;
}
