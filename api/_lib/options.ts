import { resolveTheme, type Theme } from "./themes.js";

export type Variant = "main" | "small";

export interface CardOptions {
  variant: Variant;
  theme: Theme;
  width: number;
  height: number;
  radius: number;
  showBorder: boolean;
  showBars: boolean;
  showArtBackdrop: boolean;
}

export type Query = Partial<Record<string, string | string[]>>;

const HEX = /^([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

const SIZE: Record<Variant, { width: number; min: number; max: number; height: number }> = {
  main: { width: 420, min: 320, max: 760, height: 142 },
  small: { width: 340, min: 260, max: 560, height: 76 },
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

export function parseOptions(query: Query, variant: Variant): CardOptions {
  const base = resolveTheme(first(query.theme));
  const size = SIZE[variant];

  const theme: Theme = {
    bg: color(query.bg, base.bg),
    surface: color(query.surface, base.surface),
    text: color(query.text, base.text),
    subtext: color(query.sub, base.subtext),
    accent: color(query.accent, base.accent),
    border: color(query.border, base.border),
  };

  return {
    variant,
    theme,
    width: number(query.width, size.width, size.min, size.max),
    height: size.height,
    radius: number(query.radius, variant === "main" ? 16 : 14, 0, 40),
    showBorder: bool(query.show_border, theme.border !== "none"),
    showBars: bool(query.bars, true),
    showArtBackdrop: bool(query.blur, variant === "main") && theme.bg !== "none",
  };
}
