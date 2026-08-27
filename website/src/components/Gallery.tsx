import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const LAYOUTS = [
  {
    label: "Detailed",
    path: "/",
    size: "420 × 142",
    desc: "Blurred album backdrop, artwork, status line, title, artist and album.",
    url: "https://live-spotify-readme-card.vercel.app/",
  },
  {
    label: "Compact",
    path: "/small",
    size: "340 × 76",
    desc: "Widget-style strip: artwork, status, title, artist and logo.",
    url: "https://live-spotify-readme-card.vercel.app/small",
  },
  {
    label: "Portrait",
    path: "/portrait",
    size: "300 × 420",
    desc: "Album art on top, frosted glass below, coloured by the record itself.",
    url: "https://live-spotify-readme-card.vercel.app/portrait",
  },
];

const THEMES: { name: string; note?: string }[] = [
  { name: "dark", note: "default" },
  { name: "light" },
  { name: "spotify" },
  { name: "dracula" },
  { name: "nord" },
  { name: "catppuccin" },
  { name: "tokyonight" },
  { name: "gruvbox" },
  { name: "rosepine" },
  { name: "synthwave" },
  { name: "transparent", note: "adapts to page" },
];

export function Gallery() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="gallery" className="bg-black px-4 md:px-6 py-8 md:py-12">
      <div className="bg-[#101010] rounded-2xl md:rounded-[2rem] px-6 sm:px-8 md:px-10 lg:px-12 py-10 sm:py-12 md:py-16 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <p className="text-primary text-[10px] sm:text-xs tracking-[0.2em] uppercase mb-4">Gallery</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-[#E1E0CC] tracking-tight">
            Three layouts. <span className="font-serif italic font-normal">Eleven themes.</span>
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm mt-3 leading-relaxed">
            Every theme works on every layout. Add <code className="bg-white/5 px-1.5 py-0.5 rounded text-primary/80">?theme=</code> to switch.
          </p>
        </div>

        {/* Layouts */}
        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
          {LAYOUTS.map((item, idx) => (
            <motion.div
              key={item.path}
              initial={{ y: 20, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{ delay: idx * 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="bg-black rounded-2xl p-6 sm:p-7 border border-white/[0.06] flex flex-col items-center text-center"
            >
              <div className="w-full flex justify-center bg-[#0a0a0a] rounded-xl p-4 sm:p-6 min-h-[160px] items-center">
                <img
                  src={item.url}
                  alt={`${item.label} card`}
                  className="max-w-full h-auto rounded-lg shadow-lg"
                  loading="lazy"
                  style={{ maxWidth: item.label === "Portrait" ? "200px" : "100%" }}
                />
              </div>
              <h3 className="text-[#E1E0CC] font-medium mt-5 text-base">{item.label}</h3>
              <p className="text-primary/60 text-xs font-mono mt-1">
                <code>{item.path}</code> · {item.size}
              </p>
              <p className="text-gray-500 text-xs leading-relaxed mt-2 max-w-[28ch]">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Themes grid */}
        <div>
          <h3 className="text-center text-[#E1E0CC] font-medium mb-2">Themes</h3>
          <p className="text-center text-gray-500 text-xs mb-6">
            Set with <code className="bg-white/5 px-1.5 py-0.5 rounded text-primary/70">?theme=</code> — every one works on both layouts.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {THEMES.map((t) => (
              <div
                key={t.name}
                className="bg-black rounded-xl p-3 sm:p-4 border border-white/[0.06] flex items-center gap-4"
              >
                <img
                  src={`https://live-spotify-readme-card.vercel.app/small?theme=${t.name}`}
                  alt={`${t.name} theme`}
                  className="w-[160px] sm:w-[180px] h-auto rounded-lg flex-shrink-0"
                  loading="lazy"
                />
                <div className="min-w-0">
                  <p className="text-[#E1E0CC] text-sm font-medium font-mono">
                    {t.name} {t.note && <span className="text-primary/50 text-xs font-sans">· {t.note}</span>}
                  </p>
                  <code className="text-[11px] text-gray-500 break-all">?theme={t.name}</code>
                </div>
              </div>
            ))}
            {/* custom palette */}
            <div className="bg-black rounded-xl p-3 sm:p-4 border border-white/[0.06] flex items-center gap-4">
              <img
                src="https://live-spotify-readme-card.vercel.app/small?bg=0f0f0f&accent=ff2d55&text=fafafa&sub=737373&border=1f1f1f"
                alt="custom palette"
                className="w-[160px] sm:w-[180px] h-auto rounded-lg flex-shrink-0"
                loading="lazy"
              />
              <div className="min-w-0">
                <p className="text-[#E1E0CC] text-sm font-medium">Custom</p>
                <code className="text-[11px] text-gray-500 break-all">?bg=0f0f0f&accent=ff2d55…</code>
              </div>
            </div>
          </div>
        </div>

        {/* Variations */}
        <div className="mt-12 md:mt-16">
          <h3 className="text-center text-[#E1E0CC] font-medium mb-6">Variations</h3>
          <div className="grid grid-cols-1 gap-4 max-w-3xl mx-auto">
            {[
              { url: "https://live-spotify-readme-card.vercel.app/?width=600&theme=tokyonight", cap: "/?width=600&theme=tokyonight" },
              { url: "https://live-spotify-readme-card.vercel.app/?theme=dracula&blur=false&radius=4", cap: "/?theme=dracula&blur=false&radius=4" },
              { url: "https://live-spotify-readme-card.vercel.app/small?theme=catppuccin&width=460&radius=24", cap: "/small?theme=catppuccin&width=460&radius=24" },
              { url: "https://live-spotify-readme-card.vercel.app/portrait?width=380&radius=0&tint=85", cap: "/portrait?width=380&radius=0&tint=85" },
            ].map((v) => (
              <div key={v.cap} className="bg-black rounded-xl p-4 border border-white/[0.06] flex flex-col items-center gap-3">
                <img src={v.url} alt={v.cap} className="max-w-full h-auto rounded-lg" loading="lazy" />
                <code className="text-[11px] text-gray-500 font-mono">{v.cap}</code>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
