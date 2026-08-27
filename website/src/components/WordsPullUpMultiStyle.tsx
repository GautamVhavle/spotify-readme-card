import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";

export interface Segment {
  text: string;
  className?: string;
}

interface Props {
  segments: Segment[];
  className?: string;
}

export function WordsPullUpMultiStyle({ segments, className = "" }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });
  const reduce = useReducedMotion();

  const words = segments.flatMap((seg) =>
    seg.text
      .split(" ")
      .filter(Boolean)
      .map((word) => ({ word, className: seg.className ?? "" })),
  );

  const label = segments.map((s) => s.text).join(" ");

  return (
    <span ref={ref} className={`block ${className}`} aria-label={label}>
      {words.map((w, i) => (
        <motion.span
          key={`${w.word}-${i}`}
          aria-hidden
          initial={reduce ? false : { y: "0.5em", opacity: 0 }}
          animate={
            isInView || reduce ? { y: 0, opacity: 1 } : { y: "0.5em", opacity: 0 }
          }
          transition={{ delay: i * 0.06, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className={`inline-block ${i === words.length - 1 ? "" : "mr-[0.22em]"} ${w.className}`}
        >
          {w.word}
        </motion.span>
      ))}
    </span>
  );
}
