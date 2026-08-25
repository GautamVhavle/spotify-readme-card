import type { CardOptions } from "./options.js";
import type { Track } from "./spotify.js";
import type { Mode } from "./themes.js";
import {
  clamp,
  equalizer,
  escapeXml,
  FONT_STACK,
  type Fragment,
  musicNote,
  relativeTime,
  round,
  spotifyLogo,
  textLine,
  truncate,
} from "./svg.js";

/** Extra width the uppercase status line gains from its 0.1em letter-spacing. */
const TRACKING = 1.12;

interface Layer {
  defs: string[];
  css: string[];
  body: string[];
}

function createLayer(): Layer {
  return { defs: [], css: [], body: [] };
}

function push(layer: Layer, fragment: Fragment): void {
  layer.body.push(fragment.markup);
  if (fragment.css) layer.css.push(fragment.css);
}

function statusLabel(track: Track): string {
  if (track.isPlaying) return "Now playing";
  const ago = relativeTime(track.playedAt);
  return ago ? `Last played · ${ago}` : "Last played";
}

/** Rounded background, optional blurred artwork backdrop, and border. */
function backdrop(options: CardOptions, artwork: string | null, layer: Layer): void {
  const { width, height, radius, theme } = options;
  const transparent = theme.bg === "none";

  layer.defs.push(
    `<clipPath id="card"><rect width="${width}" height="${height}" rx="${radius}"/></clipPath>`,
  );

  const inner: string[] = [];

  if (!transparent) {
    inner.push(`<rect width="${width}" height="${height}" fill="${theme.bg}"/>`);
  }

  if (artwork && options.showArtBackdrop) {
    layer.defs.push(
      `<filter id="soften" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="26"/></filter>`,
      `<linearGradient id="veil" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${theme.surface}" stop-opacity="0"/><stop offset="1" stop-color="${theme.surface}" stop-opacity="0.55"/></linearGradient>`,
    );
    inner.push(
      `<image href="${artwork}" x="-40" y="-40" width="${width + 80}" height="${height + 80}" preserveAspectRatio="xMidYMid slice" filter="url(#soften)"/>`,
      `<rect width="${width}" height="${height}" fill="${theme.bg}" opacity="0.82"/>`,
      `<rect width="${width}" height="${height}" fill="url(#veil)"/>`,
    );
  }

  if (inner.length) {
    layer.body.push(`<g clip-path="url(#card)">${inner.join("")}</g>`);
  }

  if (options.showBorder && theme.border !== "none") {
    layer.body.push(
      `<rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="${radius}" fill="none" stroke="${theme.border}"/>`,
    );
  }
}

function albumArt(
  artwork: string | null,
  x: number,
  y: number,
  size: number,
  options: CardOptions,
  layer: Layer,
): void {
  const radius = Math.round(size * 0.12);
  layer.defs.push(
    `<clipPath id="art"><rect x="${x}" y="${y}" width="${size}" height="${size}" rx="${radius}"/></clipPath>`,
  );

  const contents = artwork
    ? `<image href="${artwork}" x="${x}" y="${y}" width="${size}" height="${size}" preserveAspectRatio="xMidYMid slice"/>`
    : `<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="${options.theme.surface}"/>${musicNote(
        round(x + size / 2 - size * 0.2),
        round(y + size / 2 - size * 0.2),
        round(size * 0.4),
        options.theme.subtext,
      )}`;

  layer.body.push(`<g clip-path="url(#art)">${contents}</g>`);

  if (options.theme.border !== "none") {
    layer.body.push(
      `<rect x="${x + 0.5}" y="${y + 0.5}" width="${size - 1}" height="${size - 1}" rx="${radius}" fill="none" stroke="${options.theme.border}" opacity="0.7"/>`,
    );
  }
}

function document(options: CardOptions, label: string, layer: Layer): string {
  const { width, height, displayWidth, displayHeight, theme } = options;
  const baseCss = `text{font-family:${FONT_STACK};white-space:pre}.title{fill:${theme.text}}.artist,.album{fill:${theme.subtext}}.status{fill:${theme.accent};font-weight:700;letter-spacing:0.1em}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${displayWidth}" height="${displayHeight}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeXml(label)}"><title>${escapeXml(label)}</title><defs>${layer.defs.join("")}</defs><style>${baseCss}${layer.css.join("")}</style>${layer.body.join("")}</svg>`;
}

export function renderMainCard(
  track: Track,
  artwork: string | null,
  options: CardOptions,
): string {
  const layer = createLayer();
  const { width, theme } = options;

  const pad = 20;
  const artSize = 102;
  const textX = pad + artSize + 18;
  const textWidth = Math.max(60, width - textX - pad);

  layer.css.push(
    `.title{font-size:17px;font-weight:700}.artist{font-size:13px;font-weight:500}.album{font-size:11.5px;opacity:0.72}.status{font-size:10px}`,
  );

  backdrop(options, artwork, layer);
  albumArt(artwork, pad, pad, artSize, options, layer);

  const showBars = options.showBars && track.isPlaying;
  const barsX = width - pad - 21;
  layer.body.push(spotifyLogo(textX, 33, 15, theme.accent));

  if (showBars) {
    push(
      layer,
      equalizer({ id: "m", x: barsX, y: 46, height: 13, color: theme.accent }),
    );
  }

  const statusX = textX + 23;
  const statusLimit = (showBars ? barsX - 12 : width - pad) - statusX;
  layer.body.push(
    `<text class="status" x="${statusX}" y="45">${escapeXml(
      truncate(statusLabel(track).toUpperCase(), statusLimit / TRACKING, 10, true),
    )}</text>`,
  );

  const hasAlbum = Boolean(track.album) && track.album !== track.title;

  push(
    layer,
    textLine({
      id: "t",
      text: track.title,
      x: textX,
      y: hasAlbum ? 75 : 79,
      maxWidth: textWidth,
      fontSize: 17,
      className: "title",
      bold: true,
    }),
  );

  push(
    layer,
    textLine({
      id: "a",
      text: track.artist,
      x: textX,
      y: hasAlbum ? 97 : 101,
      maxWidth: textWidth,
      fontSize: 13,
      className: "artist",
    }),
  );

  if (hasAlbum) {
    push(
      layer,
      textLine({
        id: "b",
        text: track.album,
        x: textX,
        y: 117,
        maxWidth: textWidth,
        fontSize: 11.5,
        className: "album",
      }),
    );
  }

  return document(
    options,
    `${statusLabel(track)}: ${track.title} by ${track.artist}`,
    layer,
  );
}

export function renderSmallCard(
  track: Track,
  artwork: string | null,
  options: CardOptions,
): string {
  const layer = createLayer();
  const { width, theme } = options;

  const pad = 12;
  const artSize = 52;
  const textX = pad + artSize + 14;
  const railX = width - pad - 21;
  const textWidth = Math.max(50, railX - 12 - textX);

  layer.css.push(
    `.title{font-size:14px;font-weight:600}.artist{font-size:11px}.status{font-size:8.5px}`,
  );

  backdrop(options, artwork, layer);
  albumArt(artwork, pad, pad, artSize, options, layer);

  const showBars = options.showBars && track.isPlaying;
  layer.body.push(spotifyLogo(railX + 2.5, showBars ? 16 : 30, 16, theme.accent));

  if (showBars) {
    push(
      layer,
      equalizer({ id: "s", x: railX, y: 60, height: 12, color: theme.accent }),
    );
  }

  layer.body.push(
    `<text class="status" x="${textX}" y="25">${escapeXml(
      truncate(statusLabel(track).toUpperCase(), textWidth / TRACKING, 8.5, true),
    )}</text>`,
  );

  push(
    layer,
    textLine({
      id: "t",
      text: track.title,
      x: textX,
      y: 43,
      maxWidth: textWidth,
      fontSize: 14,
      className: "title",
      bold: true,
    }),
  );

  push(
    layer,
    textLine({
      id: "a",
      text: track.artist,
      x: textX,
      y: 58,
      maxWidth: textWidth,
      fontSize: 11,
      className: "artist",
    }),
  );

  return document(
    options,
    `${statusLabel(track)}: ${track.title} by ${track.artist}`,
    layer,
  );
}

/** How far the backdrop image is oversized so the blur never shows an edge. */
const BLEED = 40;

/** Frosted-panel opacities. A dark shell needs a far lighter touch than a light one. */
const GLASS: Record<
  Mode,
  {
    tint: number;
    stroke: number;
    sheenTop: number;
    sheenMid: number;
    sheenEnd: number;
    fade: number;
  }
> = {
  dark: {
    tint: 0.14,
    stroke: 0.26,
    sheenTop: 0.18,
    sheenMid: 0.03,
    sheenEnd: 0.09,
    fade: 0.62,
  },
  light: {
    tint: 0.58,
    stroke: 0.85,
    sheenTop: 0.5,
    sheenMid: 0.14,
    sheenEnd: 0.28,
    fade: 0.72,
  },
};

export function renderPortraitCard(
  track: Track,
  artwork: string | null,
  options: CardOptions,
): string {
  const layer = createLayer();
  const { width, height, radius, theme, mode } = options;
  const glass = GLASS[mode];

  const pad = 14;
  const artSize = width - pad * 2;
  const artRight = pad + artSize;
  const washH = height - artRight;
  const textTop = pad + artSize + 20;
  const innerX = pad;
  const innerW = artSize;

  layer.css.push(
    `.title{font-size:16px;font-weight:700}.artist{font-size:12px;font-weight:500}.album{font-size:10.5px;opacity:0.75}.status{font-size:9px}`,
  );

  const showArt = Boolean(artwork) && options.showArtBackdrop;

  layer.defs.push(
    `<clipPath id="card"><rect width="${width}" height="${height}" rx="${radius}"/></clipPath>`,
  );

  const back: string[] = [];
  if (theme.bg !== "none") {
    back.push(`<rect width="${width}" height="${height}" fill="${theme.bg}"/>`);
  }

  if (showArt) {
    // The whole card is the album art, bloomed out, so it adopts its palette.
    const strength = clamp(1 - options.tint / 100, 0, 1);
    const top = round(clamp(strength * 0.72, 0, 0.96));
    const middle = round(clamp(strength * 0.95, 0, 0.96));
    const bottom = round(clamp(strength * 1.25, 0, 0.96));

    layer.defs.push(
      `<filter id="bloom" x="-25%" y="-25%" width="150%" height="150%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="34"/><feColorMatrix type="saturate" values="1.75"/></filter>`,
      `<filter id="frost" x="-25%" y="-25%" width="150%" height="150%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="16"/><feColorMatrix type="saturate" values="1.9"/></filter>`,
      `<linearGradient id="sheen" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="${glass.sheenTop}"/><stop offset="0.5" stop-color="#ffffff" stop-opacity="${glass.sheenMid}"/><stop offset="1" stop-color="#ffffff" stop-opacity="${glass.sheenEnd}"/></linearGradient>`,
      `<linearGradient id="scrim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${theme.bg}" stop-opacity="${top}"/><stop offset="0.55" stop-color="${theme.bg}" stop-opacity="${middle}"/><stop offset="1" stop-color="${theme.bg}" stop-opacity="${bottom}"/></linearGradient>`,
      `<linearGradient id="fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${theme.bg}" stop-opacity="0"/><stop offset="1" stop-color="${theme.bg}" stop-opacity="${glass.fade}"/></linearGradient>`,
      `<linearGradient id="washg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000000"/><stop offset="0.4" stop-color="#ffffff"/><stop offset="1" stop-color="#ffffff"/></linearGradient>`,
      `<mask id="wash" maskUnits="userSpaceOnUse" x="0" y="${artRight}" width="${width}" height="${washH}"><rect y="${artRight}" width="${width}" height="${washH}" fill="url(#washg)"/></mask>`,
    );

    back.push(
      `<image href="${artwork}" x="${-BLEED}" y="${-BLEED}" width="${width + BLEED * 2}" height="${height + BLEED * 2}" preserveAspectRatio="xMidYMid slice" filter="url(#bloom)"/>`,
      `<rect width="${width}" height="${height}" fill="url(#scrim)"/>`,
    );

    if (options.glass) {
      // Frosted glass with no edges: the mask dissolves it instead of a box.
      back.push(
        `<g mask="url(#wash)"><image href="${artwork}" x="${-BLEED}" y="${-BLEED}" width="${width + BLEED * 2}" height="${height + BLEED * 2}" preserveAspectRatio="xMidYMid slice" filter="url(#frost)"/><rect y="${artRight}" width="${width}" height="${washH}" fill="${theme.surface}" fill-opacity="${glass.tint}"/><rect y="${artRight}" width="${width}" height="${washH}" fill="url(#sheen)"/></g>`,
      );
    }

    // Keeps the metadata readable without framing it in a box.
    back.push(
      `<rect y="${artRight}" width="${width}" height="${washH}" fill="url(#fade)"/>`,
    );
  }

  if (back.length) {
    layer.body.push(`<g clip-path="url(#card)">${back.join("")}</g>`);
  }

  const artRadius = 18;
  layer.defs.push(
    `<clipPath id="art"><rect x="${pad}" y="${pad}" width="${artSize}" height="${artSize}" rx="${artRadius}"/></clipPath>`,
  );

  const cover = artwork
    ? `<image href="${artwork}" x="${pad}" y="${pad}" width="${artSize}" height="${artSize}" preserveAspectRatio="xMidYMid slice"/>`
    : `<rect x="${pad}" y="${pad}" width="${artSize}" height="${artSize}" fill="${theme.surface}" fill-opacity="${glass.tint}"/>${musicNote(
        round(pad + artSize / 2 - 26),
        round(pad + artSize / 2 - 26),
        52,
        theme.subtext,
      )}`;

  layer.body.push(`<g clip-path="url(#art)">${cover}</g>`);

  if (theme.border !== "none") {
    layer.body.push(
      `<rect x="${pad + 0.5}" y="${pad + 0.5}" width="${artSize - 1}" height="${artSize - 1}" rx="${artRadius}" fill="none" stroke="${theme.border}" stroke-opacity="${glass.stroke}"/>`,
    );
  }

  const showBars = options.showBars && track.isPlaying;
  const barsX = artRight - 21;
  const statusY = textTop + 16;
  const logoSize = 13;
  const statusX = innerX + logoSize + 7;

  layer.body.push(spotifyLogo(innerX, statusY - 10, logoSize, theme.accent));

  if (showBars) {
    push(
      layer,
      equalizer({ id: "p", x: barsX, y: statusY + 1, height: 11, color: theme.accent }),
    );
  }

  const statusLimit = (showBars ? barsX - 10 : artRight) - statusX;
  layer.body.push(
    `<text class="status" x="${statusX}" y="${statusY}">${escapeXml(
      truncate(statusLabel(track).toUpperCase(), statusLimit / TRACKING, 9, true),
    )}</text>`,
  );

  const hasAlbum = Boolean(track.album) && track.album !== track.title;

  push(
    layer,
    textLine({
      id: "pt",
      text: track.title,
      x: innerX,
      y: textTop + (hasAlbum ? 41 : 46),
      maxWidth: innerW,
      fontSize: 16,
      className: "title",
      bold: true,
    }),
  );

  push(
    layer,
    textLine({
      id: "pa",
      text: track.artist,
      x: innerX,
      y: textTop + (hasAlbum ? 62 : 68),
      maxWidth: innerW,
      fontSize: 12,
      className: "artist",
    }),
  );

  if (hasAlbum) {
    push(
      layer,
      textLine({
        id: "pb",
        text: track.album,
        x: innerX,
        y: textTop + 81,
        maxWidth: innerW,
        fontSize: 10.5,
        className: "album",
      }),
    );
  }

  if (options.showBorder && theme.border !== "none") {
    layer.body.push(
      `<rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="${radius}" fill="none" stroke="${theme.border}" stroke-opacity="${glass.stroke}"/>`,
    );
  }

  return document(
    options,
    `${statusLabel(track)}: ${track.title} by ${track.artist}`,
    layer,
  );
}

export function renderMessageCard(
  options: CardOptions,
  headline: string,
  detail: string,
): string {
  const layer = createLayer();
  const { width, height, theme } = options;
  const small = options.variant === "small";

  if (options.variant === "portrait") {
    layer.css.push(`.title{font-size:15px;font-weight:600}.artist{font-size:11.5px}`);
    backdrop({ ...options, showArtBackdrop: false }, null, layer);

    const centerX = width / 2;
    const centerY = height / 2;

    layer.body.push(
      spotifyLogo(centerX - 17, centerY - 62, 34, theme.accent),
      `<text class="title" x="${centerX}" y="${centerY}" text-anchor="middle">${escapeXml(
        truncate(headline, width - 48, 15, true),
      )}</text>`,
      `<text class="artist" x="${centerX}" y="${centerY + 22}" text-anchor="middle">${escapeXml(
        truncate(detail, width - 40, 11.5),
      )}</text>`,
    );

    return document(options, `${headline}. ${detail}`, layer);
  }

  layer.css.push(
    small
      ? `.title{font-size:13px;font-weight:600}.artist{font-size:10.5px}`
      : `.title{font-size:16px;font-weight:600}.artist{font-size:12px}`,
  );

  backdrop({ ...options, showArtBackdrop: false }, null, layer);

  const logoSize = small ? 20 : 28;
  const logoX = small ? 16 : 24;
  const logoY = Math.round((height - logoSize) / 2);
  layer.body.push(spotifyLogo(logoX, logoY, logoSize, theme.accent));

  const textX = logoX + logoSize + (small ? 12 : 16);
  const maxWidth = Math.max(40, width - textX - 16);

  layer.body.push(
    `<text class="title" x="${textX}" y="${small ? 34 : 66}">${escapeXml(
      truncate(headline, maxWidth, small ? 13 : 16, true),
    )}</text>`,
    `<text class="artist" x="${textX}" y="${small ? 50 : 86}">${escapeXml(
      truncate(detail, maxWidth, small ? 10.5 : 12),
    )}</text>`,
  );

  return document(options, `${headline}. ${detail}`, layer);
}
