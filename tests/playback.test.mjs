import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { resolveTrack, selectTrack } from "../.build/_lib/spotify.js";

const song = {
  type: "track",
  name: "Cracks",
  artists: [{ name: "Freestylers" }],
  album: {
    name: "Cracks",
    images: [{ url: "https://i.scdn.co/image/cover", width: 300 }],
  },
  external_urls: { spotify: "https://open.spotify.com/track/1" },
};

const older = {
  items: [
    {
      track: { ...song, name: "Older" },
      played_at: "2020-01-01T00:00:00.000Z",
    },
  ],
};

describe("selectTrack", () => {
  it("keeps a paused track instead of an older play", () => {
    const track = selectTrack({ is_playing: false, item: song }, older);
    assert.equal(track.title, "Cracks");
    assert.equal(track.isPlaying, false);
    assert.equal(track.paused, true);
    assert.equal(track.playedAt, null);
  });

  it("keeps a podcast that is on now", () => {
    const track = selectTrack(
      {
        is_playing: true,
        item: {
          type: "episode",
          name: "Pilot",
          show: { name: "Night School" },
          images: [{ url: "https://i.scdn.co/image/episode", width: 300 }],
          external_urls: { spotify: "https://open.spotify.com/episode/1" },
        },
      },
      older,
    );
    assert.equal(track.title, "Pilot");
    assert.equal(track.artist, "Night School");
    assert.equal(track.album, "");
    assert.equal(track.isPlaying, true);
    assert.equal(track.artworkUrl, "https://i.scdn.co/image/episode");
  });

  it("uses history only when the player has nothing loaded", () => {
    const track = selectTrack(null, older);
    assert.equal(track.title, "Older");
    assert.equal(track.paused, false);
    assert.equal(track.playedAt, "2020-01-01T00:00:00.000Z");
  });
});

describe("resolveTrack", () => {
  const previousFetch = global.fetch;

  afterEach(() => {
    global.fetch = previousFetch;
  });

  it("fetches a new access token once after Spotify rejects the cached one", async () => {
    process.env.SPOTIFY_CLIENT_ID = "id";
    process.env.SPOTIFY_CLIENT_SECRET = "secret";
    process.env.SPOTIFY_REFRESH_TOKEN = "refresh";

    let playingHits = 0;
    let tokenHits = 0;
    const authorizations = [];

    global.fetch = async (url, init) => {
      const href = String(url);
      const authorization = new Headers(init?.headers).get("authorization");

      if (href.includes("accounts.spotify.com")) {
        tokenHits += 1;
        return Response.json({
          access_token: `token-${tokenHits}`,
          expires_in: 3600,
        });
      }
      if (href.includes("currently-playing")) {
        playingHits += 1;
        authorizations.push(authorization);
        return new Response(null, { status: playingHits === 1 ? 401 : 204 });
      }
      return Response.json({ items: [] });
    };

    const track = await resolveTrack();
    assert.equal(track, null);
    assert.equal(playingHits, 2);
    assert.ok(tokenHits >= 1);
    assert.notEqual(authorizations[0], authorizations[1]);
  });
});
