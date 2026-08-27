import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, ImageDown, Palette, Gauge } from "lucide-react";
import { CardImage } from "./CardImage";
import { WordsPullUpMultiStyle } from "./WordsPullUpMultiStyle";
import { LIVE_URL, VARIANTS, type Variant } from "../lib/site";

const TRAITS = [
  {
    icon: ImageDown,
    title: "Drops in anywhere",
    body: "It is an image URL. Markdown, HTML, GitHub profiles, GitLab, Notion, anywhere an <img> works.",
  },
  {
    icon: Palette,
    title: "Themed or bespoke",
    body: "Eleven presets to start from, then six hex overrides if you want it to match your own palette exactly.",
  },
  {
    icon: Gauge,
    title: "Fast and quiet",
    body: "One edge function, no runtime dependencies, cache headers tuned so GitHub's camo proxy stays honest.",
  },
];

export function Layouts() {
  const [active, setActive] = useState<Variant>("main");
  const current = VARIANTS.find((v) => v.id === active) ?? VARIANTS[0];

  return (
    <section
      id="layouts"
      className="relative overflow-hidden bg-black px-3 py-16 sm:px-4 sm:py-20 md:px-6 md:py-28"
    >
      <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.06]" />

      <div className="relative z-10 mx-auto max-w-shell">
        <div className="max-w-3xl">
          <p className="eyebrow">Layouts</p>
          <h2 className="mt-6 text-3xl font-medium leading-[1.08] tracking-tight sm:text-4xl md:text-5xl">
            <WordsPullUpMultiStyle
              segments={[
                { text: "Three shapes.", className: "text-cream" },
                { text: "One URL each.", className: "text-gray-500" },
              ]}
            />
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-primary/50 sm:text-base">
            Every preview below is a live request to the production service. Pick a
            shape to see it.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Card layouts"
          className="mt-10 grid gap-2 sm:grid-cols-3 md:mt-12"
        >
          {VARIANTS.map((v) => {
            const isActive = v.id === active;
            return (
              <button
                key={v.id}
                role="tab"
                type="button"
                aria-selected={isActive}
                onClick={() => setActive(v.id)}
                className={`rounded-2xl border px-4 py-3 text-left transition-all duration-300 sm:px-5 sm:py-4 ${
                  isActive
                    ? "border-primary bg-primary text-black"
                    : "border-white/[0.08] bg-ink-800 text-cream/70 hover:border-white/20 hover:text-cream"
                }`}
              >
                <span
                  className={`block font-mono text-[11px] tracking-wider ${
                    isActive ? "text-black/55" : "text-primary/40"
                  }`}
                >
                  {v.path}
                </span>
                <span className="mt-1 flex items-baseline gap-2 sm:mt-1.5 sm:block">
                  <span className="text-base font-medium">{v.label}</span>
                  <span
                    className={`font-mono text-[11px] sm:mt-0.5 sm:block ${
                      isActive ? "text-black/55" : "text-gray-500"
                    }`}
                  >
                    {v.width.def} × {v.height}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="flex min-h-[260px] min-w-0 items-center justify-center rounded-shell border border-white/[0.06] bg-ink-900 p-4 sm:min-h-[420px] sm:p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 14, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="w-full"
              >
                <CardImage
                  src={`${LIVE_URL}${current.path === "/" ? "/" : current.path}`}
                  alt={`${current.label} layout, live preview`}
                  width={current.id === "portrait" ? 300 : 520}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex min-w-0 flex-col rounded-shell border border-white/[0.06] bg-ink-800 p-6 sm:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28 }}
                className="flex flex-1 flex-col"
              >
                <h3 className="text-2xl font-medium text-cream">{current.label}</h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-400">
                  {current.tagline}
                </p>

                <ul className="mt-7 flex-1 space-y-3.5">
                  {current.points.map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full bg-primary/15">
                        <Check
                          className="h-2.5 w-2.5 text-primary"
                          strokeWidth={3}
                          aria-hidden
                        />
                      </span>
                      <span className="text-[13px] leading-relaxed text-gray-300">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <a
                    href="#playground"
                    className="group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-white"
                  >
                    Customise this one
                    <ArrowRight
                      className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </a>
                  <code className="rounded-full border border-white/10 bg-black px-4 py-2.5 font-mono text-[11px] text-primary/70">
                    GET {current.path}
                  </code>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {TRAITS.map(({ icon: Icon, title, body }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.09, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl border border-white/[0.06] bg-ink-800 p-6 transition-colors hover:border-white/[0.14]"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.06] bg-black">
                <Icon className="h-4 w-4 text-primary" aria-hidden />
              </span>
              <h3 className="mt-5 font-medium text-cream">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">{body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
