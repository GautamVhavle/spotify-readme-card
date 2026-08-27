import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { KeyRound, Radio, Code2 } from "lucide-react";

const COPY =
  "It reads your Spotify playback the moment someone opens your profile, then paints it as an SVG that GitHub is happy to render. No build step, no client script, no database. Just a URL you paste once and forget about.";

const STEPS = [
  {
    n: "01",
    icon: KeyRound,
    title: "Token refresh",
    body: "Your refresh token is traded for a short lived access token, cached while the function stays warm.",
  },
  {
    n: "02",
    icon: Radio,
    title: "Fetch track",
    body: "Currently playing first. If nothing is on, it quietly falls back to your most recent play.",
  },
  {
    n: "03",
    icon: Code2,
    title: "Render SVG",
    body: "Artwork is inlined as base64 and the markup is streamed back with cache headers tuned for camo.",
  },
];

function Word({
  word,
  progress,
  index,
  total,
}: {
  word: string;
  progress: MotionValue<number>;
  index: number;
  total: number;
}) {
  const start = index / total;
  const end = start + 1 / total;
  const opacity = useTransform(progress, [start, end], [0.15, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block mr-[0.25em]">
      {word}
    </motion.span>
  );
}

export function About() {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.45"],
  });

  const words = COPY.split(" ");

  return (
    <section id="about" className="bg-black px-3 py-20 sm:px-4 md:px-6 md:py-28">
      <div className="mx-auto max-w-shell">
        <p className="eyebrow">About</p>

        <h2 className="mt-6 max-w-4xl text-3xl font-medium leading-[1.08] tracking-tight text-cream sm:text-4xl md:text-5xl">
          A serverless card that <span className="font-serif italic font-normal">listens</span> with
          you.
        </h2>

        <p
          ref={ref}
          className="mt-8 max-w-4xl text-lg leading-relaxed text-cream sm:text-xl md:text-[26px] md:leading-[1.5]"
        >
          {reduce
            ? COPY
            : words.map((word, i) => (
                <Word
                  key={`${word}-${i}`}
                  word={word}
                  index={i}
                  total={words.length}
                  progress={scrollYProgress}
                />
              ))}
        </p>

        <div className="mt-16 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 md:mt-20">
          {STEPS.map(({ n, icon: Icon, title, body }, i) => (
            <motion.div
              key={n}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.1, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="group rounded-2xl border border-white/[0.06] bg-ink-800 p-6 transition-colors hover:border-white/[0.14] sm:p-7"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.06] bg-black">
                  <Icon className="h-4 w-4 text-primary" aria-hidden />
                </span>
                <span className="font-mono text-xs text-primary/35">{n}</span>
              </div>
              <h3 className="mt-5 font-medium text-cream">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">{body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
