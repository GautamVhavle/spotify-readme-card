import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";

interface Props {
  text: string;
  className?: string;
  delayStep?: number;
}

export function WordsPullUp({ text, className = "", delayStep = 0.08 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });
  const reduce = useReducedMotion();
  const words = text.split(" ");

  return (
    <span ref={ref} className={`block ${className}`} aria-label={text}>
      {words.map((word, i) => {
        const isLast = i === words.length - 1;
        return (
          <motion.span
            key={`${word}-${i}`}
            aria-hidden
            initial={reduce ? false : { y: "0.5em", opacity: 0 }}
            animate={
              isInView || reduce ? { y: 0, opacity: 1 } : { y: "0.5em", opacity: 0 }
            }
            transition={{
              delay: i * delayStep,
              duration: 0.55,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={`inline-block ${isLast ? "" : "mr-[0.22em]"}`}
          >
            {word}
          </motion.span>
        );
      })}
    </span>
  );
}
