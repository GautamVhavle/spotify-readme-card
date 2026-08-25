import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseOptions } from "../.build/_lib/options.js";
import {
  renderMainCard,
  renderMessageCard,
  renderPortraitCard,
  renderSmallCard,
} from "../.build/_lib/render.js";
import { measureText, truncate } from "../.build/_lib/svg.js";
import { portraitThemes, themes } from "../.build/_lib/themes.js";

const track = {
  isPlaying: true,
  title: "Cracks",
  artist: "Freestylers, Belle Humble",
  album: "Cracks",
  url: "https://open.spotify.com/track/2grynUHH0A3faPhGjdkjeJ",
  artworkUrl: "https://i.scdn.co/image/example",
  playedAt: null,
};

const stopped = { ...track, isPlaying: false, playedAt: new Date().toISOString() };

/** Every ampersand must open a real entity, otherwise the SVG is not well-formed. */
function assertWellFormed(svg) {
  assert.match(svg, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
  assert.match(svg, /<\/svg>$/);

  const openTags = (svg.match(/<[a-zA-Z]/g) ?? []).length;
  const closeTags = (svg.match(/<\/[a-zA-Z]/g) ?? []).length;
  const selfClosing = (svg.match(/\/>/g) ?? []).length;
  assert.equal(openTags, closeTags + selfClosing, "unbalanced tags");

  for (const match of svg.matchAll(/&(?![a-z]+;|#\d+;)/g)) {
    assert.fail(`unescaped ampersand at index ${match.index}`);
  }
}

describe("main card", () => {
  it("renders track metadata", () => {
    const svg = renderMainCard(track, null, parseOptions({}, "main"));
    assertWellFormed(svg);
    assert.ok(svg.includes(">Cracks<"));
    assert.ok(svg.includes("Freestylers, Belle Humble"));
    assert.ok(svg.includes("NOW PLAYING"));
  });

  it("falls back to the last played track", () => {
    const svg = renderMainCard(stopped, null, parseOptions({}, "main"));
    assert.ok(svg.includes("LAST PLAYED"));
  });

  it("animates the equalizer only while playing", () => {
    assert.ok(
      renderMainCard(track, null, parseOptions({}, "main")).includes("kf-eq-m"),
    );
    assert.ok(
      !renderMainCard(stopped, null, parseOptions({}, "main")).includes("kf-eq-m"),
    );
  });

  it("honours the bars parameter", () => {
    const svg = renderMainCard(track, null, parseOptions({ bars: "false" }, "main"));
    assert.ok(!svg.includes("kf-eq-m"));
  });

  it("scrolls titles that overflow", () => {
    const long = { ...track, title: "A".repeat(120) };
    const svg = renderMainCard(long, null, parseOptions({}, "main"));
    assertWellFormed(svg);
    assert.ok(svg.includes("@keyframes kf-t"));
    assert.ok(svg.includes("clip-t"));
  });

  it("does not scroll titles that fit", () => {
    const svg = renderMainCard(track, null, parseOptions({}, "main"));
    assert.ok(!svg.includes("@keyframes kf-t"));
  });

  it("embeds artwork as a data uri", () => {
    const svg = renderMainCard(
      track,
      "data:image/jpeg;base64,AAAA",
      parseOptions({}, "main"),
    );
    assert.ok(svg.includes('href="data:image/jpeg;base64,AAAA"'));
    assert.ok(svg.includes("feGaussianBlur"), "expected the blurred backdrop");
  });
});

describe("compact card", () => {
  it("renders at the compact size", () => {
    const svg = renderSmallCard(track, null, parseOptions({}, "small"));
    assertWellFormed(svg);
    assert.ok(svg.includes('width="340" height="76"'));
  });

  it("omits the blurred backdrop by default", () => {
    const svg = renderSmallCard(
      track,
      "data:image/jpeg;base64,AAAA",
      parseOptions({}, "small"),
    );
    assert.ok(!svg.includes("feGaussianBlur"));
  });
});

describe("portrait card", () => {
  const art = "data:image/jpeg;base64,AAAA";

  it("renders track metadata", () => {
    const svg = renderPortraitCard(track, null, parseOptions({}, "portrait"));
    assertWellFormed(svg);
    assert.ok(svg.includes(">Cracks<"));
    assert.ok(svg.includes("Freestylers, Belle Humble"));
    assert.ok(svg.includes("NOW PLAYING"));
  });

  it("draws in a fixed coordinate space and scales to the requested width", () => {
    const svg = renderPortraitCard(track, null, parseOptions({}, "portrait"));
    assert.ok(svg.includes('width="300" height="420"'));
    assert.ok(svg.includes('viewBox="0 0 300 420"'));

    const wide = renderPortraitCard(
      track,
      null,
      parseOptions({ width: "360" }, "portrait"),
    );
    assert.ok(wide.includes('width="360" height="504"'));
    assert.ok(wide.includes('viewBox="0 0 300 420"'), "viewBox must stay fixed");
  });

  it("clamps the requested width", () => {
    assert.equal(parseOptions({ width: "9999" }, "portrait").displayWidth, 420);
    assert.equal(parseOptions({ width: "1" }, "portrait").displayWidth, 240);
  });

  it("takes its colour from the album art", () => {
    const svg = renderPortraitCard(track, art, parseOptions({}, "portrait"));
    assertWellFormed(svg);
    assert.ok(svg.includes("feColorMatrix"), "expected the saturated bloom");
    assert.ok(svg.includes("url(#bloom)"));
    assert.ok(svg.includes("url(#scrim)"));
  });

  it("washes frosted glass over the artwork", () => {
    const svg = renderPortraitCard(track, art, parseOptions({}, "portrait"));
    assert.ok(svg.includes("url(#frost)"), "expected backdrop blur behind glass");
    assert.ok(svg.includes("url(#sheen)"));
    assert.ok(
      svg.includes('mask="url(#wash)"'),
      "glass should dissolve, not sit in a box",
    );
  });

  it("leaves the metadata unboxed and fades it into the backdrop", () => {
    const svg = renderPortraitCard(track, art, parseOptions({}, "portrait"));
    assert.ok(!svg.includes("url(#panel)"), "metadata should not sit in a box");
    assert.ok(!svg.includes("url(#badge)"), "logo should not sit in a badge");
    assert.ok(svg.includes("url(#fade)"), "expected a legibility fade");
  });

  it("drops the frost when glass is disabled", () => {
    const svg = renderPortraitCard(
      track,
      art,
      parseOptions({ glass: "false" }, "portrait"),
    );
    assertWellFormed(svg);
    assert.ok(!svg.includes("url(#frost)"));
    assert.ok(svg.includes("url(#fade)"), "fade should still keep text readable");
  });

  it("defaults to the dark shell and honours light mode", () => {
    assert.equal(parseOptions({}, "portrait").mode, "dark");
    assert.equal(parseOptions({ mode: "light" }, "portrait").mode, "light");

    const dark = parseOptions({}, "portrait");
    const light = parseOptions({ mode: "light" }, "portrait");
    assert.equal(dark.theme.text, portraitThemes.dark.text);
    assert.equal(light.theme.text, portraitThemes.light.text);
  });

  it("infers a light shell from the light theme", () => {
    assert.equal(parseOptions({ theme: "light" }, "portrait").mode, "light");
  });

  it("lets a named theme override the album palette", () => {
    const options = parseOptions({ theme: "dracula" }, "portrait");
    assert.equal(options.theme.bg, themes.dracula.bg);
    assertWellFormed(renderPortraitCard(track, null, options));
  });

  it("clamps the tint", () => {
    assert.equal(parseOptions({ tint: "-40" }, "portrait").tint, 0);
    assert.equal(parseOptions({ tint: "400" }, "portrait").tint, 100);
    assert.equal(parseOptions({}, "portrait").tint, 55);
  });

  it("animates the equalizer only while playing", () => {
    assert.ok(
      renderPortraitCard(track, null, parseOptions({}, "portrait")).includes("kf-eq-p"),
    );
    assert.ok(
      !renderPortraitCard(stopped, null, parseOptions({}, "portrait")).includes(
        "kf-eq-p",
      ),
    );
  });

  it("escapes hostile metadata", () => {
    const hostile = {
      ...track,
      title: "</text><script>alert(1)</script>",
      artist: "AT&T & <b>friends</b>",
    };
    const svg = renderPortraitCard(hostile, art, parseOptions({}, "portrait"));
    assertWellFormed(svg);
    assert.ok(!svg.includes("<script>"));
  });
});

describe("options", () => {
  it("applies a named theme", () => {
    const svg = renderMainCard(track, null, parseOptions({ theme: "dracula" }, "main"));
    assert.ok(svg.includes(themes.dracula.bg));
  });

  it("falls back to the default theme for unknown names", () => {
    const svg = renderMainCard(track, null, parseOptions({ theme: "nope" }, "main"));
    assert.ok(svg.includes(themes.dark.bg));
  });

  it("accepts hex overrides with or without a hash", () => {
    const options = parseOptions({ bg: "ff0000", accent: "#00ff00" }, "main");
    assert.equal(options.theme.bg, "#ff0000");
    assert.equal(options.theme.accent, "#00ff00");
  });

  it("rejects colours that are not hex", () => {
    const options = parseOptions({ bg: "red;}</style><script>" }, "main");
    assert.equal(options.theme.bg, themes.dark.bg);
  });

  it("supports transparent backgrounds", () => {
    const options = parseOptions({ theme: "transparent" }, "main");
    assert.equal(options.theme.bg, "none");
    const svg = renderMainCard(track, null, options);
    assert.ok(!svg.includes('fill="none" opacity'));
  });

  it("clamps the width", () => {
    assert.equal(parseOptions({ width: "10000" }, "main").width, 760);
    assert.equal(parseOptions({ width: "1" }, "small").width, 260);
    assert.equal(parseOptions({ width: "abc" }, "main").width, 420);
  });

  it("clamps the radius", () => {
    assert.equal(parseOptions({ radius: "-5" }, "main").radius, 0);
    assert.equal(parseOptions({ radius: "999" }, "main").radius, 40);
  });

  it("reads the first value when a parameter repeats", () => {
    assert.equal(
      parseOptions({ theme: ["light", "dark"] }, "main").theme.bg,
      themes.light.bg,
    );
  });
});

describe("escaping", () => {
  it("escapes markup in track metadata", () => {
    const hostile = {
      ...track,
      title: "</text><script>alert(1)</script>",
      artist: "AT&T & <b>friends</b>",
      album: 'it\'s "fine"',
    };
    const svg = renderMainCard(hostile, null, parseOptions({}, "main"));
    assertWellFormed(svg);
    assert.ok(!svg.includes("<script>"));
    assert.ok(svg.includes("&amp;"));
    assert.ok(svg.includes("&lt;"));
  });
});

describe("text helpers", () => {
  it("grows monotonically with length", () => {
    assert.ok(measureText("aa", 14) > measureText("a", 14));
    assert.ok(measureText("a", 20) > measureText("a", 14));
  });

  it("truncates with an ellipsis and keeps within budget", () => {
    const result = truncate("A very long track title indeed", 60, 14);
    assert.ok(result.endsWith("…"));
    assert.ok(measureText(result, 14) <= 60);
  });

  it("leaves short text untouched", () => {
    assert.equal(truncate("short", 400, 14), "short");
  });
});

describe("message card", () => {
  it("renders every size", () => {
    for (const variant of ["main", "small", "portrait"]) {
      const svg = renderMessageCard(
        parseOptions({}, variant),
        "Spotify unavailable",
        "Check the deployment environment variables",
      );
      assertWellFormed(svg);
      assert.ok(svg.includes("Spotify unavailable"));
    }
  });
});

describe("themes", () => {
  it("defines every token", () => {
    for (const [name, theme] of Object.entries(themes)) {
      for (const token of ["bg", "surface", "text", "subtext", "accent", "border"]) {
        assert.ok(theme[token], `${name} is missing ${token}`);
      }
    }
  });

  it("renders every theme on every layout", () => {
    for (const name of Object.keys(themes)) {
      assertWellFormed(
        renderMainCard(track, null, parseOptions({ theme: name }, "main")),
      );
      assertWellFormed(
        renderSmallCard(track, null, parseOptions({ theme: name }, "small")),
      );
      assertWellFormed(
        renderPortraitCard(track, null, parseOptions({ theme: name }, "portrait")),
      );
    }
  });

  it("renders both portrait shells over artwork", () => {
    for (const mode of ["dark", "light"]) {
      assertWellFormed(
        renderPortraitCard(
          track,
          "data:image/jpeg;base64,AAAA",
          parseOptions({ mode }, "portrait"),
        ),
      );
    }
  });
});
