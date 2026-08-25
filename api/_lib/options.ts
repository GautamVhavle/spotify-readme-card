import { type Mode, portraitThemes, resolveTheme, type Theme } from "./themes.js";

export type Variant = "main" | "small" | "portrait";

export interface CardOptions {
  variant: Variant;
  mode: Mode;
  theme: Theme;
  /** Coordinate space the card is drawn in. */
  width: number;
  height: number;
  /** Size the SVG is presented at; the viewBox scales the drawing to fit. */
  displayWidth: number;
  displayHeight: number;
  radius: number;
  showBorder: boolean;
  showBars: boolean;
  showArtBackdrop: boolean;
  /** Frosted panels on the portrait card. */
  glass: boolean;
  /** How strongly the album colour shows through, 0 to 100. */
  tint: number;
}

export type Query = Partial<Record<string, string | string[]>>;

const HEX = /^([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

/** The portrait card is a fixed 300 x 420 design scaled to the requested width. */
const PORTRAIT_RATIO = 420 / 300;

const SIZE: Record<
  Variant,
  { width: number; min: number; max: number; height: number }
> = {
  main: { width: 420, min: 320, max: 760, height: 142 },
  small: { width: 340, min: 260, max: 560, height: 76 },
  portrait: { width: 300, min: 240, max: 420, height: 420 },
};

function first(value: string | string[] | undefined): string | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  const trimmed = raw?.trim();
  return trimmed ? trimmed : undefined;
}

/** Colours are injected straight into the SVG, so only literal hex is accepted. */
function color(value: string | string[] | undefined, fallback: string): string {
  const raw = first(value)?.toLowerCase();
  if (!raw) return fallback;
  if (raw === "none" || raw === "transparent") return "none";

  const hex = raw.startsWith("#") ? raw.slice(1) : raw;
  return HEX.test(hex) ? `#${hex}` : fallback;
}

function bool(value: string | string[] | undefined, fallback: boolean): boolean {
  const raw = first(value)?.toLowerCase();
  if (raw === undefined) return fallback;
  if (["1", "true", "yes", "on"].includes(raw)) return true;
  if (["0", "false", "no", "off"].includes(raw)) return false;
  return fallback;
}

function number(
  value: string | string[] | undefined,
  fallback: number,
  min: number,
  max: number,
): number {
  const parsed = Number.parseInt(first(value) ?? "", 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

/** `mode` wins, otherwise the only light preset implies a light shell. */
function resolveMode(query: Query): Mode {
  const raw = first(query.mode)?.toLowerCase();
  if (raw === "light" || raw === "dark") return raw;
  return first(query.theme)?.toLowerCase() === "light" ? "light" : "dark";
}

export function parseOptions(query: Query, variant: Variant): CardOptions {
  const portrait = variant === "portrait";
  const mode = resolveMode(query);
  const named = first(query.theme);

  // A portrait card with no theme asked for takes its colour from the artwork.
  const base = portrait && !named ? { ...portraitThemes[mode] } : resolveTheme(named);
  const size = SIZE[variant];

  const theme: Theme = {
    bg: color(query.bg, base.bg),
    surface: color(query.surface, base.surface),
    text: color(query.text, base.text),
    subtext: color(query.sub, base.subtext),
    accent: color(query.accent, base.accent),
    border: color(query.border, base.border),
  };

  const requested = number(query.width, size.width, size.min, size.max);

  return {
    variant,
    mode,
    theme,
    width: portrait ? size.width : requested,
    height: size.height,
    displayWidth: requested,
    displayHeight: portrait ? Math.round(requested * PORTRAIT_RATIO) : size.height,
    radius: number(query.radius, portrait ? 22 : variant === "main" ? 16 : 14, 0, 40),
    showBorder: bool(query.show_border, theme.border !== "none" && !portrait),
    showBars: bool(query.bars, true),
    showArtBackdrop: bool(query.blur, variant !== "small") && theme.bg !== "none",
    glass: bool(query.glass, true),
    tint: number(query.tint, 55, 0, 100),
  };
}
