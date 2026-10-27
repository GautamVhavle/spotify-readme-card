import type { VercelRequest, VercelResponse } from "@vercel/node";
import { fetchArtwork } from "./artwork.js";
import { applyNoCache } from "./cache.js";
import { parseOptions, type Variant } from "./options.js";
import {
  renderMainCard,
  renderMessageCard,
  renderPortraitCard,
  renderSmallCard,
} from "./render.js";
import { resolveTrack } from "./spotify.js";

function unavailableDetail(error: unknown): string {
  const message = error instanceof Error ? error.message : "";
  if (
    message.startsWith("Missing SPOTIFY_") ||
    message.startsWith("Spotify token request failed")
  ) {
    return "Check the deployment environment variables";
  }
  return "Playback could not be loaded";
}

export function createCardHandler(variant: Variant) {
  return async function handler(
    request: VercelRequest,
    response: VercelResponse,
  ): Promise<void> {
    if (request.method !== "GET" && request.method !== "HEAD") {
      response.setHeader("Allow", "GET, HEAD");
      response.status(405).json({ error: "Method not allowed" });
      return;
    }

    const options = parseOptions(request.query, variant);
    let svg: string;

    try {
      const track = await resolveTrack();

      if (!track) {
        svg = renderMessageCard(
          options,
          "Nothing playing",
          "No recent Spotify activity",
        );
      } else {
        const artwork = await fetchArtwork(track.artworkUrl);
        svg =
          variant === "main"
            ? renderMainCard(track, artwork, options)
            : variant === "portrait"
              ? renderPortraitCard(track, artwork, options)
              : renderSmallCard(track, artwork, options);
      }
    } catch (error) {
      // Details stay in the function logs; the card only shows a generic hint.
      console.error("Failed to render Spotify card:", error);
      svg = renderMessageCard(options, "Spotify unavailable", unavailableDetail(error));
    }

    response.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
    applyNoCache(response);
    response.status(200).send(svg);
  };
}
