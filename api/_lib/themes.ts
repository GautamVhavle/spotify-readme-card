export interface Theme {
  /** Card background. `none` renders a transparent card. */
  bg: string;
  /** Secondary surface used for the depth veil and artwork placeholder. */
  surface: string;
  text: string;
  subtext: string;
  accent: string;
  border: string;
}

export const DEFAULT_THEME = "dark";

export const themes: Record<string, Theme> = {
  dark: {
    bg: "#0d1117",
    surface: "#161b22",
    text: "#e6edf3",
    subtext: "#9198a1",
    accent: "#1db954",
    border: "#30363d",
  },
  light: {
    bg: "#ffffff",
    surface: "#f6f8fa",
    text: "#1f2328",
    subtext: "#59636e",
    accent: "#1db954",
    border: "#d1d9e0",
  },
  spotify: {
    bg: "#121212",
    surface: "#1f1f1f",
    text: "#ffffff",
    subtext: "#b3b3b3",
    accent: "#1db954",
    border: "#2a2a2a",
  },
  dracula: {
    bg: "#282a36",
    surface: "#343746",
    text: "#f8f8f2",
    subtext: "#bd93f9",
    accent: "#50fa7b",
    border: "#44475a",
  },
  nord: {
    bg: "#2e3440",
    surface: "#3b4252",
    text: "#eceff4",
    subtext: "#81a1c1",
    accent: "#88c0d0",
    border: "#434c5e",
  },
  catppuccin: {
    bg: "#1e1e2e",
    surface: "#302d41",
    text: "#cdd6f4",
    subtext: "#a6adc8",
    accent: "#a6e3a1",
    border: "#45475a",
  },
  tokyonight: {
    bg: "#1a1b26",
    surface: "#24283b",
    text: "#c0caf5",
    subtext: "#9aa5ce",
    accent: "#7aa2f7",
    border: "#2f3549",
  },
  gruvbox: {
    bg: "#282828",
    surface: "#32302f",
    text: "#ebdbb2",
    subtext: "#a89984",
    accent: "#b8bb26",
    border: "#3c3836",
  },
  rosepine: {
    bg: "#191724",
    surface: "#1f1d2e",
    text: "#e0def4",
    subtext: "#908caa",
    accent: "#ebbcba",
    border: "#26233a",
  },
  synthwave: {
    bg: "#241b2f",
    surface: "#2b213a",
    text: "#f8f8f2",
    subtext: "#b6a2d3",
    accent: "#f92aad",
    border: "#463465",
  },
  transparent: {
    bg: "none",
    surface: "#161b22",
    text: "#e6edf3",
    subtext: "#9198a1",
    accent: "#1db954",
    border: "none",
  },
};

export function resolveTheme(name: string | undefined): Theme {
  const key = (name ?? "").trim().toLowerCase();
  return { ...(themes[key] ?? themes[DEFAULT_THEME]!) };
}
