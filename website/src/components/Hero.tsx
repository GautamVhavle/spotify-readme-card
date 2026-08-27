import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, MousePointerClick } from "lucide-react";
import { WordsPullUp } from "./WordsPullUp";

const STATS = [
  { value: "3", label: "layouts" },
  { value: "11", label: "themes" },
  { value: "0", label: "runtime deps" },
];

const TAGS = ["Now playing", "Pure SVG", "Edge rendered", "Zero deps"];

export function Hero() {
  const reduce = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);

  // React renders `muted` as a property only, so autoplay is blocked without setting the attribute.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.setAttribute("muted", "");

    const start = () => {
      video.play().catch(() => {});
    };

    const startWhenVisible = () => {
      if (document.visibilityState === "visible") start();
    };

    start();
    video.addEventListener("loadeddata", start);
    document.addEventListener("visibilitychange", startWhenVisible);
    document.addEventListener("touchstart", start, { once: true });
    document.addEventListener("click", start, { once: true });

    return () => {
      video.removeEventListener("loadeddata", start);
      document.removeEventListener("visibilitychange", startWhenVisible);
      document.removeEventListener("touchstart", start);
      document.removeEventListener("click", start);
    };
  }, []);

  const rise = (delay: number) => ({
    initial: reduce ? false : { y: 24, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { delay, duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <section
      id="top"
      className="flex min-h-[100svh] flex-col bg-black p-3 sm:p-4 md:p-6"
    >
      <div className="relative flex min-h-[640px] w-full flex-1 flex-col overflow-hidden rounded-[1.5rem] md:rounded-shell">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden
          className="absolute inset-0 h-full w-full bg-black object-cover"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4"
            type="video/mp4"
          />
        </video>

        <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.3] mix-blend-overlay" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/70 via-black/25 to-black/90" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/55 via-transparent to-transparent" />

        <div className="relative z-10 mt-auto p-4 sm:p-6 md:p-8 lg:p-10">
          <motion.div
            {...rise(0.15)}
            className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-black/40 px-3.5 py-1.5 backdrop-blur"
          >
            <span className="relative flex h-2 w-2" aria-hidden>
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-spotify opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-spotify" />
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/80 sm:text-[11px]">
              Live from the Spotify Web API
            </span>
          </motion.div>

          <div className="flex flex-col gap-8 lg:grid lg:grid-cols-12 lg:items-end lg:gap-10">
            <div className="w-full lg:col-span-7">
              <h1 className="text-[13.5vw] font-medium leading-[0.86] tracking-[-0.045em] text-cream sm:text-[11vw] lg:text-[7vw] xl:text-[6.4vw]">
                <WordsPullUp text="Spotify Readme Card" />
              </h1>
              <motion.ul {...rise(0.5)} className="mt-5 flex flex-wrap gap-2">
                {TAGS.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-white/15 bg-black/30 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-primary/70 backdrop-blur sm:text-[11px]"
                  >
                    {tag}
                  </li>
                ))}
              </motion.ul>
            </div>

            <div className="flex w-full flex-col gap-5 lg:col-span-5 lg:pb-2">
              <motion.p
                {...rise(0.45)}
                className="max-w-md text-sm leading-relaxed text-primary/80 sm:text-base"
              >
                A serverless card for your GitHub profile. Animated, rendered at the
                edge, and genuinely alive. It shows what you are playing right now, or
                what you played last.
              </motion.p>

              <motion.div {...rise(0.6)} className="flex flex-wrap items-center gap-3">
                <a
                  href="#playground"
                  className="group inline-flex items-center gap-2 rounded-full bg-primary py-1.5 pl-5 pr-1.5 transition-colors duration-300 hover:bg-white"
                >
                  <span className="text-sm font-medium text-black sm:text-base">
                    Build your card
                  </span>
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-black transition-transform duration-300 group-hover:scale-105 sm:h-10 sm:w-10">
                    <ArrowRight
                      className="h-4 w-4 text-primary sm:h-5 sm:w-5"
                      aria-hidden
                    />
                  </span>
                </a>
                <a
                  href="#layouts"
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/25 px-5 py-3 text-xs uppercase tracking-widest text-white/75 backdrop-blur transition-colors hover:border-white/30 hover:bg-white/10 hover:text-white"
                >
                  See layouts
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                </a>
              </motion.div>
            </div>
          </div>

          <motion.div
            {...rise(0.9)}
            className="mt-8 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-t border-white/10 pt-6"
          >
            <dl className="flex flex-wrap items-center gap-x-8 gap-y-3">
              {STATS.map((s) => (
                <div key={s.label} className="flex items-baseline gap-1.5">
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="text-xl font-medium text-cream sm:text-2xl">
                    {s.value}
                  </dd>
                  <span className="text-[10px] uppercase tracking-[0.16em] text-white/45">
                    {s.label}
                  </span>
                </div>
              ))}
            </dl>
            <p className="hidden items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/35 sm:flex">
              <MousePointerClick className="h-3.5 w-3.5" aria-hidden />
              Scroll to explore
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
