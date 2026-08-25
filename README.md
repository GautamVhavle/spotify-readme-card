<div align="center">

<img src="https://gautamvhavle-spotify-readme.vercel.app/" alt="Spotify now playing card" width="440" />

<h1>Spotify README Card</h1>

<p><b>Animated “now playing” cards for your GitHub profile — rendered as SVG, served from the edge.</b></p>

<p>
  <a href="https://github.com/GautamVhavle/spotify-readme/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/GautamVhavle/spotify-readme/actions/workflows/ci.yml/badge.svg" /></a>
  <a href="https://github.com/GautamVhavle/spotify-readme/actions/workflows/smoke.yml"><img alt="Smoke test" src="https://github.com/GautamVhavle/spotify-readme/actions/workflows/smoke.yml/badge.svg" /></a>
  <a href="LICENSE"><img alt="License" src="https://img.shields.io/badge/license-MIT-1db954?style=flat-square" /></a>
  <img alt="Node" src="https://img.shields.io/badge/node-%E2%89%A520-1db954?style=flat-square" />
  <img alt="Runtime dependencies" src="https://img.shields.io/badge/runtime%20deps-0-1db954?style=flat-square" />
</p>

<p>
  <a href="https://gautamvhavle-spotify-readme.vercel.app/"><b>Live demo</b></a>
  ·
  <a href="#gallery">Gallery</a>
  ·
  <a href="#setup">Setup</a>
  ·
  <a href="#api-reference">API</a>
  ·
  <a href="#contributing">Contributing</a>
</p>

<a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FGautamVhavle%2Fspotify-readme&env=SPOTIFY_CLIENT_ID,SPOTIFY_CLIENT_SECRET,SPOTIFY_REFRESH_TOKEN&envDescription=Spotify%20app%20credentials%20and%20a%20refresh%20token&envLink=https%3A%2F%2Fgithub.com%2FGautamVhavle%2Fspotify-readme%23step-3--generate-a-refresh-token&project-name=spotify-readme&repository-name=spotify-readme"><img src="https://vercel.com/button" alt="Deploy with Vercel" height="32" /></a>

</div>

---

## Overview

A small serverless service that asks the Spotify Web API what you are listening to and
answers with an **SVG image**. Because the response is an image, it works anywhere a URL
does — GitHub profile READMEs, Gists, blogs, docs sites.

|                             |                                                                                                                    |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Live status**             | Shows the current track while you are playing, your last played track (with a relative timestamp) when you are not |
| **Actually animated**       | CSS keyframes inside the SVG — equalizer bars pulse, long titles scroll                                            |
| **Survives GitHub's proxy** | Album art is inlined as base64, so nothing is blocked by camo                                                      |
| **Two layouts**             | A detailed card and a compact widget                                                                               |
| **Eleven themes**           | Plus six per-token colour overrides for anything custom                                                            |
| **Zero runtime deps**       | One `fetch` chain and a string of SVG. Cold starts stay in the low hundreds of milliseconds                        |
| **Tested and typed**        | Strict TypeScript, 24 renderer tests, CI on every push                                                             |

---

## Gallery

### Layouts

<div align="center">

<img src="https://gautamvhavle-spotify-readme.vercel.app/" alt="Detailed card" width="420" />

<sub><b>Detailed</b> — <code>/</code> — 420 × 142<br/>Blurred album backdrop, artwork, status line, title, artist and album.</sub>

<br/><br/>

<img src="https://gautamvhavle-spotify-readme.vercel.app/small" alt="Compact card" width="340" />

<sub><b>Compact</b> — <code>/small</code> — 340 × 76<br/>Widget-style strip: artwork, status, title, artist and logo.</sub>

</div>

### Themes

Set with `?theme=`. Every one works on both layouts.

<table>
<tbody>
<tr>
<td align="center"><img src="https://gautamvhavle-spotify-readme.vercel.app/small?theme=dark" alt="dark theme" width="340" /><br/><code>dark</code> <sub>default</sub></td>
<td align="center"><img src="https://gautamvhavle-spotify-readme.vercel.app/small?theme=light" alt="light theme" width="340" /><br/><code>light</code></td>
</tr>
<tr>
<td align="center"><img src="https://gautamvhavle-spotify-readme.vercel.app/small?theme=spotify" alt="spotify theme" width="340" /><br/><code>spotify</code></td>
<td align="center"><img src="https://gautamvhavle-spotify-readme.vercel.app/small?theme=dracula" alt="dracula theme" width="340" /><br/><code>dracula</code></td>
</tr>
<tr>
<td align="center"><img src="https://gautamvhavle-spotify-readme.vercel.app/small?theme=nord" alt="nord theme" width="340" /><br/><code>nord</code></td>
<td align="center"><img src="https://gautamvhavle-spotify-readme.vercel.app/small?theme=catppuccin" alt="catppuccin theme" width="340" /><br/><code>catppuccin</code></td>
</tr>
<tr>
<td align="center"><img src="https://gautamvhavle-spotify-readme.vercel.app/small?theme=tokyonight" alt="tokyonight theme" width="340" /><br/><code>tokyonight</code></td>
<td align="center"><img src="https://gautamvhavle-spotify-readme.vercel.app/small?theme=gruvbox" alt="gruvbox theme" width="340" /><br/><code>gruvbox</code></td>
</tr>
<tr>
<td align="center"><img src="https://gautamvhavle-spotify-readme.vercel.app/small?theme=rosepine" alt="rosepine theme" width="340" /><br/><code>rosepine</code></td>
<td align="center"><img src="https://gautamvhavle-spotify-readme.vercel.app/small?theme=synthwave" alt="synthwave theme" width="340" /><br/><code>synthwave</code></td>
</tr>
<tr>
<td align="center"><img src="https://gautamvhavle-spotify-readme.vercel.app/small?theme=transparent" alt="transparent theme" width="340" /><br/><code>transparent</code> <sub>adapts to the page</sub></td>
<td align="center"><img src="https://gautamvhavle-spotify-readme.vercel.app/small?bg=0f0f0f&accent=ff2d55&text=fafafa&sub=737373&border=1f1f1f" alt="custom palette" width="340" /><br/><sub>custom hex overrides</sub></td>
</tr>
</tbody>
</table>

### Variations

<div align="center">

<img src="https://gautamvhavle-spotify-readme.vercel.app/?width=600&theme=tokyonight" alt="Wide card" width="600" />

<sub><code>/?width=600&theme=tokyonight</code></sub>

<br/><br/>

<img src="https://gautamvhavle-spotify-readme.vercel.app/?theme=dracula&blur=false&radius=4" alt="Flat card without backdrop" width="420" />

<sub><code>/?theme=dracula&blur=false&radius=4</code></sub>

<br/><br/>

<img src="https://gautamvhavle-spotify-readme.vercel.app/small?theme=catppuccin&width=460&radius=24" alt="Wide compact card" width="460" />

<sub><code>/small?theme=catppuccin&width=460&radius=24</code></sub>

</div>

---

## Setup

> **You need:** a Spotify account, a [Vercel](https://vercel.com) account, and Node.js 20+.
> The whole thing takes about five minutes and costs nothing.

### Step 1 — Create a Spotify app

1. Open the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) → **Create app**.
2. Give it any name, for example `readme-card`.
3. Under **Redirect URIs** add exactly this, then press **Add**:

   ```text
   http://127.0.0.1:5175/callback
   ```

   > Spotify rejects `localhost`. It has to be the loopback IP.

4. Tick **Web API**, save, then open **Settings** and copy the **Client ID** and **Client secret**.

### Step 2 — Get the code

```bash
git clone https://github.com/GautamVhavle/spotify-readme.git
cd spotify-readme
npm install
cp .env.example .env
```

Put the two values from step 1 into `.env`:

```ini
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
SPOTIFY_REFRESH_TOKEN=
```

### Step 3 — Generate a refresh token

```bash
npm run authorize
```

The script prints an authorization URL. Open it, approve the request, and your refresh
token is written back into `.env` automatically. Refresh tokens do not expire, so this is
a one-time step.

Check it locally:

```bash
npm i -g vercel     # if you do not have it
npm run dev         # http://localhost:3000
```

### Step 4 — Deploy

<details>
<summary><b>Option A — one click</b> <i>(fastest)</i></summary>

<br/>

Press the **Deploy with Vercel** button at the top. Vercel clones the repo into your account
and prompts for the three environment variables during setup.

</details>

<details>
<summary><b>Option B — Vercel dashboard</b> <i>(recommended, gives you auto-deploy)</i></summary>

<br/>

1. Push your clone to your own GitHub repository.
2. Go to [vercel.com/new](https://vercel.com/new) and import it.
3. Leave the framework preset as **Other** — there is no build step.
4. Add three environment variables:

   | Name                    | Value       |
   | ----------------------- | ----------- |
   | `SPOTIFY_CLIENT_ID`     | from step 1 |
   | `SPOTIFY_CLIENT_SECRET` | from step 1 |
   | `SPOTIFY_REFRESH_TOKEN` | from step 3 |

5. **Deploy**. Every later push to `main` redeploys automatically.

</details>

<details>
<summary><b>Option C — Vercel CLI</b></summary>

<br/>

```bash
npm i -g vercel
vercel link

for key in SPOTIFY_CLIENT_ID SPOTIFY_CLIENT_SECRET SPOTIFY_REFRESH_TOKEN; do
  grep "^$key=" .env | cut -d= -f2- | tr -d '\n' | vercel env add "$key" production
done

vercel --prod
```

</details>

### Step 5 — Put it in your README

```md
<img src="https://YOUR-APP.vercel.app/" alt="What I'm listening to" width="420" />
```

Make it clickable by wrapping it in a link:

```md
[![Spotify](https://YOUR-APP.vercel.app/)](https://open.spotify.com/user/YOUR_USER_ID)
```

> GitHub strips `<a>` elements from inside an SVG, so the link has to sit on the outside.

---

## API reference

### Endpoints

| Method | Path     | Response           | Description                                    |
| ------ | -------- | ------------------ | ---------------------------------------------- |
| `GET`  | `/`      | `image/svg+xml`    | Detailed card, 420 × 142                       |
| `GET`  | `/small` | `image/svg+xml`    | Compact card, 340 × 76                         |
| `GET`  | `/json`  | `application/json` | Raw track data — useful when debugging a setup |

Anything other than `GET` returns `405`. Errors always return a rendered card rather than a
broken image, so your README never shows a torn thumbnail.

### Query parameters

Both card endpoints accept the same options.

| Parameter     | Values                                | Default                            | Description                      |
| ------------- | ------------------------------------- | ---------------------------------- | -------------------------------- |
| `theme`       | see the [gallery](#themes)            | `dark`                             | Colour preset                    |
| `width`       | `320`–`760` (`260`–`560` on `/small`) | `420` / `340`                      | Card width in pixels             |
| `radius`      | `0`–`40`                              | `16` / `14`                        | Corner radius                    |
| `bars`        | `true` / `false`                      | `true`                             | Animated equalizer while playing |
| `blur`        | `true` / `false`                      | `true` on `/`, `false` on `/small` | Blurred album-art backdrop       |
| `show_border` | `true` / `false`                      | `true`                             | Outer border                     |
| `bg`          | hex                                   | theme                              | Card background                  |
| `surface`     | hex                                   | theme                              | Veil and artwork placeholder     |
| `text`        | hex                                   | theme                              | Track title                      |
| `sub`         | hex                                   | theme                              | Artist and album                 |
| `accent`      | hex                                   | theme                              | Logo, status line and equalizer  |
| `border`      | hex                                   | theme                              | Border and artwork ring          |

Colours take 3, 4, 6 or 8 hex digits **without** the leading `#` (it is a URL fragment
character), plus the keyword `transparent`. Anything that does not match is ignored and the
theme value is used instead. Booleans accept `true`/`false`, `1`/`0`, `yes`/`no`, `on`/`off`.

### Examples

```md
<!-- Compact widget in Dracula -->
<img src="https://YOUR-APP.vercel.app/small?theme=dracula" width="340" />

<!-- Wide, flat, no border -->
<img src="https://YOUR-APP.vercel.app/?width=600&radius=0&show_border=false" width="600" />

<!-- Transparent so it works in both GitHub colour modes -->
<img src="https://YOUR-APP.vercel.app/?theme=transparent&text=888888" width="420" />

<!-- Fully custom palette -->
<img src="https://YOUR-APP.vercel.app/?bg=0f0f0f&accent=ff2d55&text=fafafa&sub=737373" width="420" />
```

---

## How it works

```text
GitHub README
     │
     ▼
camo image proxy
     │
     ▼
Vercel function  ──▶  refresh token  ──▶  access token   (cached while warm)
     │
     ├──▶  GET /me/player/currently-playing
     ├──▶  GET /me/player/recently-played        (fallback)
     ├──▶  album art  ──▶  base64 data URI       (allow-listed hosts)
     │
     ▼
  SVG string
```

Four decisions worth knowing about:

- **Album art has to be inlined.** GitHub serves README images through its `camo` proxy,
  which refuses to load remote resources referenced from inside an SVG. The function
  downloads the cover and embeds it as a data URI.
- **The animation is CSS, not a GIF.** CSS keyframes inside an SVG do run when the SVG is
  loaded through an `<img>` tag. That keeps the card vector-sharp at any size and far
  smaller on the wire than an animated raster image.
- **Text is measured by approximation.** There is no DOM in a serverless function, so
  character widths are estimated from a ratio table to decide when to truncate a line or
  scroll it.
- **Tailwind cannot run here.** A standalone SVG has no build pipeline and no class engine,
  so the styles are hand-authored CSS inside the document. The palettes still follow the
  same six-token structure (`bg` / `surface` / `text` / `subtext` / `accent` / `border`), so
  adding a theme feels like editing a design system.

### Caching and freshness

The function sends `Cache-Control: no-store`, but GitHub's proxy caches images for a few
minutes regardless of what the origin says. Expect the card to trail reality slightly — that
is a property of GitHub, not of this service. Opening the URL directly is always live.

---

## Project structure

```text
api/
├── card.ts               GET /        detailed card
├── small.ts              GET /small   compact card
├── json.ts               GET /json    raw track data
└── _lib/
    ├── spotify.ts        token refresh, now-playing, recently-played
    ├── artwork.ts        album art → base64, host allow-list, bounded cache
    ├── options.ts        query-string parsing and validation
    ├── themes.ts         colour presets
    ├── svg.ts            text measurement, marquee, equalizer, icons
    ├── render.ts         card layouts
    └── handler.ts        shared request handling
scripts/
└── authorize.mjs         one-time OAuth helper
tests/
└── render.test.mjs       renderer, escaping and option tests
```

Files under `api/_lib/` begin with an underscore, so Vercel treats them as shared modules
instead of routes.

---

## Development

```bash
npm install
npm run dev          # vercel dev on http://localhost:3000
npm run typecheck    # tsc --noEmit
npm test             # compile, then run the renderer tests
npm run format       # prettier
```

### Continuous integration

| Workflow                                   | Trigger                       | Does                                          |
| ------------------------------------------ | ----------------------------- | --------------------------------------------- |
| [`ci.yml`](.github/workflows/ci.yml)       | every push and pull request   | Format check, typecheck, renderer tests       |
| [`smoke.yml`](.github/workflows/smoke.yml) | after a production deployment | Verifies the live endpoints return real cards |

Deployment itself is handled by Vercel's native Git integration: pushing to `main` builds
and promotes to production, and pull requests get their own preview URL.

---

## Troubleshooting

| Symptom                                  | Cause and fix                                                                                                         |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Card reads **Spotify unavailable**       | One of the three environment variables is missing or wrong on the deployment. Check the function logs in Vercel.      |
| Card reads **Nothing playing**           | No playback history on the account, or the token was issued without the required scopes. Re-run `npm run authorize`.  |
| `INVALID_CLIENT: Invalid redirect URI`   | The Spotify dashboard must contain exactly `http://127.0.0.1:5175/callback`. Spotify rejects `localhost`.             |
| Card never updates                       | GitHub's image proxy is caching it. Open the URL directly to confirm the service is live.                             |
| Card is blank in a Markdown preview      | Some editors block SVG animation. Test in a browser first.                                                            |
| Everything broke after a password change | Changing your Spotify password revokes refresh tokens. Re-run `npm run authorize` and update the deployment variable. |
| Artwork missing, everything else fine    | The album has no cover on Spotify's CDN. The card falls back to a placeholder by design.                              |

Still stuck? Open a [discussion](https://github.com/GautamVhavle/spotify-readme/discussions).

---

## Security

Every deployment is single-tenant and serves exactly one Spotify account. Credentials stay
server-side, colour parameters are validated against a strict hex pattern, all API text is
XML-escaped, artwork is only fetched from allow-listed Spotify CDN hosts, and errors never
leak upstream messages into the card.

Read the full threat model in [SECURITY.md](SECURITY.md). Report vulnerabilities privately
through [GitHub Security Advisories](https://github.com/GautamVhavle/spotify-readme/security/advisories/new)
— please do not open a public issue.

---

## Contributing

Pull requests are welcome, and new themes are the easiest place to start. See
[CONTRIBUTING.md](CONTRIBUTING.md) for setup, the theme checklist and code style, and
[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for how we treat each other.

```bash
npm run format && npm run typecheck && npm test
```

---

## License

[MIT](LICENSE) — do whatever you like, no attribution required.

<div align="center">
<br/>

<img src="https://gautamvhavle-spotify-readme.vercel.app/small?theme=transparent" alt="Now playing" width="340" />

<br/><br/>

<sub>Built by <a href="https://github.com/GautamVhavle">Gautam Vhavle</a> · <a href="https://gautamvhavle-spotify-readme.vercel.app/">Live demo</a> · <a href="https://github.com/GautamVhavle/spotify-readme/issues">Issues</a> · <a href="https://github.com/GautamVhavle/spotify-readme/discussions">Discussions</a></sub>

<br/>

<sub>If this made your profile a little cooler, a star goes a long way.</sub>

</div>
