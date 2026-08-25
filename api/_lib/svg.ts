export const FONT_STACK =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Ubuntu, 'Helvetica Neue', Arial, sans-serif";

const XML_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
};

export function escapeXml(value: string): string {
  // eslint-disable-next-line no-control-regex
  return value
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .replace(/[&<>"']/g, (char) => XML_ENTITIES[char]!);
}

const NARROW = new Set("iIl|!.,:;'`[](){}jtfr/\\");
const WIDE = new Set("MWmw@%");

/**
 * The renderer has no DOM, so text width is approximated from per-character
 * ratios. It only decides truncation and marquee, so a close guess is enough.
 */
export function measureText(text: string, fontSize: number, bold = false): number {
  let units = 0;

  for (const char of text) {
    if (char.codePointAt(0)! > 0x2e80) units += 1;
    else if (char === " ") units += 0.27;
    else if (NARROW.has(char)) units += 0.31;
    else if (WIDE.has(char)) units += 0.88;
    else if (char >= "A" && char <= "Z") units += 0.67;
    else if (char >= "0" && char <= "9") units += 0.56;
    else units += 0.53;
  }

  return units * fontSize * (bold ? 1.04 : 1);
}

export function truncate(
  text: string,
  maxWidth: number,
  fontSize: number,
  bold = false,
): string {
  if (measureText(text, fontSize, bold) <= maxWidth) return text;

  let result = text;
  while (result.length > 1 && measureText(`${result}…`, fontSize, bold) > maxWidth) {
    result = result.slice(0, -1);
  }
  return `${result.trimEnd()}…`;
}

export interface Fragment {
  markup: string;
  css: string;
}

interface TextLineInput {
  id: string;
  text: string;
  x: number;
  /** Baseline position. */
  y: number;
  maxWidth: number;
  fontSize: number;
  className: string;
  bold?: boolean;
}

const MARQUEE_GAP = 44;
const MARQUEE_SPEED = 36; // px per second

/** Renders a single line, scrolling it horizontally when it overflows. */
export function textLine(input: TextLineInput): Fragment {
  const { id, text, x, y, maxWidth, fontSize, className, bold = false } = input;
  const safe = escapeXml(text);
  const width = measureText(text, fontSize, bold);

  if (width <= maxWidth) {
    return { markup: `<text class="${className}" x="${x}" y="${y}">${safe}</text>`, css: "" };
  }

  const shift = round(width + MARQUEE_GAP);
  const duration = clamp(shift / MARQUEE_SPEED, 7, 26);

  const markup = `<clipPath id="clip-${id}"><rect x="${x}" y="${round(y - fontSize)}" width="${maxWidth}" height="${round(fontSize * 1.5)}"/></clipPath>
<g clip-path="url(#clip-${id})"><g class="mq-${id}"><text class="${className}" x="${x}" y="${y}">${safe}</text><text class="${className}" x="${round(x + shift)}" y="${y}">${safe}</text></g></g>`;

  const css = `.mq-${id}{animation:kf-${id} ${duration.toFixed(1)}s linear infinite}@keyframes kf-${id}{0%,9%{transform:translateX(0)}100%{transform:translateX(-${shift}px)}}`;

  return { markup, css };
}

interface EqualizerInput {
  id: string;
  x: number;
  /** Baseline the bars grow upward from. */
  y: number;
  height: number;
  color: string;
}

/** Four bars bouncing at unrelated speeds so the loop never looks synced. */
export function equalizer({ id, x, y, height, color }: EqualizerInput): Fragment {
  const barWidth = 3;
  const step = 6;
  const bars = [0, 1, 2, 3]
    .map(
      (index) =>
        `<rect x="${round(x + index * step)}" y="${round(y - height)}" width="${barWidth}" height="${height}" rx="${barWidth / 2}"/>`,
    )
    .join("");

  const timings = [
    { duration: 0.9, delay: 0 },
    { duration: 1.3, delay: -0.4 },
    { duration: 0.75, delay: -0.2 },
    { duration: 1.05, delay: -0.65 },
  ];

  const css = `.eq-${id} rect{fill:${color};transform-box:fill-box;transform-origin:center bottom;animation-name:kf-eq-${id};animation-timing-function:ease-in-out;animation-iteration-count:infinite}${timings
    .map(
      (timing, index) =>
        `.eq-${id} rect:nth-child(${index + 1}){animation-duration:${timing.duration}s;animation-delay:${timing.delay}s}`,
    )
    .join("")}@keyframes kf-eq-${id}{0%,100%{transform:scaleY(.2)}50%{transform:scaleY(1)}}`;

  return { markup: `<g class="eq-${id}">${bars}</g>`, css };
}

const LOGO_PATH =
  "M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z";

export function spotifyLogo(x: number, y: number, size: number, color: string): string {
  const scale = size / 24;
  return `<g transform="translate(${round(x)} ${round(y)}) scale(${scale.toFixed(4)})"><path d="${LOGO_PATH}" fill="${color}"/></g>`;
}

const NOTE_PATH =
  "M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z";

export function musicNote(x: number, y: number, size: number, color: string): string {
  const scale = size / 24;
  return `<g transform="translate(${round(x)} ${round(y)}) scale(${scale.toFixed(4)})"><path d="${NOTE_PATH}" fill="${color}"/></g>`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function round(value: number): number {
  return Math.round(value * 100) / 100;
}

export function relativeTime(iso: string | null): string | null {
  if (!iso) return null;

  const then = Date.parse(iso);
  if (!Number.isFinite(then)) return null;

  const minutes = Math.floor((Date.now() - then) / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return days < 30 ? `${days}d ago` : null;
}
