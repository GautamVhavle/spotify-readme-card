import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface Props {
  text: string;
  showAsterisk?: boolean;
  className?: string;
}

export function WordsPullUp({ text, showAsterisk, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });
  const words = text.split(" ");

  return (
    <div
      ref={ref}
      className={`flex flex-wrap ${className}`}
      aria-label={text}
    >
      {words.map((word, i) => {
        const isLast = i === words.length - 1;
        return (
          <motion.span
            key={`${word}-${i}`}
            initial={{ y: 20, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{
              delay: i * 0.08,
              duration: 0.5,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="inline-block whitespace-pre"
          >
            {isLast && showAsterisk ? (
              <span className="relative inline-block">
                {word}
                <span className="absolute top-[0.65em] -right-[0.3em] text-[0.31em] leading-none font-light">
                  *
                </span>
              </span>
            ) : (
              word
            )}
            {i !== words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        );
      })}
    </div>
  );
}
