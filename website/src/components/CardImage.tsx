import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";

interface Props {
  src: string;
  alt: string;
  width?: number;
  className?: string;
  transparent?: boolean;
}

/**
 * The card is a live SVG from the API, so it can be slow or briefly unavailable.
 * Render a skeleton while it loads and a readable message if it never arrives.
 */
export function CardImage({ src, alt, width, className = "", transparent = false }: Props) {
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => setState("loading"), [src]);

  return (
    <div className={`relative w-full flex items-center justify-center ${className}`}>
      {state === "loading" && (
        <div
          className="absolute inset-0 m-auto h-full w-full animate-pulse rounded-xl bg-white/[0.04]"
          aria-hidden
        />
      )}

      {state === "error" && (
        <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
          <AlertCircle className="h-5 w-5 text-primary/40" aria-hidden />
          <p className="text-xs text-gray-500">
            Preview unavailable. The live service may be waking up.
          </p>
        </div>
      )}

      <img
        src={src}
        alt={alt}
        width={width}
        loading="lazy"
        decoding="async"
        onLoad={() => setState("ready")}
        onError={() => setState("error")}
        className={`relative z-10 h-auto w-full rounded-xl shadow-2xl transition-opacity duration-300 ${
          state === "ready" ? "opacity-100" : "opacity-0"
        } ${state === "error" ? "hidden" : ""} ${transparent ? "checkerboard" : ""}`}
        style={{ maxWidth: width ? `min(100%, ${width}px)` : "100%" }}
      />
    </div>
  );
}
