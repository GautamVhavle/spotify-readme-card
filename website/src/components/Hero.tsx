import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { WordsPullUp } from "./WordsPullUp";

const NAV_ITEMS = [
  { label: "Our story", href: "#about" },
  { label: "Collective", href: "#features" },
  { label: "Workshops", href: "#playground" },
  { label: "Programs", href: "#gallery" },
  { label: "Inquiries", href: "#setup" },
];

export function Hero() {
  return (
    <section className="h-screen p-4 md:p-6 bg-black">
      <div className="relative w-full h-full rounded-2xl md:rounded-[2rem] overflow-hidden">
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
        <div className="noise-overlay absolute inset-0 opacity-[0.7] mix-blend-overlay pointer-events-none" />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 pointer-events-none" />

        {/* Navbar - pill hanging from top */}
        <nav className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
          <div className="bg-black rounded-b-2xl md:rounded-b-3xl px-4 py-2 md:px-8 flex items-center gap-3 sm:gap-6 md:gap-12 lg:gap-14">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-[10px] sm:text-xs md:text-sm whitespace-nowrap transition-colors duration-200"
                style={{ color: "rgba(225, 224, 204, 0.8)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#E1E0CC")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(225, 224, 204, 0.8)")}
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>

        {/* Hero Content - bottom aligned, 12-col grid */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 lg:p-10">
          <div className="grid grid-cols-12 gap-4 md:gap-6 items-end">
            {/* Left 8 cols - Giant heading */}
            <div className="col-span-12 lg:col-span-8">
              <WordsPullUp
                text="Spotify"
                showAsterisk
                className="text-[26vw] sm:text-[24vw] md:text-[22vw] lg:text-[20vw] xl:text-[19vw] 2xl:text-[20vw] font-medium leading-[0.85] tracking-[-0.07em]"
              />
              {/* Inline style for color since WordsPullUp doesn't set it */}
              <style>{`.hero-title span{color:#E1E0CC}`}</style>
              <div className="hero-title -mt-2 md:-mt-4">
                <p className="text-primary/60 text-[10px] sm:text-xs tracking-[0.2em] uppercase font-light">
                  README Card &nbsp;·&nbsp; Live now-playing &nbsp;·&nbsp; SVG
                </p>
              </div>
            </div>

            {/* Right 4 cols - description + CTA */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-5 md:gap-6 lg:pb-4">
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="text-primary/70 text-xs sm:text-sm md:text-base leading-[1.2] max-w-md"
              >
                A serverless Spotify card for your GitHub profile — animated, edge-rendered, and
                alive. Shows what you&apos;re playing now, or what you played last.
              </motion.p>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <a
                  href="#playground"
                  className="group inline-flex items-center gap-2 bg-primary rounded-full pl-5 pr-1.5 py-1.5 hover:gap-3 transition-all duration-300"
                >
                  <span className="text-black font-medium text-sm sm:text-base">
                    Open playground
                  </span>
                  <span className="bg-black rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </span>
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="flex items-center gap-3 pt-2"
              >
                <a
                  href="https://github.com/GautamVhavle/spotify-readme-card"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] sm:text-xs tracking-widest uppercase text-primary/50 hover:text-primary transition-colors border border-primary/20 rounded-full px-3 py-1.5"
                >
                  GitHub →
                </a>
                <a
                  href="https://live-spotify-readme-card.vercel.app/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] sm:text-xs tracking-widest uppercase text-primary/50 hover:text-primary transition-colors border border-primary/20 rounded-full px-3 py-1.5"
                >
                  Live demo →
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
