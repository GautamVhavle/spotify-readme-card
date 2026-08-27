import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { WordsPullUpMultiStyle } from "./WordsPullUpMultiStyle";

function AnimatedLetter({
  char,
  progress,
  total,
  index,
}: {
  char: string;
  progress: ReturnType<typeof useTransform<number, number>>;
  total: number;
  index: number;
}) {
  const charProgress = index / total;
  const start = Math.max(0, charProgress - 0.1);
  const end = Math.min(1, charProgress + 0.05);
  const opacity = useTransform(progress, [start, end], [0.2, 1]);
  return (
    <motion.span style={{ opacity }} className="inline">
      {char === " " ? "\u00A0" : char}
    </motion.span>
  );
}

export function About() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.2"],
  });

  const bodyText =
    "Over the last seven years, I have worked with Parallax, a Berlin-based production house that crafts cinema, series, and Noir Studio in Paris. Together, we have created work that has earned international acclaim at several major festivals.";

  // Adapted body for Spotify card context but keeping cinematic tone
  const spotifyBody =
    "A tiny serverless function asks Spotify what you are listening to and answers with an SVG image. Because the response is an image, it works anywhere a URL does: GitHub READMEs, gists, blogs, and docs. Animated with CSS keyframes, inlined artwork to survive GitHub's camo proxy, and zero runtime dependencies.";

  const chars = spotifyBody.split("");

  return (
    <section id="about" className="bg-black px-4 md:px-6 py-8 md:py-12">
      <div className="bg-[#101010] rounded-2xl md:rounded-[2rem] px-6 sm:px-10 md:px-16 lg:px-20 py-16 sm:py-20 md:py-24 lg:py-28 flex flex-col items-center text-center max-w-6xl mx-auto">
        {/* Label */}
        <p className="text-primary text-[10px] sm:text-xs tracking-[0.2em] uppercase mb-6 md:mb-8">
          Now playing · Live
        </p>

        {/* Heading with multi-style */}
        <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl max-w-3xl mx-auto leading-[0.95] sm:leading-[0.9] mb-8 md:mb-10">
          <WordsPullUpMultiStyle
            segments={[
              { text: "A serverless card", className: "font-normal text-[#E1E0CC]" },
              { text: "that listens", className: "italic font-serif text-[#E1E0CC]" },
              { text: "with you. Crafted for READMEs, rendered at the edge.", className: "font-normal text-[#E1E0CC]" },
            ]}
          />
        </div>

        {/* Scroll-linked paragraph */}
        <div
          ref={ref}
          className="max-w-2xl mx-auto text-[#DEDBC8] text-sm sm:text-base leading-relaxed text-center"
        >
          {chars.map((char, i) => (
            <AnimatedLetter
              key={`${char}-${i}`}
              char={char}
              progress={scrollYProgress}
              total={chars.length}
              index={i}
            />
          ))}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-6 sm:gap-10 md:gap-16 mt-12 md:mt-16 pt-8 md:pt-10 border-t border-white/10 w-full max-w-2xl">
          {[
            { value: "3", label: "layouts" },
            { value: "11", label: "themes" },
            { value: "0", label: "runtime deps" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl sm:text-3xl md:text-4xl font-light text-[#E1E0CC] tracking-tight">
                {stat.value}
              </p>
              <p className="text-[10px] sm:text-xs tracking-[0.15em] uppercase text-primary/60 mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* How it works mini */}
        <div className="mt-10 md:mt-14 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full max-w-3xl text-left">
          {[
            {
              step: "01",
              title: "Token refresh",
              desc: "Refresh token → access token, cached while warm.",
            },
            {
              step: "02",
              title: "Fetch track",
              desc: "Currently playing, fallback to recently played.",
            },
            {
              step: "03",
              title: "Render SVG",
              desc: "Artwork inlined as base64, CSS animation inside.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="bg-black/50 rounded-xl p-4 border border-white/[0.06]"
            >
              <p className="text-[10px] tracking-[0.15em] uppercase text-primary/50 mb-2">
                {item.step}
              </p>
              <p className="text-sm font-medium text-[#E1E0CC] mb-1">{item.title}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
