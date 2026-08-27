import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Check } from "lucide-react";
import { WordsPullUpMultiStyle } from "./WordsPullUpMultiStyle";

const LAYOUTS = [
  {
    label: "Detailed",
    path: "/",
    size: "420 x 142",
    desc: "Blurred album backdrop, artwork, status line, title, artist and album.",
    url: "https://live-spotify-readme-card.vercel.app/",
  },
  {
    label: "Compact",
    path: "/small",
    size: "340 x 76",
    desc: "Widget style strip: artwork, status, title, artist and logo.",
    url: "https://live-spotify-readme-card.vercel.app/small",
  },
  {
    label: "Portrait",
    path: "/portrait",
    size: "300 x 420",
    desc: "Album art on top, frosted glass below, coloured by the record itself.",
    url: "https://live-spotify-readme-card.vercel.app/portrait",
  },
];

const FEATURE_CARDS = [
  {
    number: "01",
    title: "Detailed Card.",
    icon: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171918_4a5edc79-d78f-4637-ac8b-53c43c220606.png&w=1280&q=85",
    items: [
      "Blurred album backdrop with veil",
      "Artwork, status, title, artist and album",
      "Scrolling marquee for long titles",
      "Pulsing equalizer when playing",
    ],
  },
  {
    number: "02",
    title: "Compact Widget.",
    icon: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171741_ed9845ab-f5b2-4018-8ce7-07cc01823522.png&w=1280&q=85",
    items: [
      "340 x 76, fits anywhere",
      "Artwork plus status plus title plus artist",
      "No backdrop, pure widget",
      "Works in tables and sidebars",
    ],
  },
  {
    number: "03",
    title: "Portrait Glass.",
    icon: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171809_f56666dc-c099-4778-ad82-9ad4f209567b.png&w=1280&q=85",
    items: [
      "Frosted glass tinted by album art",
      "Tint 0 to 100 controls bleed",
      "Light and dark shell modes",
      "300 x 420, poster proportions",
    ],
  },
];

export function Features() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const layoutsRef = useRef<HTMLDivElement>(null);
  const layoutsInView = useInView(layoutsRef, { once: true, margin: "-60px" });

  return (
    <section id="features" className="relative bg-black px-3 sm:px-4 md:px-6 py-6 md:py-8 overflow-hidden">
      <div className="bg-noise absolute inset-0 opacity-[0.08] pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center py-8 md:py-12 max-w-3xl mx-auto">
          <div className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-normal leading-[1.05] tracking-tight">
            <WordsPullUpMultiStyle
              segments={[
                { text: "Studio grade cards", className: "text-[#E1E0CC]" },
                { text: "for your profile.", className: "text-[#E1E0CC]" },
              ]}
            />
          </div>
          <div className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-normal leading-[1.05] tracking-tight mt-1">
            <WordsPullUpMultiStyle
              segments={[
                { text: "Built for pure signal.", className: "text-gray-500" },
                { text: "Powered by Spotify.", className: "text-gray-500" },
              ]}
            />
          </div>
          <p className="text-primary/50 text-xs sm:text-sm mt-5 max-w-xl mx-auto leading-relaxed">
            Three layouts, eleven themes, six color overrides, zero runtime dependencies
          </p>
        </div>

        {/* Actual cards showcase - visual */}
        <div
          ref={layoutsRef}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto mb-10 md:mb-14"
        >
          {LAYOUTS.map((item, idx) => (
            <motion.div
              key={item.path}
              initial={{ y: 20, opacity: 0 }}
              animate={layoutsInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{ delay: idx * 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#101010] rounded-2xl p-6 sm:p-7 border border-white/[0.06] flex flex-col items-center text-center hover:border-white/10 transition-colors"
            >
              <div className="w-full flex justify-center items-center bg-black rounded-xl p-4 sm:p-6 min-h-[180px]">
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
              <p className="text-gray-400 text-xs leading-relaxed mt-2.5 max-w-[28ch]">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Feature detail cards - 4 col grid */}
        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-7xl mx-auto auto-rows-fr"
        >
          {/* Video card */}
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 12 }}
            animate={isInView ? { scale: 1, opacity: 1, y: 0 } : { scale: 0.96, opacity: 0, y: 12 }}
            transition={{ delay: 0, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl overflow-hidden relative flex flex-col min-h-[360px] md:min-h-[400px] lg:min-h-[420px]"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source
                src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_133058_0504132a-0cf3-4450-a370-8ea3b05c95d4.mp4"
                type="video/mp4"
              />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
              <p className="text-[#E1E0CC] text-lg sm:text-xl font-medium leading-tight">
                Your creative
                <br />
                canvas.
              </p>
              <p className="text-white/70 text-xs mt-2.5 leading-relaxed">
                Paste a URL. Get an SVG. Works everywhere an image does.
              </p>
              <div className="mt-4 flex gap-2">
                <span className="text-[10px] tracking-widest uppercase bg-white/10 backdrop-blur text-white px-2.5 py-1.5 rounded-full border border-white/10">
                  SVG
                </span>
                <span className="text-[10px] tracking-widest uppercase bg-white/10 backdrop-blur text-white px-2.5 py-1.5 rounded-full border border-white/10">
                  Animated
                </span>
              </div>
            </div>
          </motion.div>

          {FEATURE_CARDS.map((card, idx) => (
            <motion.div
              key={card.number}
              initial={{ scale: 0.96, opacity: 0, y: 12 }}
              animate={isInView ? { scale: 1, opacity: 1, y: 0 } : { scale: 0.96, opacity: 0, y: 12 }}
              transition={{
                delay: (idx + 1) * 0.12,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="rounded-2xl overflow-hidden relative bg-[#212121] p-5 sm:p-6 flex flex-col"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-black/40 flex-shrink-0 border border-white/5">
                <img src={card.icon} alt="" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="mt-4 flex items-baseline justify-between gap-2">
                <h3 className="text-[#E1E0CC] text-base sm:text-lg font-medium leading-tight">
                  {card.title}
                </h3>
                <span className="text-primary/40 text-xs font-mono flex-shrink-0">{card.number}</span>
              </div>
              <ul className="mt-4 space-y-2.5 flex-1">
                {card.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-primary/15 flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-primary" strokeWidth={3} />
                    </span>
                    <span className="text-gray-300 text-xs sm:text-[13px] leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#playground"
                className="mt-6 inline-flex items-center gap-1.5 text-xs font-medium text-primary/80 hover:text-primary transition-colors group/link w-fit"
              >
                Try it
                <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center group-hover/link:bg-primary/20 transition-colors">
                  <ArrowRight className="w-3 h-3 -rotate-45 group-hover/link:rotate-0 transition-transform duration-200" />
                </span>
              </a>
            </motion.div>
          ))}
        </div>

        {/* Theme strip */}
        <div className="mt-6 md:mt-8 max-w-7xl mx-auto">
          <div className="bg-[#101010] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="w-2 h-2 rounded-full bg-[#1DB954] animate-pulse flex-shrink-0" />
              <p className="text-[#E1E0CC] text-sm font-medium">11 themes plus custom hex overrides</p>
              <span className="hidden lg:inline text-gray-500 text-xs">
                · dark · light · spotify · dracula · nord · catppuccin · tokyonight · gruvbox · rosepine · synthwave · transparent
              </span>
            </div>
            <a
              href="#playground"
              className="text-xs tracking-widest uppercase bg-primary text-black px-5 py-2.5 rounded-full font-medium hover:bg-primary/90 transition-colors whitespace-nowrap flex-shrink-0"
            >
              Customize
            </a>
          </div>
          <p className="lg:hidden text-gray-500 text-xs text-center mt-3 leading-relaxed px-4">
            dark · light · spotify · dracula · nord · catppuccin · tokyonight · gruvbox · rosepine · synthwave · transparent
          </p>
        </div>
      </div>
    </section>
  );
}
