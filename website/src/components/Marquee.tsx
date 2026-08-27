import { THEMES } from "../lib/site";

const KEYWORDS = [
  "Edge rendered",
  "Pure SVG",
  "Animated equalizer",
  "Scrolling marquee",
  "Custom hex overrides",
  "Zero runtime deps",
  "Camo friendly",
  "Now playing",
  "Recently played",
];

function Row({
  children,
  duration,
  reverse = false,
}: {
  children: React.ReactNode;
  duration: string;
  reverse?: boolean;
}) {
  return (
    <div className="edge-fade overflow-hidden">
      <div
        className={`flex w-max animate-marquee ${reverse ? "[animation-direction:reverse]" : ""}`}
        style={{ "--marquee-duration": duration } as React.CSSProperties}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0" aria-hidden={copy === 1}>
            {children}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Marquee() {
  return (
    <div className="border-y border-white/[0.06] bg-black py-8 md:py-10">
      <Row duration="52s">
        {THEMES.map((t) => (
          <span
            key={t.value}
            className="mx-3 flex items-center gap-2.5 whitespace-nowrap rounded-full border border-white/[0.07] bg-ink-800 px-5 py-2.5 text-sm text-cream/85"
          >
            <span
              className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
              style={
                t.dot === "transparent"
                  ? {
                      backgroundImage:
                        "repeating-conic-gradient(#3a3a3a 0% 25%, #141414 0% 50%)",
                      backgroundSize: "6px 6px",
                    }
                  : { background: t.dot }
              }
            />
            {t.label}
          </span>
        ))}
      </Row>

      <div className="h-3" />

      <Row duration="64s" reverse>
        {KEYWORDS.map((k) => (
          <span
            key={k}
            className="mx-3 flex items-center gap-3 whitespace-nowrap text-sm uppercase tracking-[0.18em] text-cream/25"
          >
            {k}
            <span className="text-primary/30">/</span>
          </span>
        ))}
      </Row>
    </div>
  );
}
