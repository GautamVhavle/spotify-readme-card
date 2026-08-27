import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Menu, X } from "lucide-react";
import { NAV_SECTIONS, REPO_URL } from "../lib/site";
import { SpotifyMark } from "./SpotifyMark";

export function Nav() {
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const elements = NAV_SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.2, 0.6, 1] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex flex-col items-center">
      <nav className="pointer-events-auto flex max-w-[calc(100vw-1.5rem)] items-center gap-2 rounded-b-2xl bg-black px-3 py-2 shadow-2xl shadow-black/60 sm:gap-4 sm:px-5 md:rounded-b-3xl md:px-7 md:py-3">
        <a
          href="#top"
          className="flex flex-shrink-0 items-center gap-2 font-medium text-cream transition-opacity hover:opacity-80"
        >
          <SpotifyMark className="h-[18px] w-[18px] text-spotify md:h-5 md:w-5" />
          <span className="hidden whitespace-nowrap text-sm lg:inline">
            Spotify Readme Card
          </span>
          <span className="whitespace-nowrap text-xs sm:text-sm lg:hidden">
            Readme Card
          </span>
        </a>

        <span className="hidden h-5 w-px bg-white/10 md:block" aria-hidden />

        <div className="hidden items-center gap-1 md:flex">
          {NAV_SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              aria-current={active === s.id ? "true" : undefined}
              className={`relative rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors md:text-sm ${
                active === s.id ? "text-cream" : "text-cream/60 hover:text-cream"
              }`}
            >
              {active === s.id && (
                <motion.span
                  layoutId="nav-active-pill"
                  className="absolute inset-0 rounded-full bg-white/[0.08]"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative whitespace-nowrap">{s.label}</span>
            </a>
          ))}
        </div>

        <a
          href={REPO_URL}
          target="_blank"
          rel="noreferrer"
          aria-label="Star Spotify Readme Card on GitHub"
          className="ml-1 hidden items-center gap-2 rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-black transition-colors hover:bg-white md:inline-flex"
        >
          <Github className="h-3.5 w-3.5" aria-hidden />
          Star
        </a>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="ml-1 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-cream/70 transition-colors hover:text-cream md:hidden"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto w-full px-3 pt-2 sm:px-4 md:hidden"
          >
            <div className="mx-auto grid max-w-shell gap-1 rounded-3xl border border-white/10 bg-black/95 p-2 backdrop-blur-xl">
              {NAV_SECTIONS.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  onClick={() => setOpen(false)}
                  className={`rounded-2xl px-4 py-3 text-sm transition-colors ${
                    active === s.id
                      ? "bg-primary/10 text-cream"
                      : "text-cream/60 hover:bg-white/5 hover:text-cream"
                  }`}
                >
                  {s.label}
                </a>
              ))}
              <a
                href={REPO_URL}
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
                className="mt-1 flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-medium text-black"
              >
                <Github className="h-4 w-4" aria-hidden />
                Star on GitHub
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
