import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, ExternalLink, RotateCcw, Sparkles } from "lucide-react";
import { CardImage } from "./CardImage";
import {
  LIVE_URL,
  THEMES,
  VARIANTS,
  VARIANT_BY_ID,
  type ThemeName,
  type Variant,
} from "../lib/site";

const CUSTOM_FIELDS = [
  { key: "bg", placeholder: "0f0f0f" },
  { key: "surface", placeholder: "1f1f1f" },
  { key: "text", placeholder: "fafafa" },
  { key: "sub", placeholder: "737373" },
  { key: "accent", placeholder: "1db954" },
  { key: "border", placeholder: "2a2a2a" },
] as const;

type CustomKey = (typeof CUSTOM_FIELDS)[number]["key"];

function isValidHex(v: string) {
  return /^([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(v);
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="eyebrow mb-2.5">{label}</p>
      {children}
    </div>
  );
}

function Toggle({
  label,
  param,
  value,
  onChange,
}: {
  label: string;
  param: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className="flex w-full items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-black px-4 py-3.5 text-left transition-colors hover:border-white/20"
    >
      <span className="min-w-0">
        <span className="block text-sm text-cream">{label}</span>
        <span className="mt-0.5 block font-mono text-[11px] text-gray-500">
          {param}
        </span>
      </span>
      <span
        className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-colors duration-200 ${
          value ? "bg-primary" : "bg-white/15"
        }`}
      >
        <span
          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
            value ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </span>
    </button>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  suffix = "",
  minLabel,
  maxLabel,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  suffix?: string;
  minLabel?: string;
  maxLabel?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="mb-2.5 flex items-center justify-between">
        <label className="eyebrow" htmlFor={`slider-${label}`}>
          {label}
        </label>
        <span className="rounded-full bg-primary/10 px-2.5 py-1 font-mono text-[11px] text-primary">
          {value}
          {suffix}
        </span>
      </div>
      <input
        id={`slider-${label}`}
        type="range"
        className="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <div className="mt-1.5 flex justify-between font-mono text-[10px] text-gray-500">
        <span>{minLabel ?? min}</span>
        <span>{maxLabel ?? max}</span>
      </div>
    </div>
  );
}

export function Playground() {
  const [baseUrl, setBaseUrl] = useState(LIVE_URL);
  const [variant, setVariant] = useState<Variant>("main");
  const [theme, setTheme] = useState<ThemeName>("dark");
  const [mode, setMode] = useState<"dark" | "light">("dark");
  const [width, setWidth] = useState(420);
  const [radius, setRadius] = useState(16);
  const [bars, setBars] = useState(true);
  const [blur, setBlur] = useState(true);
  const [glass, setGlass] = useState(true);
  const [tint, setTint] = useState(55);
  const [showBorder, setShowBorder] = useState(true);
  const [custom, setCustom] = useState<Record<CustomKey, string>>({
    bg: "",
    surface: "",
    text: "",
    sub: "",
    accent: "",
    border: "",
  });
  const [snippet, setSnippet] = useState("url");
  const [copied, setCopied] = useState<string | null>(null);

  const meta = VARIANT_BY_ID[variant];

  const selectVariant = (v: Variant) => {
    const next = VARIANT_BY_ID[v];
    setVariant(v);
    setWidth((prev) => Math.min(next.width.max, Math.max(next.width.min, prev)));
    setRadius(next.radius);
  };

  const query = useMemo(() => {
    const p = new URLSearchParams();
    if (theme !== "dark") p.set("theme", theme);
    if (variant === "portrait" && mode !== "dark") p.set("mode", mode);
    if (width !== meta.width.def) p.set("width", String(width));
    if (radius !== meta.radius) p.set("radius", String(radius));
    if (!bars) p.set("bars", "false");
    if (variant !== "small" && !blur) p.set("blur", "false");
    if (variant === "small" && blur) p.set("blur", "true");
    if (variant === "portrait" && !glass) p.set("glass", "false");
    if (variant === "portrait" && tint !== 55) p.set("tint", String(tint));
    if (!showBorder && variant !== "portrait") p.set("show_border", "false");
    if (showBorder && variant === "portrait") p.set("show_border", "true");

    for (const [key, value] of Object.entries(custom)) {
      const hex = value.replace(/^#/, "");
      if (hex && isValidHex(hex)) p.set(key, hex.toLowerCase());
    }
    return p.toString();
  }, [
    theme,
    mode,
    width,
    radius,
    bars,
    blur,
    glass,
    tint,
    showBorder,
    custom,
    variant,
    meta,
  ]);

  const imageUrl = useMemo(() => {
    const base = baseUrl.trim().replace(/\/+$/, "");
    const qs = query ? `?${query}` : "";
    return meta.path === "/" ? `${base}/${qs}` : `${base}${meta.path}${qs}`;
  }, [baseUrl, meta.path, query]);

  const snippets = useMemo(
    () => [
      { id: "url", label: "Image URL", value: imageUrl },
      { id: "md", label: "Markdown", value: `![Spotify](${imageUrl})` },
      {
        id: "mdLink",
        label: "Clickable",
        value: `[![Spotify](${imageUrl})](https://open.spotify.com)`,
      },
      {
        id: "html",
        label: "HTML",
        value: `<img src="${imageUrl}" alt="Spotify now playing" width="${width}" />`,
      },
    ],
    [imageUrl, width],
  );

  const activeSnippet = snippets.find((s) => s.id === snippet) ?? snippets[0];

  const copy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      setCopied("failed");
      setTimeout(() => setCopied(null), 1800);
    }
  };

  const reset = () => {
    setTheme("dark");
    setMode("dark");
    setWidth(meta.width.def);
    setRadius(meta.radius);
    setBars(true);
    setBlur(true);
    setGlass(true);
    setTint(55);
    setShowBorder(true);
    setCustom({ bg: "", surface: "", text: "", sub: "", accent: "", border: "" });
  };

  return (
    <section id="playground" className="bg-black px-3 py-20 sm:px-4 md:px-6 md:py-28">
      <div className="mx-auto max-w-shell overflow-hidden rounded-[1.5rem] border border-white/[0.06] bg-ink-800 md:rounded-shell">
        <div className="border-b border-white/[0.06] px-6 pb-7 pt-8 sm:px-8 md:px-10 md:pt-10">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <p className="eyebrow flex items-center gap-2">
                <Sparkles className="h-3 w-3" aria-hidden /> Playground
              </p>
              <h2 className="mt-4 text-3xl font-medium leading-none tracking-tight text-cream sm:text-4xl">
                Tweak it.{" "}
                <span className="font-serif italic font-normal">Copy it.</span> Ship it.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-400">
                Every control maps to a query parameter. The preview is a real SVG from
                the live service, so what you see is exactly what your README gets.
              </p>
            </div>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-2 self-start rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-xs uppercase tracking-widest text-primary/70 transition-colors hover:bg-white/10 hover:text-primary lg:self-auto"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden /> Reset
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Controls */}
          <div className="min-w-0 space-y-8 border-b border-white/[0.06] p-6 sm:p-8 md:p-10 lg:border-b-0 lg:border-r">
            <Field label="Deployment URL">
              <input
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="https://your-app.vercel.app"
                aria-label="Deployment URL"
                className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-cream transition-colors placeholder:text-gray-600 focus:border-primary/40 focus:outline-none"
              />
              <p className="mt-2 text-[11px] text-gray-500">
                Swap in your own Vercel URL once you have deployed.
              </p>
            </Field>

            <Field label="Layout">
              <div className="grid grid-cols-3 gap-2">
                {VARIANTS.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    aria-pressed={variant === v.id}
                    onClick={() => selectVariant(v.id)}
                    className={`rounded-xl border px-3 py-3 text-sm font-medium transition-colors ${
                      variant === v.id
                        ? "border-primary bg-primary text-black"
                        : "border-white/10 bg-black text-primary/70 hover:border-white/25 hover:text-primary"
                    }`}
                  >
                    <span className="block font-mono text-[10px] uppercase tracking-widest opacity-60">
                      {v.path}
                    </span>
                    <span className="mt-1 block">{v.label}</span>
                    <span className="mt-0.5 block font-mono text-[10px] font-normal opacity-60">
                      {v.width.def} × {v.height}
                    </span>
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Theme">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {THEMES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    aria-pressed={theme === t.value}
                    onClick={() => setTheme(t.value)}
                    className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-colors ${
                      theme === t.value
                        ? "border-primary bg-primary text-black"
                        : "border-white/10 bg-black text-primary/70 hover:border-white/25 hover:text-primary"
                    }`}
                  >
                    <span
                      className="h-3.5 w-3.5 flex-shrink-0 rounded-full ring-1 ring-inset ring-black/20"
                      style={
                        t.dot === "transparent"
                          ? {
                              backgroundImage:
                                "repeating-conic-gradient(#3a3a3a 0% 25%, #141414 0% 50%)",
                              backgroundSize: "7px 7px",
                            }
                          : { background: t.dot }
                      }
                    />
                    <span className="truncate text-xs leading-none">{t.label}</span>
                  </button>
                ))}
              </div>
            </Field>

            {variant === "portrait" && (
              <Field label="Portrait shell">
                <div className="flex gap-2">
                  {(["dark", "light"] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      aria-pressed={mode === m}
                      onClick={() => setMode(m)}
                      className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium capitalize transition-colors ${
                        mode === m
                          ? "border-primary bg-primary text-black"
                          : "border-white/10 bg-black text-primary/60 hover:text-primary"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </Field>
            )}

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Slider
                label="Width"
                value={width}
                min={meta.width.min}
                max={meta.width.max}
                suffix="px"
                onChange={setWidth}
              />
              <Slider
                label="Radius"
                value={radius}
                min={0}
                max={40}
                suffix="px"
                onChange={setRadius}
              />
            </div>

            {variant === "portrait" && (
              <Slider
                label="Tint"
                value={tint}
                min={0}
                max={100}
                minLabel="muted"
                maxLabel="vivid"
                onChange={setTint}
              />
            )}

            <Field label="Options">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <Toggle
                  label="Equalizer bars"
                  param="bars"
                  value={bars}
                  onChange={setBars}
                />
                <Toggle
                  label="Album backdrop"
                  param="blur"
                  value={blur}
                  onChange={setBlur}
                />
                {variant === "portrait" && (
                  <Toggle
                    label="Frosted glass"
                    param="glass"
                    value={glass}
                    onChange={setGlass}
                  />
                )}
                <Toggle
                  label="Outer border"
                  param="show_border"
                  value={showBorder}
                  onChange={setShowBorder}
                />
              </div>
            </Field>

            <div>
              <div className="mb-2.5 flex flex-wrap items-baseline gap-x-2">
                <p className="eyebrow">Custom palette</p>
                <span className="text-[11px] normal-case tracking-normal text-gray-500">
                  hex without #, e.g. ff2d55
                </span>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {CUSTOM_FIELDS.map((f) => {
                  const raw = custom[f.key];
                  const invalid = raw.length > 0 && !isValidHex(raw.replace(/^#/, ""));
                  return (
                    <div key={f.key}>
                      <label
                        htmlFor={`hex-${f.key}`}
                        className="mb-1.5 block font-mono text-[11px] text-gray-400"
                      >
                        {f.key}
                      </label>
                      <div className="relative">
                        <input
                          id={`hex-${f.key}`}
                          value={raw}
                          onChange={(e) =>
                            setCustom((c) => ({ ...c, [f.key]: e.target.value.trim() }))
                          }
                          placeholder={f.placeholder}
                          aria-invalid={invalid}
                          className={`w-full rounded-xl border bg-black py-2.5 pl-9 pr-3 font-mono text-xs text-cream transition-colors placeholder:text-gray-600 focus:outline-none ${
                            invalid
                              ? "border-red-500/50"
                              : "border-white/10 focus:border-primary/40"
                          }`}
                        />
                        <span
                          className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full ring-1 ring-inset ring-white/15"
                          style={{
                            background: isValidHex(raw.replace(/^#/, ""))
                              ? `#${raw.replace(/^#/, "")}`
                              : "transparent",
                          }}
                          aria-hidden
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="flex min-w-0 flex-col bg-black/40 p-6 sm:p-8 md:p-10">
            <div className="lg:sticky lg:top-24">
              <div className="mb-4 flex items-center justify-between">
                <p className="eyebrow">Preview</p>
                <a
                  href={imageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-primary/60 transition-colors hover:text-primary"
                >
                  Open image <ExternalLink className="h-3 w-3" aria-hidden />
                </a>
              </div>

              <div
                className={`relative flex min-h-[280px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/[0.06] p-6 sm:p-8 ${
                  theme === "transparent" ? "checkerboard" : "bg-ink-900"
                }`}
              >
                {theme !== "transparent" && (
                  <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.06]" />
                )}
                <motion.div
                  key={imageUrl}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="relative z-10 w-full"
                >
                  <CardImage src={imageUrl} alt="Spotify card preview" width={width} />
                </motion.div>
              </div>

              <p className="mt-3 text-center font-mono text-[11px] text-gray-500">
                {width} × {meta.height} · {meta.label.toLowerCase()} · {theme}
              </p>

              <div className="mt-7">
                <div
                  className="flex flex-wrap gap-1.5"
                  role="tablist"
                  aria-label="Snippet format"
                >
                  {snippets.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      role="tab"
                      aria-selected={snippet === s.id}
                      onClick={() => setSnippet(s.id)}
                      className={`rounded-full px-3.5 py-1.5 text-[11px] font-medium transition-colors ${
                        snippet === s.id
                          ? "bg-primary text-black"
                          : "bg-white/5 text-primary/60 hover:bg-white/10 hover:text-primary"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                <div className="mt-3 overflow-hidden rounded-xl border border-white/10 bg-black">
                  <div className="flex items-center justify-between border-b border-white/5 px-4 py-2">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500">
                      {activeSnippet.label}
                    </span>
                    <button
                      type="button"
                      onClick={() => copy(activeSnippet.value, activeSnippet.id)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-[11px] font-medium text-primary/70 transition-colors hover:bg-primary hover:text-black"
                    >
                      {copied === activeSnippet.id ? (
                        <Check className="h-3 w-3" aria-hidden />
                      ) : (
                        <Copy className="h-3 w-3" aria-hidden />
                      )}
                      {copied === activeSnippet.id
                        ? "Copied"
                        : copied === "failed"
                          ? "Failed"
                          : "Copy"}
                    </button>
                  </div>
                  <code className="block max-h-32 overflow-auto break-all p-4 font-mono text-xs leading-relaxed text-gray-300">
                    {activeSnippet.value}
                  </code>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-primary/10 bg-primary/5 p-4">
                <p className="text-xs leading-relaxed text-primary/80">
                  <span className="font-medium text-primary">Tip:</span> GitHub caches
                  README images through its camo proxy. After pushing, run{" "}
                  <code className="rounded bg-black px-1.5 py-0.5 text-[11px]">
                    node scripts/purge-camo.mjs https://github.com/you/you
                  </code>{" "}
                  to bust it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
