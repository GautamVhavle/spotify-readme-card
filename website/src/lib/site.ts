export const REPO_URL = "https://github.com/GautamVhavle/spotify-readme-card";
export const LIVE_URL = "https://live-spotify-readme-card.vercel.app";
export const AUTHOR_URL = "https://gautamvhavle.xyz/";
export const SITE_URL = "https://gautamvhavle.github.io/spotify-readme-card/";
export const GUIDE_PATH = "add-spotify-to-github-readme/";
export const GUIDE_URL = `${SITE_URL}${GUIDE_PATH}`;

/** First paragraph answer engines and snippets can quote whole. */
export const ANSWER =
  "A Spotify README card is an SVG image that shows the song you are playing on your GitHub profile. You deploy it once, then paste the image URL into your README.";

export const FAQS: { question: string; answer: string }[] = [
  {
    question: "What is a Spotify README card?",
    answer: ANSWER,
  },
  {
    question: "How do I add a Spotify now playing card to my GitHub README?",
    answer:
      "Create a Spotify app, authorise it once to get a refresh token, deploy the project to Vercel with your client ID, client secret and refresh token as environment variables, then paste the returned image URL into your README as a Markdown image.",
  },
  {
    question: "Is Spotify Readme Card free?",
    answer:
      "Yes. It is MIT licensed, self-hosted on a free Vercel account, and has zero runtime dependencies.",
  },
  {
    question: "Which layouts and themes are available?",
    answer:
      "Three layouts: detailed, compact, and portrait. Eleven built-in themes, plus hex colour overrides for background, text, accent, and border. The portrait card takes its colour from the album art.",
  },
];
export const DEPLOY_URL =
  "https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FGautamVhavle%2Fspotify-readme-card&env=SPOTIFY_CLIENT_ID,SPOTIFY_CLIENT_SECRET,SPOTIFY_REFRESH_TOKEN&envDescription=Spotify%20app%20credentials%20and%20a%20refresh%20token&envLink=https%3A%2F%2Fgithub.com%2FGautamVhavle%2Fspotify-readme-card%23step-3--generate-a-refresh-token&project-name=spotify-readme-card&repository-name=spotify-readme-card";

export type Variant = "main" | "small" | "portrait";

export const VARIANTS: {
  id: Variant;
  label: string;
  path: string;
  width: { min: number; max: number; def: number };
  height: number;
  radius: number;
  tagline: string;
  points: string[];
}[] = [
  {
    id: "main",
    label: "Detailed",
    path: "/",
    width: { min: 320, max: 760, def: 420 },
    height: 142,
    radius: 16,
    tagline: "The full record. Backdrop, artwork, and every line of metadata.",
    points: [
      "Blurred album backdrop with a tuned veil",
      "Artwork, status, title, artist and album",
      "Scrolling marquee for long titles",
      "Pulsing equalizer while a track is playing",
    ],
  },
  {
    id: "small",
    label: "Compact",
    path: "/small",
    width: { min: 260, max: 560, def: 340 },
    height: 76,
    radius: 14,
    tagline: "A single strip that slots into tables, sidebars and badge rows.",
    points: [
      "Artwork, status, title and artist on one line",
      "No backdrop, pure widget",
      "Reads cleanly next to shields.io badges",
      "Smallest payload of the three",
    ],
  },
  {
    id: "portrait",
    label: "Portrait",
    path: "/portrait",
    width: { min: 240, max: 420, def: 300 },
    height: 420,
    radius: 22,
    tagline: "Poster proportions with frosted glass coloured by the record itself.",
    points: [
      "Frosted glass tinted from the album art",
      "Tint 0 to 100 controls how far the colour bleeds",
      "Light and dark shell modes",
      "Reads like a mini album sleeve",
    ],
  },
];

export const VARIANT_BY_ID = Object.fromEntries(
  VARIANTS.map((v) => [v.id, v]),
) as Record<Variant, (typeof VARIANTS)[number]>;

export type ThemeName =
  | "dark"
  | "light"
  | "spotify"
  | "dracula"
  | "nord"
  | "catppuccin"
  | "tokyonight"
  | "gruvbox"
  | "rosepine"
  | "synthwave"
  | "transparent";

export const THEMES: { value: ThemeName; label: string; dot: string }[] = [
  { value: "dark", label: "Dark", dot: "#0d1117" },
  { value: "light", label: "Light", dot: "#ffffff" },
  { value: "spotify", label: "Spotify", dot: "#1db954" },
  { value: "dracula", label: "Dracula", dot: "#bd93f9" },
  { value: "nord", label: "Nord", dot: "#88c0d0" },
  { value: "catppuccin", label: "Catppuccin", dot: "#cba6f7" },
  { value: "tokyonight", label: "Tokyo Night", dot: "#7aa2f7" },
  { value: "gruvbox", label: "Gruvbox", dot: "#fabd2f" },
  { value: "rosepine", label: "Rosé Pine", dot: "#ebbcba" },
  { value: "synthwave", label: "Synthwave", dot: "#ff7edb" },
  { value: "transparent", label: "Transparent", dot: "transparent" },
];

export const NAV_SECTIONS = [
  { id: "about", label: "About" },
  { id: "layouts", label: "Layouts" },
  { id: "playground", label: "Playground" },
  { id: "setup", label: "Setup" },
  { id: "faq", label: "FAQ" },
];
