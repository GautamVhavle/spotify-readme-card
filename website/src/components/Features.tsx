import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Check } from "lucide-react";
import { WordsPullUpMultiStyle } from "./WordsPullUpMultiStyle";

const cards = [
  {
    type: "video" as const,
    text: "Your listening, live.",
  },
  {
    type: "feature" as const,
    number: "01",
    title: "Detailed Card.",
    icon: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171918_4a5edc79-d78f-4637-ac8b-53c43c220606.png&w=1280&q=85",
    items: [
      "Blurred album backdrop with veil",
      "Artwork, status, title, artist & album",
      "Scrolling marquee for long titles",
      "Pulsing equalizer when playing",
    ],
  },
  {
    type: "feature" as const,
    number: "02",
    title: "Compact Widget.",
    icon: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171741_ed9845ab-f5b2-4018-8ce7-07cc01823522.png&w=1280&q=85",
    items: [
      "340 × 76 — fits anywhere",
      "Artwork + status + title + artist",
      "No backdrop, pure widget",
      "Works in tables & sidebars",
    ],
  },
  {
    type: "feature" as const,
    number: "03",
    title: "Portrait Glass.",
    icon: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171809_f56666dc-c099-4778-ad82-9ad4f209567b.png&w=1280&q=85",
    items: [
      "Frosted glass tinted by album art",
      "Tint 0–100 controls bleed",
      "Light & dark shell modes",
      "300 × 420 — poster proportions",
    ],
  },
];

export function Features() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" className="relative min-h-screen bg-black px-4 md:px-6 py-8 md:py-12 overflow-hidden">
      {/* subtle noise overlay */}
      <div className="bg-noise absolute inset-0 opacity-[0.15] pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center py-10 md:py-14">
          <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal leading-tight">
            <WordsPullUpMultiStyle
              segments={[
                { text: "Studio-grade cards for your profile.", className: "text-[#E1E0CC]" },
              ]}
            />
          </div>
          <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal leading-tight mt-1">
            <WordsPullUpMultiStyle
              segments={[
                { text: "Built for pure signal. Powered by Spotify.", className: "text-gray-500" },
              ]}
            />
          </div>
          <p className="text-primary/50 text-xs sm:text-sm mt-4 max-w-xl mx-auto">
            Three layouts · Eleven themes · Six color overrides · Zero runtime dependencies
          </p>
        </div>

        {/* 4-col grid */}
        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-2 md:gap-1 lg:h-[480px] max-w-7xl mx-auto"
        >
          {cards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.95, opacity: 0 }}
              transition={{
                delay: idx * 0.15,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`rounded-2xl overflow-hidden relative ${
                card.type === "video" ? "min-h-[320px] lg:min-h-0" : "bg-[#212121] p-5 sm:p-6 flex flex-col"
              }`}
            >
              {card.type === "video" ? (
                <>
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                    <p className="text-[#E1E0CC] text-lg sm:text-xl font-medium leading-tight">
                      Your creative
                      <br />
                      canvas.
                    </p>
                    <p className="text-white/60 text-xs mt-2 leading-relaxed">
                      Paste a URL. Get an SVG. Works everywhere an image does.
                    </p>
                    <div className="mt-4 flex gap-2">
                      <span className="text-[10px] tracking-widest uppercase bg-white/10 backdrop-blur text-white px-2.5 py-1 rounded-full border border-white/10">
                        SVG
                      </span>
                      <span className="text-[10px] tracking-widest uppercase bg-white/10 backdrop-blur text-white px-2.5 py-1 rounded-full border border-white/10">
                        Animated
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Icon */}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-black/30 flex-shrink-0">
                    <img
                      src={card.icon}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Title */}
                  <div className="mt-4 flex items-baseline justify-between">
                    <h3 className="text-[#E1E0CC] text-base sm:text-lg font-medium leading-tight">
                      {card.title}
                    </h3>
                    <span className="text-primary/40 text-xs font-mono">
                      {card.number}
                    </span>
                  </div>

                  {/* Checklist */}
                  <ul className="mt-4 space-y-2.5 flex-1">
                    {card.items.map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-primary/15 flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-primary" strokeWidth={3} />
                        </span>
                        <span className="text-gray-400 text-xs sm:text-[13px] leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Learn more */}
                  <a
                    href="#playground"
                    className="mt-6 inline-flex items-center gap-1.5 text-xs text-primary/70 hover:text-primary transition-colors group/link"
                  >
                    Try it
                    <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center group-hover/link:bg-primary/20 transition-colors">
                      <ArrowRight className="w-3 h-3 -rotate-45 group-hover/link:rotate-0 transition-transform duration-200" />
                    </span>
                  </a>
                </>
              )}
            </motion.div>
          ))}
        </div>

        {/* Theme strip */}
        <div className="mt-8 md:mt-10 max-w-7xl mx-auto">
          <div className="bg-[#101010] rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#1DB954] animate-pulse" />
              <p className="text-[#E1E0CC] text-sm font-medium">11 themes + custom hex overrides</p>
              <span className="hidden sm:inline text-gray-500 text-xs">· dark · light · spotify · dracula · nord · catppuccin · tokyonight · gruvbox · rosepine · synthwave · transparent</span>
            </div>
            <a
              href="#playground"
              className="text-xs tracking-widest uppercase bg-primary text-black px-4 py-2 rounded-full font-medium hover:bg-primary/90 transition-colors whitespace-nowrap"
            >
              Customize →
            </a>
          </div>
          <p className="sm:hidden text-gray-500 text-[10px] text-center mt-3 leading-relaxed px-4">
            dark · light · spotify · dracula · nord · catppuccin · tokyonight · gruvbox · rosepine · synthwave · transparent
          </p>
        </div>
      </div>
    </section>
  );
}
