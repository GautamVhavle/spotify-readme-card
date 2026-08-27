import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Copy, Check, ExternalLink, RotateCcw, Sparkles } from "lucide-react";

type Variant = "main" | "small" | "portrait";
type ThemeName =
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

const THEMES: { value: ThemeName; label: string; dot: string }[] = [
  { value: "dark", label: "Dark", dot: "#0d1117" },
  { value: "light", label: "Light", dot: "#ffffff" },
  { value: "spotify", label: "Spotify", dot: "#121212" },
  { value: "dracula", label: "Dracula", dot: "#282a36" },
  { value: "nord", label: "Nord", dot: "#2e3440" },
  { value: "catppuccin", label: "Catppuccin", dot: "#1e1e2e" },
  { value: "tokyonight", label: "Tokyo Night", dot: "#1a1b26" },
  { value: "gruvbox", label: "Gruvbox", dot: "#282828" },
  { value: "rosepine", label: "Rosé Pine", dot: "#191724" },
  { value: "synthwave", label: "Synthwave", dot: "#241b2f" },
  { value: "transparent", label: "Transparent", dot: "transparent" },
];

const VARIANT_META: Record<Variant, { label: string; path: string; width: { min: number; max: number; def: number }; height: number }> = {
  main: { label: "Detailed", path: "/", width: { min: 320, max: 760, def: 420 }, height: 142 },
  small: { label: "Compact", path: "/small", width: { min: 260, max: 560, def: 340 }, height: 76 },
  portrait: { label: "Portrait", path: "/portrait", width: { min: 240, max: 420, def: 300 }, height: 420 },
};

function isValidHex(v: string) {
  return /^([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(v);
}

export function Playground() {
  const [baseUrl, setBaseUrl] = useState("https://live-spotify-readme-card.vercel.app");
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
  const [custom, setCustom] = useState({ bg: "", surface: "", text: "", sub: "", accent: "", border: "" });
  const [copied, setCopied] = useState<string | null>(null);

  const meta = VARIANT_META[variant];

  // keep width in range when variant changes
  const handleVariant = (v: Variant) => {
    setVariant(v);
    const m = VARIANT_META[v];
    setWidth((prev) => Math.min(m.width.max, Math.max(m.width.min, prev)));
    if (v === "portrait") setRadius(22);
    else if (v === "main") setRadius(16);
    else setRadius(14);
  };

  const query = useMemo(() => {
    const p = new URLSearchParams();
    if (theme !== "dark") p.set("theme", theme);
    if (variant === "portrait" && mode !== "dark") p.set("mode", mode);
    if (width !== meta.width.def) p.set("width", String(width));
    if (
      (variant === "portrait" && radius !== 22) ||
      (variant === "main" && radius !== 16) ||
      (variant === "small" && radius !== 14)
    ) {
      p.set("radius", String(radius));
    }
    if (!bars) p.set("bars", "false");
    if (variant !== "small" && !blur) p.set("blur", "false");
    if (variant === "small" && blur) p.set("blur", "true");
    if (variant === "portrait" && !glass) p.set("glass", "false");
    if (variant === "portrait" && tint !== 55) p.set("tint", String(tint));
    if (!showBorder && variant !== "portrait") p.set("show_border", "false");
    if (showBorder && variant === "portrait") p.set("show_border", "true");
    // custom colors
    (Object.entries(custom) as [keyof typeof custom, string][]).forEach(([k, v]) => {
      const key = k === "sub" ? "sub" : k;
      if (v && isValidHex(v)) p.set(key, v.toLowerCase().replace(/^#/, ""));
    });
    return p.toString();
  }, [theme, mode, width, radius, bars, blur, glass, tint, showBorder, custom, variant, meta]);

  const imageUrl = useMemo(() => {
    const cleanBase = baseUrl.replace(/\/$/, "");
    const path = meta.path;
    const qs = query ? `?${query}` : "";
    // for main, path is "/" -> avoid double slash
    if (path === "/") return `${cleanBase}/${qs}`;
    return `${cleanBase}${path}${qs}`;
  }, [baseUrl, meta.path, query]);

  const markdown = `![Spotify](${imageUrl})`;
  const markdownLink = `[![Spotify](${imageUrl})](https://open.spotify.com)`;
  const htmlTag = `<img src="${imageUrl}" alt="Spotify now playing" width="${width}" />`;

  const copy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1800);
  };

  const reset = () => {
    setTheme("dark");
    setMode("dark");
    setWidth(meta.width.def);
    setRadius(variant === "portrait" ? 22 : variant === "main" ? 16 : 14);
    setBars(true);
    setBlur(true);
    setGlass(true);
    setTint(55);
    setShowBorder(true);
    setCustom({ bg: "", surface: "", text: "", sub: "", accent: "", border: "" });
  };

  return (
    <section id="playground" className="bg-black px-4 md:px-6 py-8 md:py-12">
      <div className="bg-[#101010] rounded-2xl md:rounded-[2rem] overflow-hidden max-w-7xl mx-auto">
        {/* Header */}
        <div className="px-6 sm:px-8 md:px-10 pt-8 sm:pt-10 md:pt-12 pb-6 border-b border-white/[0.06]">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div>
              <p className="text-primary text-[10px] sm:text-xs tracking-[0.2em] uppercase mb-3 flex items-center gap-2">
                <Sparkles className="w-3 h-3" /> Playground · Live preview
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-[#E1E0CC] tracking-tight leading-none">
                Tweak it. <span className="font-serif italic font-normal">Copy it.</span> Ship it.
              </h2>
              <p className="text-gray-500 text-xs sm:text-sm mt-3 max-w-xl leading-relaxed">
                Every knob maps to a query parameter. The preview is a real SVG from the live service, what you see is what your README gets.
              </p>
            </div>
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 text-xs tracking-widest uppercase bg-white/5 hover:bg-white/10 text-primary/70 hover:text-primary border border-white/10 rounded-full px-4 py-2.5 transition-colors self-start lg:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-0">
          {/* Controls */}
          <div className="p-6 sm:p-8 md:p-10 space-y-7 border-b lg:border-b-0 lg:border-r border-white/[0.06]">
            {/* Base URL */}
            <div>
              <label className="text-[10px] tracking-[0.15em] uppercase text-primary/60 mb-2 block">Deployment URL</label>
              <input
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="https://your-app.vercel.app"
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-[#E1E0CC] placeholder:text-gray-600 focus:outline-none focus:border-primary/30 focus:ring-1 focus:ring-primary/20 transition-colors"
              />
              <p className="text-[11px] text-gray-500 mt-2">Replace with your own Vercel URL after deploying.</p>
            </div>

            {/* Variant */}
            <div>
              <label className="text-[10px] tracking-[0.15em] uppercase text-primary/60 mb-2 block">Layout</label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(VARIANT_META) as Variant[]).map((v) => (
                  <button
                    key={v}
                    onClick={() => handleVariant(v)}
                    className={`rounded-xl px-3 py-3 text-sm font-medium border transition-all ${
                      variant === v
                        ? "bg-primary text-black border-primary"
                        : "bg-black text-primary/70 border-white/10 hover:border-white/20 hover:text-primary"
                    }`}
                  >
                    <span className="block text-xs tracking-widest uppercase opacity-60">{VARIANT_META[v].path}</span>
                    <span className="block mt-1">{VARIANT_META[v].label}</span>
                    <span className="block text-[11px] opacity-60 font-normal mt-0.5">
                      {VARIANT_META[v].width.def} × {VARIANT_META[v].height}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Theme */}
            <div>
              <label className="text-[10px] tracking-[0.15em] uppercase text-primary/60 mb-2 block">Theme</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {THEMES.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setTheme(t.value)}
                    className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm border text-left transition-colors ${
                      theme === t.value
                        ? "bg-primary text-black border-primary"
                        : "bg-black text-primary/70 border-white/10 hover:border-white/20 hover:text-primary"
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-black/10 flex-shrink-0"
                      style={{ background: t.dot === "transparent" ? "repeating-conic-gradient(#333 0% 25%, #111 0% 50%) 0 0 / 8px 8px" : t.dot }}
                    />
                    <span className="text-xs sm:text-sm leading-none">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mode for portrait */}
            {variant === "portrait" && (
              <div>
                <label className="text-[10px] tracking-[0.15em] uppercase text-primary/60 mb-2 block">Portrait shell</label>
                <div className="flex gap-2">
                  {(["dark", "light"] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setMode(m)}
                      className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium border capitalize transition-colors ${
                        mode === m ? "bg-primary text-black border-primary" : "bg-black text-primary/60 border-white/10 hover:text-primary"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] tracking-[0.15em] uppercase text-primary/60">Width</label>
                  <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded-full">{width}px</span>
                </div>
                <input
                  type="range"
                  min={meta.width.min}
                  max={meta.width.max}
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  className="w-full accent-[#DEDBC8] h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-500 mt-1 font-mono">
                  <span>{meta.width.min}</span>
                  <span>{meta.width.max}</span>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] tracking-[0.15em] uppercase text-primary/60">Radius</label>
                  <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded-full">{radius}px</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={40}
                  value={radius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                  className="w-full accent-[#DEDBC8] h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-500 mt-1 font-mono">
                  <span>0</span>
                  <span>40</span>
                </div>
              </div>
            </div>

            {variant === "portrait" && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] tracking-[0.15em] uppercase text-primary/60">Tint: album colour bleed</label>
                  <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded-full">{tint}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={tint}
                  onChange={(e) => setTint(Number(e.target.value))}
                  className="w-full accent-[#DEDBC8] h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                  <span>muted</span>
                  <span>vivid</span>
                </div>
              </div>
            )}

            {/* Toggles */}
            <div>
              <label className="text-[10px] tracking-[0.15em] uppercase text-primary/60 mb-3 block">Options</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Equalizer bars", value: bars, setter: setBars, desc: "bars" },
                  { label: "Blur backdrop", value: blur, setter: setBlur, desc: "blur", hide: variant === "portrait" ? false : variant === "small" ? false : false },
                  { label: "Frosted glass", value: glass, setter: setGlass, desc: "glass", showOnly: "portrait" },
                  { label: "Border", value: showBorder, setter: setShowBorder, desc: "show_border" },
                ]
                  .filter((t) => {
                    if ((t as unknown as { showOnly?: string }).showOnly === "portrait" && variant !== "portrait") return false;
                    return true;
                  })
                  .map((toggle) => (
                    <div
                      key={toggle.label}
                      className="flex items-center justify-between bg-black border border-white/10 rounded-xl px-4 py-3 hover:border-white/20 transition-colors"
                    >
                      <div>
                        <p className="text-sm text-[#E1E0CC] leading-none">{toggle.label}</p>
                        <p className="text-[11px] text-gray-500 font-mono mt-1">{toggle.desc}</p>
                      </div>
                      <button
                        type="button"
                        aria-pressed={toggle.value}
                        onClick={() => toggle.setter(!toggle.value)}
                        className={`relative w-10 h-6 rounded-full transition-colors flex-shrink-0 ml-3 ${toggle.value ? "bg-primary" : "bg-white/15"}`}
                      >
                        <span
                          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${toggle.value ? "translate-x-4" : "translate-x-0.5"}`}
                        />
                      </button>
                    </div>
                  ))}
              </div>
            </div>

            {/* Custom colors */}
            <div>
              <label className="text-[10px] tracking-[0.15em] uppercase text-primary/60 mb-2 block">
                Custom palette <span className="normal-case tracking-normal text-gray-500">hex without #, e.g. ff2d55 or transparent</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { key: "bg" as const, label: "bg", placeholder: "0f0f0f" },
                  { key: "surface" as const, label: "surface", placeholder: "1f1f1f" },
                  { key: "text" as const, label: "text", placeholder: "fafafa" },
                  { key: "sub" as const, label: "sub", placeholder: "737373" },
                  { key: "accent" as const, label: "accent", placeholder: "1db954" },
                  { key: "border" as const, label: "border", placeholder: "2a2a2a" },
                ].map((c) => {
                  const val = custom[c.key];
                  const valid = !val || val.toLowerCase() === "transparent" || val.toLowerCase() === "none" || isValidHex(val);
                  return (
                    <div key={c.key}>
                      <label className="text-[11px] font-mono text-gray-400 mb-1 block">{c.label}</label>
                      <div className="relative">
                        <input
                          value={val}
                          onChange={(e) => setCustom((prev) => ({ ...prev, [c.key]: e.target.value }))}
                          placeholder={c.placeholder}
                          className={`w-full bg-black border rounded-xl px-3 py-2.5 text-sm font-mono text-[#E1E0CC] placeholder:text-gray-600 focus:outline-none transition-colors pr-8 ${
                            valid ? "border-white/10 focus:border-primary/30" : "border-red-500/50 focus:border-red-500"
                          }`}
                        />
                        {val && (
                          <span
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border border-white/20"
                            style={{
                              background: valid && val.toLowerCase() !== "transparent" && val.toLowerCase() !== "none" && isValidHex(val) ? `#${val.replace(/^#/, "")}` : "transparent",
                            }}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="p-6 sm:p-8 md:p-10 bg-black/40 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] tracking-[0.15em] uppercase text-primary/60">Preview</p>
              <a
                href={imageUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-primary/60 hover:text-primary transition-colors"
              >
                Open image <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Image preview card */}
            <div className="flex-1 flex flex-col items-center justify-center bg-[#0a0a0a] rounded-2xl border border-white/[0.06] p-6 sm:p-8 min-h-[280px] relative overflow-hidden">
              <div className="absolute inset-0 bg-noise opacity-[0.07] pointer-events-none" />
              <motion.div
                key={imageUrl}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 w-full flex justify-center"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt="Spotify card preview"
                  width={width}
                  style={{ maxWidth: "100%", height: "auto" }}
                  className="rounded-xl shadow-2xl"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                  onLoad={(e) => {
                    (e.target as HTMLImageElement).style.display = "block";
                  }}
                />
              </motion.div>
              <p className="relative z-10 text-[11px] text-gray-500 mt-4 font-mono text-center break-all px-2">
                {width} × {meta.height} · {variant} · {theme}
              </p>
            </div>

            {/* URL + snippets */}
            <div className="mt-6 space-y-4">
              {[
                { id: "url", label: "Image URL", value: imageUrl },
                { id: "md", label: "Markdown", value: markdown },
                { id: "mdLink", label: "Markdown (clickable)", value: markdownLink },
                { id: "html", label: "HTML", value: htmlTag },
              ].map((item) => (
                <div key={item.id} className="group">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] tracking-[0.15em] uppercase text-primary/50">{item.label}</span>
                    <button
                      onClick={() => copy(item.value, item.id)}
                      className="inline-flex items-center gap-1.5 text-[11px] font-medium bg-white/5 hover:bg-primary hover:text-black text-primary/70 border border-white/10 rounded-full px-3 py-1 transition-colors"
                    >
                      {copied === item.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copied === item.id ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <div className="bg-black border border-white/10 rounded-xl px-4 py-3 overflow-hidden">
                    <code className="text-xs font-mono text-gray-300 break-all leading-relaxed block max-h-20 overflow-auto">
                      {item.value}
                    </code>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-primary/5 border border-primary/10 rounded-xl p-4">
              <p className="text-xs text-primary/80 leading-relaxed">
                <span className="font-medium text-primary">Tip:</span> GitHub caches README images via its camo proxy. After pushing, run{" "}
                <code className="bg-black px-1.5 py-0.5 rounded text-[11px] font-mono">node scripts/purge-camo.mjs https://github.com/you/you</code> to bust the cache.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
