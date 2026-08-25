<div align="center">

# Spotify README Card

**Animated “now playing” cards for your GitHub profile, rendered as SVG on Vercel.**

<img src="https://gautamvhavle-spotify-readme.vercel.app/" alt="Spotify now playing card" width="420" />

<br />

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FGautamVhavle%2Fspotify-readme&env=SPOTIFY_CLIENT_ID,SPOTIFY_CLIENT_SECRET,SPOTIFY_REFRESH_TOKEN&envDescription=Spotify%20app%20credentials%20and%20a%20refresh%20token&envLink=https%3A%2F%2Fgithub.com%2FGautamVhavle%2Fspotify-readme%233-generate-a-refresh-token)
[![License: MIT](https://img.shields.io/badge/license-MIT-1db954?style=flat-square)](LICENSE)

</div>

---

## What this is

A tiny serverless service that asks the Spotify Web API what you are listening to
and answers with an **SVG image**. Because it is an image, you can drop it straight
into a GitHub profile README, a Gist, a blog, or anywhere else that accepts a URL.

- Shows the **current track** when you are playing something.
- Falls back to your **last played track** (with a relative timestamp) when you are not.
- **Animated** — equalizer bars pulse while playing, long titles scroll.
- **Album art is embedded** as a data URI, so it survives GitHub's image proxy.
- **Two layouts** and **eleven themes**, all configurable through the query string.
- No database, no cron job, no dependencies at runtime.

## Card variants

| Variant | Path | Default size | Looks like |
| --- | --- | --- | --- |
| Detailed | `/` | 420 × 142 | Blurred album backdrop, artwork, status, title, artist, album |
| Compact | `/small` | 340 × 76 | Widget-style strip: artwork, status, title, artist |
| Raw JSON | `/json` | — | The same data as JSON, for debugging |

```md
<!-- detailed -->
<img src="https://YOUR-APP.vercel.app/" alt="Spotify" width="420" />

<!-- compact -->
<img src="https://YOUR-APP.vercel.app/small" alt="Spotify" width="340" />
```

Want the card to be clickable? Wrap it in a link:

```md
[![Spotify](https://YOUR-APP.vercel.app/)](https://open.spotify.com/user/YOUR_USER_ID)
```

> GitHub strips `<a>` elements from inside an SVG, so the link has to be on the outside.

---

## Setup

You need a [Spotify account](https://spotify.com), a [GitHub account](https://github.com),
a [Vercel account](https://vercel.com), and Node.js 20 or newer.

### 1. Create a Spotify app

1. Open the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) and click **Create app**.
2. Name it anything (for example `readme-card`).
3. Under **Redirect URIs**, add exactly:

   ```text
   http://127.0.0.1:5175/callback
   ```

4. Tick **Web API**, save, then open **Settings** and copy your **Client ID** and **Client secret**.

### 2. Get the code

```bash
git clone https://github.com/GautamVhavle/spotify-readme.git
cd spotify-readme
npm install
cp .env.example .env
```

Fill in the two values you just copied:

```ini
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
SPOTIFY_REFRESH_TOKEN=
```

### 3. Generate a refresh token

```bash
npm run authorize
```

The script prints an authorization URL. Open it, approve the request, and the refresh
token is written back into your `.env` automatically. It does not expire, so this is a
one-time step.

Verify it worked:

```bash
npm run dev          # requires the Vercel CLI: npm i -g vercel
open http://localhost:3000/
```

### 4. Deploy to Vercel

<details>
<summary><b>Option A — one click</b></summary>

Use the **Deploy with Vercel** button at the top. Vercel forks the repo and asks for the
three environment variables during setup.

</details>

<details>
<summary><b>Option B — Vercel dashboard</b></summary>

1. Go to [vercel.com/new](https://vercel.com/new) and import your fork.
2. Leave the framework preset as **Other**; there is no build step.
3. Add three environment variables:

   | Name | Value |
   | --- | --- |
   | `SPOTIFY_CLIENT_ID` | from step 1 |
   | `SPOTIFY_CLIENT_SECRET` | from step 1 |
   | `SPOTIFY_REFRESH_TOKEN` | from step 3 |

4. Click **Deploy**.

</details>

<details>
<summary><b>Option C — Vercel CLI</b></summary>

```bash
npm i -g vercel
vercel link

for key in SPOTIFY_CLIENT_ID SPOTIFY_CLIENT_SECRET SPOTIFY_REFRESH_TOKEN; do
  grep "^$key=" .env | cut -d= -f2- | tr -d '\n' | vercel env add "$key" production
done

vercel --prod
```

</details>

### 5. Add it to your README

Replace `YOUR-APP` with your deployment's domain:

```md
<img src="https://YOUR-APP.vercel.app/" alt="What I'm listening to" width="420" />
```

---

## Customisation

Every option is a query parameter, so you can tune the card without touching the code.

| Parameter | Values | Default | Description |
| --- | --- | --- | --- |
| `theme` | see below | `dark` | Colour preset |
| `width` | `320`–`760` (`260`–`560` on `/small`) | `420` / `340` | Card width in pixels |
| `radius` | `0`–`40` | `16` / `14` | Corner radius |
| `bars` | `true` / `false` | `true` | Animated equalizer while playing |
| `blur` | `true` / `false` | `true` on `/`, `false` on `/small` | Blurred album-art backdrop |
| `show_border` | `true` / `false` | `true` | Outer border |
| `bg` | hex | theme | Background colour |
| `surface` | hex | theme | Secondary surface / veil colour |
| `text` | hex | theme | Track title colour |
| `sub` | hex | theme | Artist and album colour |
| `accent` | hex | theme | Spotify logo, status text, equalizer |
| `border` | hex | theme | Border colour |

Colours accept 3, 4, 6 or 8 digit hex **without** the `#` (it is a URL fragment character),
plus the keyword `transparent`. Anything else falls back to the theme value.

### Themes

`dark` · `light` · `spotify` · `dracula` · `nord` · `catppuccin` · `tokyonight` · `gruvbox` · `rosepine` · `synthwave` · `transparent`

### Examples

```md
<!-- Compact widget, Dracula -->
<img src="https://YOUR-APP.vercel.app/small?theme=dracula" width="340" />

<!-- Wide card, no border, square corners -->
<img src="https://YOUR-APP.vercel.app/?width=600&radius=0&show_border=false" width="600" />

<!-- Transparent background so it adapts to GitHub's light/dark mode -->
<img src="https://YOUR-APP.vercel.app/?theme=transparent&text=888888" width="420" />

<!-- Fully custom palette -->
<img src="https://YOUR-APP.vercel.app/?bg=0f0f0f&accent=ff2d55&text=fafafa&sub=737373" width="420" />
```

---

## How it works

```text
GitHub README  ──▶  camo image proxy  ──▶  Vercel function
                                              │
                                              ├─ refresh token ─▶ Spotify access token (cached in memory)
                                              ├─ /me/player/currently-playing
                                              ├─ /me/player/recently-played  (fallback)
                                              ├─ album art ─▶ base64 data URI
                                              └─ SVG string
```

A few decisions worth knowing about:

- **Album art must be inlined.** GitHub serves README images through its `camo` proxy,
  which will not load remote resources referenced from inside an SVG. The function
  downloads the cover and embeds it as a base64 data URI.
- **Animation is CSS, not GIF.** CSS keyframes inside an SVG do run when the SVG is loaded
  through an `<img>` tag, which keeps the card vector-sharp at any scale and small on the wire.
- **Text is measured by approximation.** There is no DOM in a serverless function, so
  character widths are estimated to decide when to truncate or scroll a line.
- **Tailwind is not used at runtime.** A standalone SVG has no build pipeline or class
  engine, so the styles are hand-authored CSS inside the document. The theme palettes
  still follow the same token structure (`bg` / `surface` / `text` / `subtext` / `accent` / `border`).
- **Freshness.** The function sends `Cache-Control: no-store`, but GitHub's proxy caches
  images for a few minutes regardless. Expect the card to lag reality slightly.

## Project structure

```text
api/
  card.ts            # GET /        detailed card
  small.ts           # GET /small   compact card
  json.ts            # GET /json    raw track data
  _lib/
    spotify.ts       # token refresh + now-playing / recently-played
    artwork.ts       # album art -> base64 data URI (host allow-list, LRU cache)
    themes.ts        # colour presets
    options.ts       # query-string parsing and validation
    svg.ts           # text measurement, marquee, equalizer, icons
    render.ts        # card layouts
    handler.ts       # shared request handler
scripts/
  authorize.mjs      # one-time OAuth helper
```

Files inside `api/_lib/` start with an underscore, so Vercel treats them as shared
modules instead of routes.

## Local development

```bash
npm install
npm run dev        # vercel dev on http://localhost:3000
npm run typecheck  # tsc --noEmit
```

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| Card says *Spotify unavailable* | One of the three environment variables is missing or wrong on Vercel. Check the function logs. |
| Card says *Nothing playing* | Spotify has no playback history for the account, or the token was created without the required scopes. Re-run `npm run authorize`. |
| `INVALID_CLIENT: Invalid redirect URI` | The redirect URI in the Spotify dashboard must be exactly `http://127.0.0.1:5175/callback`. Spotify rejects `localhost`. |
| Card never updates | GitHub's image proxy is caching it. Wait a few minutes, or hard-refresh with cache disabled. |
| Card is blank in a Markdown preview | Some editors block SVG animation. Test the URL in a browser first. |
| Changed my Spotify password | Refresh tokens are revoked on password change. Re-run `npm run authorize` and update the Vercel variable. |

## Security notes

- The refresh token is only ever read server-side; it is never included in the SVG.
- Colour parameters are validated against a strict hex pattern before being written into
  the document, and all track text is XML-escaped.
- Artwork is only fetched from Spotify's own CDN hosts.
- Runtime errors are logged to Vercel, never rendered into the card.

## Contributing

Issues and pull requests are welcome. If you add a theme, keep all six tokens defined and
check it against both the detailed and compact layouts.

## Credits

Inspired by [radioactive11/apple-music-readme](https://github.com/radioactive11/apple-music-readme).

## License

[MIT](LICENSE) © Gautam Vhavle
