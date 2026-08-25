# Contributing

Thanks for considering a contribution. This is a small, deliberately dependency-free
project, so the bar is mostly about keeping it small and readable.

## Ways to help

- **Add a theme.** The most common and most welcome contribution.
- **Improve rendering.** Better text measurement, nicer layouts, cleaner animation.
- **Fix a bug.** See the [open issues](https://github.com/GautamVhavle/spotify-readme-card/issues).
- **Improve the docs.** If a setup step confused you, it will confuse someone else.

## Getting set up

```bash
git clone https://github.com/YOUR-USERNAME/spotify-readme.git
cd spotify-readme
npm install
cp .env.example .env      # fill in your Spotify app credentials
npm run authorize         # writes SPOTIFY_REFRESH_TOKEN into .env
npm run dev               # http://localhost:3000
```

You need your own Spotify app to run the service locally. The
[Setup section of the README](README.md#setup) walks through it.

## Before you open a pull request

```bash
npm run format      # Prettier
npm run typecheck   # tsc --noEmit
npm test            # renderer tests
```

CI runs all three on every push and pull request.

## Project layout

| Path                                         | Responsibility                                 |
| -------------------------------------------- | ---------------------------------------------- |
| `api/card.ts`, `api/small.ts`, `api/json.ts` | Route entry points                             |
| `api/_lib/spotify.ts`                        | Token refresh, now-playing and recently-played |
| `api/_lib/artwork.ts`                        | Album art to base64, with host allow-list      |
| `api/_lib/options.ts`                        | Query-string parsing and validation            |
| `api/_lib/themes.ts`                         | Colour presets                                 |
| `api/_lib/svg.ts`                            | Text measurement, marquee, equalizer, icons    |
| `api/_lib/render.ts`                         | Card layouts                                   |
| `api/_lib/handler.ts`                        | Shared request handling                        |
| `scripts/authorize.mjs`                      | One-time OAuth helper                          |

Files under `api/_lib/` start with an underscore so Vercel treats them as shared modules
rather than routes. Keep new shared code there.

## Adding a theme

1. Add an entry to `themes` in [`api/_lib/themes.ts`](api/_lib/themes.ts). All six tokens
   are required — no partial themes:

   ```ts
   yourtheme: {
     bg: "#101014",       // card background
     surface: "#1b1b22",  // veil and artwork placeholder
     text: "#f5f5f7",     // track title
     subtext: "#9a9aa5",  // artist and album
     accent: "#1db954",   // logo, status line, equalizer
     border: "#2a2a33",   // outer border and artwork ring
   },
   ```

2. Check it on both layouts, playing and not playing:

   ```text
   http://localhost:3000/?theme=yourtheme
   http://localhost:3000/small?theme=yourtheme
   ```

3. Make sure `subtext` stays legible against `bg`, and that `accent` has enough contrast
   for the 10px uppercase status line.
4. Add the theme to the gallery table in the README.
5. Attach screenshots of both layouts to your pull request.

## Code style

- TypeScript in strict mode. No `any`, no non-null assertions on untrusted input.
- No runtime dependencies. If something needs a package, open an issue first.
- Validate everything that comes from the query string before it reaches the SVG.
- Escape all text that comes from the Spotify API.
- Comments explain _why_, not _what_. Most code should not need one.
- Prettier decides formatting; do not hand-align things.

## Commit messages

[Conventional Commits](https://www.conventionalcommits.org), lowercase:

```text
feat: add rosepine dawn theme
fix: keep long artist names inside the compact card
docs: clarify the redirect URI requirement
chore(deps): bump typescript to 5.8
```

## Reporting security issues

Do not open a public issue. Follow [SECURITY.md](SECURITY.md).

## Code of conduct

By participating you agree to the [Code of Conduct](CODE_OF_CONDUCT.md).
