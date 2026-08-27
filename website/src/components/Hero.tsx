import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { WordsPullUp } from "./WordsPullUp";

const NAV_ITEMS = [
  { label: "About", href: "#about" },
  { label: "Features", href: "#features" },
  { label: "Playground", href: "#playground" },
  { label: "Setup", href: "#setup" },
];

export function Hero() {
  return (
    <section className="min-h-[100svh] p-3 sm:p-4 md:p-6 bg-black flex flex-col">
      <div className="relative w-full flex-1 min-h-[600px] rounded-2xl md:rounded-[2rem] overflow-hidden flex flex-col">
        {/* Background video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1920&q=80"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4"
            type="video/mp4"
          />
        </video>

        {/* Noise overlay */}
        <div className="noise-overlay absolute inset-0 opacity-[0.35] mix-blend-overlay pointer-events-none" />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/75 pointer-events-none" />

        {/* Navbar - pill hanging from top */}
        <nav className="relative z-20 flex justify-center pt-0">
          <div className="bg-black rounded-b-2xl md:rounded-b-3xl px-4 sm:px-6 md:px-8 py-2.5 md:py-3 flex items-center gap-5 sm:gap-8 md:gap-10">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-[11px] sm:text-xs md:text-sm whitespace-nowrap transition-colors duration-200 font-medium"
                style={{ color: "rgba(225, 224, 204, 0.75)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#E1E0CC")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(225, 224, 204, 0.75)")}
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>

        {/* Hero Content - bottom aligned, not absolute to avoid hiding */}
        <div className="relative z-10 mt-auto p-4 sm:p-6 md:p-8 lg:p-10">
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-8 items-start lg:items-end">
            {/* Left - Giant heading */}
            <div className="w-full lg:col-span-7 xl:col-span-8">
              <div className="overflow-visible">
                <WordsPullUp
                  text="Spotify"
                  showAsterisk
                  className="text-[22vw] sm:text-[18vw] md:text-[15vw] lg:text-[11vw] xl:text-[10vw] 2xl:text-[9vw] font-medium leading-[0.85] tracking-[-0.04em] text-[#E1E0CC]"
                />
              </div>
              <p className="text-primary/60 text-[10px] sm:text-xs tracking-[0.2em] uppercase font-light mt-3 sm:mt-4">
                README Card &nbsp;·&nbsp; Live now playing &nbsp;·&nbsp; SVG
              </p>
            </div>

            {/* Right - description + CTA */}
            <div className="w-full lg:col-span-5 xl:col-span-4 flex flex-col gap-4 sm:gap-5 lg:pb-2">
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="text-primary/80 text-sm sm:text-base leading-relaxed max-w-md"
              >
                A serverless Spotify card for your GitHub profile. Animated, edge rendered, and
                alive. Shows what you are playing now, or what you played last.
              </motion.p>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <a
                  href="#playground"
                  className="group inline-flex items-center gap-2 bg-primary rounded-full pl-5 pr-1.5 py-1.5 transition-all duration-300 hover:bg-primary/90"
                >
                  <span className="text-black font-medium text-sm sm:text-base">
                    Open playground
                  </span>
                  <span className="bg-black rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </span>
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="flex items-center gap-2 sm:gap-3 pt-1 flex-wrap"
              >
                <a
                  href="https://github.com/GautamVhavle/spotify-readme-card"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] sm:text-xs tracking-widest uppercase text-white/70 hover:text-white hover:bg-white/10 transition-colors border border-white/15 hover:border-white/25 rounded-full px-3 sm:px-4 py-2 bg-black/20 backdrop-blur"
                >
                  GitHub
                </a>
                <a
                  href="https://live-spotify-readme-card.vercel.app/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] sm:text-xs tracking-widest uppercase text-white/70 hover:text-white hover:bg-white/10 transition-colors border border-white/15 hover:border-white/25 rounded-full px-3 sm:px-4 py-2 bg-black/20 backdrop-blur"
                >
                  Live demo
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
