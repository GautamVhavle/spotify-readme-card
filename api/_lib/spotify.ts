export interface Track {
  isPlaying: boolean;
  /** Current item with playback stopped. History leaves this false. */
  paused: boolean;
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

interface SpotifyImage {
  url: string;
  width?: number;
}

interface SpotifyItem {
  type?: string;
  name?: string;
  artists?: { name: string }[];
  album?: { name?: string; images?: SpotifyImage[] };
  show?: { name?: string; images?: SpotifyImage[] };
  images?: SpotifyImage[];
  external_urls?: { spotify?: string };
}

interface Playback {
  item?: SpotifyItem;
  is_playing?: boolean;
}

interface RecentPlays {
  items?: { track?: SpotifyItem; played_at?: string }[];
}

/** Spotify returns artwork widest-first; pick the smallest image that still looks sharp. */
function pickArtwork(item: SpotifyItem): string | null {
  const images = item.album?.images ?? item.images ?? item.show?.images ?? [];
  const usable = images.filter((image) => (image.width ?? 0) >= 240);
  const best = usable.length ? usable[usable.length - 1] : images[0];
  return best?.url ?? null;
}

function toTrack(
  item: SpotifyItem | undefined,
  isPlaying: boolean,
  playedAt: string | null,
  paused = false,
): Track | null {
  const episode = item?.type === "episode";
  if (!item?.name || (item.type !== "track" && !episode)) return null;

  return {
    isPlaying,
    paused,
    title: item.name,
    artist: episode
      ? (item.show?.name ?? "")
      : (item.artists ?? []).map((artist) => artist.name).join(", "),
    album: episode ? "" : (item.album?.name ?? ""),
    url: item.external_urls?.spotify ?? "https://open.spotify.com",
    artworkUrl: pickArtwork(item),
    playedAt,
  };
}

/**
 * The current item wins, including a pause or a podcast. Recently played only
 * lists tracks that have finished, so history would show an older song.
 */
export function selectTrack(
  current: Playback | null,
  recent: RecentPlays | null,
): Track | null {
  const active = Boolean(current?.is_playing);
  const playing = toTrack(
    current?.item,
    active,
    null,
    Boolean(current?.item) && !active,
  );
  if (playing) return playing;

  const lastPlay = recent?.items?.[0];
  return toTrack(lastPlay?.track, false, lastPlay?.played_at ?? null);
}

async function getJson<T>(
  url: string,
  accessToken: string,
  allowRefresh = true,
): Promise<T | null> {
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (response.status === 401 && allowRefresh) {
    cachedToken = null;
    return getJson<T>(url, await getAccessToken(), false);
  }

  if (response.status === 204 || response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`Spotify request failed (${response.status}): ${url}`);
  }

  return (await response.json()) as T;
}

/** Current listen if the player has one, otherwise the most recently played track. */
export async function resolveTrack(): Promise<Track | null> {
  const accessToken = await getAccessToken();
  const current = await getJson<Playback>(NOW_PLAYING_ENDPOINT, accessToken);
  const playing = selectTrack(current, null);
  if (playing) return playing;

  const recent = await getJson<RecentPlays>(RECENTLY_PLAYED_ENDPOINT, accessToken);
  return selectTrack(null, recent);
}
