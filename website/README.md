<div align="center">

<img src="https://live-spotify-readme-card.vercel.app/" alt="Spotify now playing" width="440" />

# Spotify README Card | Website

**The marketing site & live playground for the Spotify README Card.**

_Dark, cinematic, and fully interactive. Tweak every parameter and copy a ready-to-paste URL._

<p>
  <a href="https://gautamvhavle.github.io/spotify-readme-card/"><b>Live Site</b></a>
  ·
  <a href="#-playground-the-card-builder">Playground</a>
  ·
  <a href="#-tech-stack">Tech Stack</a>
  ·
  <a href="#-project-structure">Structure</a>
  ·
  <a href="#-deployment-github-pages">Deployment</a>
</p>

</div>

---

## ✨ What is this?

This `website/` folder is a **standalone React + Vite marketing site** for the [Spotify README Card](https://github.com/GautamVhavle/spotify-readme-card), the serverless SVG service that shows what you're listening to on Spotify inside any GitHub README.

The site does three jobs:

1. **Explains** the product, what it is, how it works, and why it exists.
2. **Shows** it, a live layout explorer that renders real cards straight from the production API.
3. **Lets you build** your own card, an interactive playground where every query parameter is a knob, and every knob instantly updates a live preview + copy-ready snippets.

> **Design language:** The site is a direct adaptation of the _Prisma_ creative-studio template, dark, moody, cinematic, warm cream (`#DEDBC8` / `#E1E0CC`) on pure black, with noise textures, pill navbars, giant display type, and Framer Motion throughout.

---

## 🎨 Sections

| Section        | What it does                                                                     | Key detail                                                                   |
| -------------- | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| **Nav**        | Centered notch navbar with scroll-spy                                            | `IntersectionObserver` active section, `layoutId` sliding pill, mobile sheet |
| **Hero**       | Full viewport inset video with noise and gradient, product name and feature tags | `WordsPullUp` per word stagger, inline stat row                              |
| **Marquee**    | Two counter-scrolling strips of themes and capabilities                          | CSS keyframe marquee with edge mask                                          |
| **About**      | Scroll-linked word fade plus the three-step request pipeline                     | `useScroll` with per word `opacity: 0.15 to 1`                               |
| **Layouts**    | Interactive layout explorer, one live card at a time                             | Tabs drive an `AnimatePresence` swap of a live API preview                   |
| **Playground** | **Interactive card builder**, the core tool                                      | Live SVG preview, tabbed URL / Markdown / HTML snippets, one click copy      |
| **Setup**      | 5 step deploy guide plus full API reference tables                               | Copyable code blocks                                                         |
| **Footer**     | Link columns, credits and back to top                                            | Built with ❤️ by Gautam Vhavle                                               |

---

## 🧪 Playground, The Card Builder

The playground at `#playground` is the most important part of the site. It lets anyone, even without cloning the repo, generate a perfect card URL.

### Controls

| Control            | Param                                         | Notes                                                                                                                          |
| ------------------ | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **Deployment URL** | base                                          | Defaults to `live-spotify-readme-card.vercel.app`, replace with your own Vercel URL                                            |
| **Layout**         | `variant`                                     | `Detailed` (`/`) · `Compact` (`/small`) · `Portrait` (`/portrait`)                                                             |
| **Theme**          | `theme`                                       | 11 presets: `dark` `light` `spotify` `dracula` `nord` `catppuccin` `tokyonight` `gruvbox` `rosepine` `synthwave` `transparent` |
| **Portrait shell** | `mode`                                        | `dark` / `light`, only for portrait                                                                                            |
| **Width**          | `width`                                       | Slider, clamped per variant (320–760 / 260–560 / 240–420)                                                                      |
| **Radius**         | `radius`                                      | `0–40`                                                                                                                         |
| **Tint**           | `tint`                                        | `0–100`, portrait only, album colour bleed                                                                                     |
| **Toggles**        | `bars` `blur` `glass` `show_border`           | Animated equalizer, blurred backdrop, frosted glass, outer border                                                              |
| **Custom palette** | `bg` `surface` `text` `sub` `accent` `border` | Hex without `#` (3/4/6/8 digits) or `transparent`, live colour dot preview                                                     |

### Output

Every change recomputes a single `URLSearchParams` string and derives four snippets:

```
Image URL  → https://your-app.vercel.app/small?theme=dracula&width=460
Markdown   → ![Spotify](https://...)
Markdown+  → [![Spotify](https://...)](https://open.spotify.com)
HTML       → <img src="https://..." alt="Spotify now playing" width="460" />
```

Each has a **Copy** button (with `Copied!` feedback) and the preview itself is a real `<img>` hitting the live API, _what you see is what your README gets_.

> **Camo tip** shown below the snippets: GitHub caches README images via its `camo` proxy. After pushing, run `node scripts/purge-camo.mjs https://github.com/you/you` to bust it.

---

## 🛠 Tech Stack

| Layer         | Choice                                                 | Why                                                                                          |
| ------------- | ------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| **Build**     | [Vite 5](https://vitejs.dev) + React 18 + TypeScript 5 | Instant HMR, strict types, zero-config                                                       |
| **Styling**   | [Tailwind CSS 3](https://tailwindcss.com)              | Utility-first, tokenised `primary` / `cream` / `ink` scale, `font-serif: Instrument Serif`   |
| **Animation** | [Framer Motion 11](https://www.framer.com/motion/)     | `WordsPullUp`, `WordsPullUpMultiStyle`, scroll-linked opacity, `useReducedMotion` throughout |
| **Icons**     | [lucide-react](https://lucide.dev)                     | `ArrowRight`, `Check`, `Copy`, `ExternalLink`, `Sparkles`, `Github`                          |
| **Fonts**     | Google Fonts                                           | `Almarai` (300/400/700/800) global · `Instrument Serif` italic for accents                   |
| **Deploy**    | GitHub Pages (static)                                  | `vite build` → `dist/` → `build/` → `gh-pages` branch                                        |

No backend. No API keys. The playground just constructs URLs, the actual SVG rendering still happens on Vercel.

---

## 📁 Project Structure

```
website/
├── index.html              # Fonts, meta, root div
├── vite.config.ts          # base: "./" for Pages, React plugin
├── tailwind.config.js      # primary #DEDBC8, serif Instrument
├── postcss.config.js
├── tsconfig.json
├── package.json
├── scripts/
│   └── copy-build.mjs      # dist → ../build + .nojekyll
├── public/                 # copied verbatim into the build
│   ├── icon.svg            # favicon + manifest icon
│   ├── robots.txt
│   ├── sitemap.xml
│   └── site.webmanifest
├── src/
│   ├── main.tsx
│   ├── index.css           # Tailwind base, noise, checkerboard, range sliders
│   ├── App.tsx             # Nav + Hero + Marquee + About + Layouts + Playground + Setup + Footer
│   ├── lib/
│   │   └── site.ts         # Shared URLs, variants, themes, nav sections
│   └── components/
│       ├── Nav.tsx
│       ├── Hero.tsx
│       ├── Marquee.tsx
│       ├── About.tsx
│       ├── Layouts.tsx
│       ├── Playground.tsx  # ← the interactive builder
│       ├── Setup.tsx
│       ├── Footer.tsx
│       ├── CardImage.tsx   # Live SVG with skeleton + error fallback
│       ├── SpotifyMark.tsx # Spotify glyph used in the nav notch
│       ├── WordsPullUp.tsx
│       └── WordsPullUpMultiStyle.tsx
└── dist/                   # vite build output (gitignored, copied to ../build)
```

`../build/` at the repo root is the **GitHub Pages publish directory**, it is committed and pushed to the `gh-pages` branch.

---

## 🚀 Local Development

```bash
cd website
npm install
npm run dev        # http://localhost:5173
npm run build      # tsc + vite build → dist/ → ../build/
npm run preview    # preview the production build
```

---

## 📦 Deployment, GitHub Pages

The site is a fully static SPA. Any static host works, but the repo is configured for **GitHub Pages** via the `gh-pages` branch.

### One-time setup

```bash
# 1. Build
cd website
npm run build          # writes to ../build/ and creates .nojekyll

# 2. Commit the build output
cd ..
git add website/ build/
git commit -m "feat: Prisma-styled website + playground"
git push origin main

# 3. Publish build/ to gh-pages branch
git subtree push --prefix build origin gh-pages
#, or, if gh-pages doesn't exist yet:
# git push origin `git subtree split --prefix build main`:gh-pages --force
```

### Enable Pages

1. Go to **Settings → Pages** in the GitHub repo.
2. Source: **Deploy from a branch** → Branch: `gh-pages` → Folder: `/ (root)` → Save.
3. Your site appears at `https://<user>.github.io/spotify-readme-card/`.

### Subsequent deploys

```bash
cd website && npm run build && cd ..
git add build/
git commit -m "chore: rebuild site"
git subtree push --prefix build origin gh-pages
```

> The `postbuild` script (`scripts/copy-build.mjs`) automatically copies `website/dist/` → `build/` and creates `build/.nojekyll` so GitHub Pages doesn't run Jekyll.

---

## 🎨 Design Tokens

```js
// tailwind.config.js
colors: { primary: "#DEDBC8" }          // warm cream, text, accents, buttons
fontFamily: { serif: ['"Instrument Serif"', 'serif'] }

// index.css
* { font-family: 'Almarai', ... }       // global default
body { background: #000; color: #E1E0CC }
.noise-overlay { baseFrequency: 0.85, numOctaves: 3 }  // hero video
.bg-noise      { baseFrequency: 0.9,  numOctaves: 4 }  // features bg
```

| Token     | Value                   | Usage                            |
| --------- | ----------------------- | -------------------------------- |
| `bg`      | `#000000`               | Page background                  |
| `card`    | `#101010`               | About card                       |
| `feature` | `#212121`               | Feature cards                    |
| `primary` | `#DEDBC8`               | Tailwind `text-primary`, buttons |
| `text`    | `#E1E0CC`               | Inline primary text              |
| `muted`   | `text-gray-400/500`     | Secondary text                   |
| `nav`     | `rgba(225,224,204,0.8)` | Navbar links                     |

---

## 🔗 Links

- **Main README**, [`../README.md`](../README.md), full API, setup, and architecture docs
- **Live API**, [live-spotify-readme-card.vercel.app](https://live-spotify-readme-card.vercel.app/)
- **Live Site**, [gautamvhavle.github.io/spotify-readme-card](https://gautamvhavle.github.io/spotify-readme-card/)
- **Deploy your own**, [Vercel Deploy Button](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FGautamVhavle%2Fspotify-readme-card)

---

<div align="center">

_Built with Vite + React + Tailwind + Framer Motion. Dark, moody, and a little noisy, just like a good record._

</div>
