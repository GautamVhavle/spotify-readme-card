import { motion, useInView } from "framer-motion";
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
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });

  // Flatten segments into words preserving per-word className
  const words: { word: string; className: string }[] = [];
  for (const seg of segments) {
    const parts = seg.text.split(" ");
    for (const w of parts) {
      if (w.length === 0) continue;
      words.push({ word: w, className: seg.className ?? "" });
    }
  }

  return (
    <div
      ref={ref}
      className={`inline-flex flex-wrap justify-center ${className}`}
    >
      {words.map((w, i) => (
        <motion.span
          key={`${w.word}-${i}`}
          initial={{ y: 20, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
          transition={{
            delay: i * 0.08,
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
          }}
          className={`inline-block whitespace-pre ${w.className}`}
        >
          {w.word}
          {i !== words.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </div>
  );
}
