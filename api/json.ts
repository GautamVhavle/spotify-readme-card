import type { VercelRequest, VercelResponse } from "@vercel/node";
import { resolveTrack } from "./_lib/spotify.js";

/** Plain JSON view of the same data the cards use — handy while debugging a setup. */
export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
): Promise<void> {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    response.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const track = await resolveTrack();
    response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    response.status(200).json({ track });
  } catch (error) {
    console.error("Failed to read Spotify playback:", error);
    response.status(503).json({ error: "Spotify playback is unavailable" });
  }
}
