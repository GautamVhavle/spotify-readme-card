import { ArrowUpRight, ArrowUp, Github } from "lucide-react";
import { AUTHOR_URL, DEPLOY_URL, LIVE_URL, NAV_SECTIONS, REPO_URL } from "../lib/site";

const RESOURCES = [
  { label: "Live demo", href: LIVE_URL },
  { label: "Raw JSON", href: `${LIVE_URL}/json` },
  { label: "Deploy to Vercel", href: DEPLOY_URL },
  { label: "Report an issue", href: `${REPO_URL}/issues` },
];

export function Footer() {
  return (
    <footer className="bg-black px-3 pb-3 sm:px-4 sm:pb-4 md:px-6 md:pb-6">
      <div className="mx-auto max-w-shell rounded-[1.5rem] border border-white/[0.06] bg-ink-800 px-6 py-12 sm:px-8 md:rounded-shell md:px-12 md:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <h2 className="text-3xl font-medium leading-tight tracking-tight text-cream sm:text-4xl">
              Put your music
              <br />
              <span className="font-serif italic font-normal">in your README.</span>
            </h2>
            <div className="mt-7 flex flex-wrap gap-2.5">
              <a
                href={REPO_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-white"
              >
                <Github className="h-4 w-4" aria-hidden /> Star on GitHub
              </a>
              <a
                href="#playground"
                className="inline-flex items-center gap-2 rounded-full border border-white/12 px-5 py-2.5 text-sm text-cream/80 transition-colors hover:border-white/25 hover:text-cream"
              >
                Open playground
              </a>
            </div>
          </div>

          <nav aria-label="Sections">
            <p className="eyebrow">Sections</p>
            <ul className="mt-5 space-y-3">
              {NAV_SECTIONS.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="text-sm text-gray-400 transition-colors hover:text-cream"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Resources">
            <p className="eyebrow">Resources</p>
            <ul className="mt-5 space-y-3">
              {RESOURCES.map((r) => (
                <li key={r.label}>
                  <a
                    href={r.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-cream"
                  >
                    {r.label}
                    <ArrowUpRight
                      className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100"
                      aria-hidden
                    />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-6 text-[11px] text-gray-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Spotify README Card · MIT License</p>
          <div className="flex items-center gap-5">
            <p className="flex items-center gap-1.5">
              Built with <span className="text-spotify" aria-hidden="true">❤️</span> by{" "}
              <a
                href={AUTHOR_URL}
                target="_blank"
                rel="noreferrer"
                className="text-primary/80 underline decoration-primary/30 underline-offset-4 transition-colors hover:text-primary hover:decoration-primary"
              >
                Gautam Vhavle
              </a>
            </p>
            <a
              href="#top"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 transition-colors hover:border-white/25 hover:text-cream"
            >
              <ArrowUp className="h-3 w-3" aria-hidden /> Top
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
