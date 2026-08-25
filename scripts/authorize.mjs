#!/usr/bin/env node
/**
 * One-time helper that turns your Spotify app credentials into a long-lived
 * refresh token and writes it to .env.
 *
 * Usage: npm run authorize
 */
import crypto from "node:crypto";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";

const HOST = "127.0.0.1";
const PORT = 5175;
const REDIRECT_URI = `http://${HOST}:${PORT}/callback`;
const SCOPES = ["user-read-currently-playing", "user-read-recently-played"];
const ENV_PATH = path.resolve(process.cwd(), ".env");

function loadEnv() {
  if (!fs.existsSync(ENV_PATH)) return {};

  const entries = fs
    .readFileSync(ENV_PATH, "utf8")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const index = line.indexOf("=");
      if (index === -1) return null;
      const key = line.slice(0, index).trim();
      const value = line
        .slice(index + 1)
        .trim()
        .replace(/^["']|["']$/g, "");
      return [key, value];
    })
    .filter(Boolean);

  return Object.fromEntries(entries);
}

function saveRefreshToken(token) {
  const original = fs.existsSync(ENV_PATH) ? fs.readFileSync(ENV_PATH, "utf8") : "";
  const line = `SPOTIFY_REFRESH_TOKEN=${token}`;
  const matcher = /^SPOTIFY_REFRESH_TOKEN=.*$/m;
  const updated = matcher.test(original)
    ? original.replace(matcher, line)
    : `${original.trimEnd()}${original.trim() ? "\n" : ""}${line}\n`;

  fs.writeFileSync(ENV_PATH, updated, { mode: 0o600 });
}

const env = { ...loadEnv(), ...process.env };
const clientId = env.SPOTIFY_CLIENT_ID;
const clientSecret = env.SPOTIFY_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  console.error(
    "Missing credentials.\n" +
      "Copy .env.example to .env and fill in SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET first.",
  );
  process.exit(1);
}

const state = crypto.randomBytes(24).toString("hex");
const authorizeUrl = new URL("https://accounts.spotify.com/authorize");
authorizeUrl.search = new URLSearchParams({
  client_id: clientId,
  response_type: "code",
  redirect_uri: REDIRECT_URI,
  scope: SCOPES.join(" "),
  state,
  show_dialog: "true",
}).toString();

async function exchangeCode(code) {
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
    }),
  });

  const data = await response.json();
  if (!response.ok || !data.refresh_token) {
    throw new Error(data.error_description || data.error || "Token exchange failed");
  }

  const playback = await fetch(
    "https://api.spotify.com/v1/me/player/currently-playing",
    { headers: { Authorization: `Bearer ${data.access_token}` } },
  );

  if (![200, 204].includes(playback.status)) {
    throw new Error(
      `Scope check failed (${playback.status}). Re-run and accept all permissions.`,
    );
  }

  return data.refresh_token;
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", REDIRECT_URI);
  if (url.pathname !== "/callback") {
    response.writeHead(404).end("Not found");
    return;
  }

  try {
    if (url.searchParams.get("state") !== state)
      throw new Error("OAuth state mismatch");

    const error = url.searchParams.get("error");
    if (error) throw new Error(`Spotify denied the request: ${error}`);

    const code = url.searchParams.get("code");
    if (!code) throw new Error("Spotify did not return an authorization code");

    const refreshToken = await exchangeCode(code);
    saveRefreshToken(refreshToken);

    response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    response.end(
      "<h1>Spotify connected</h1><p>Refresh token saved to .env. You can close this tab.</p>",
    );
    console.log("\n✅ SPOTIFY_REFRESH_TOKEN saved to .env");
    console.log("   Next: add the three variables to Vercel and deploy.\n");
  } catch (failure) {
    response.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Authorization failed. Check your terminal.");
    console.error(`\n❌ ${failure instanceof Error ? failure.message : failure}\n`);
    process.exitCode = 1;
  } finally {
    server.close();
  }
});

server.listen(PORT, HOST, () => {
  console.log(
    `\nMake sure "${REDIRECT_URI}" is listed as a Redirect URI in your Spotify app.`,
  );
  console.log("\nThen open this URL in your browser:\n");
  console.log(authorizeUrl.toString());
  console.log("");
});
