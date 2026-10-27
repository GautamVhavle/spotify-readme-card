import { useEffect, useRef, useState } from "react";
import { AlertCircle } from "lucide-react";

interface Props {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  transparent?: boolean;
}

/**
 * The card is a live SVG from the API, so it can be slow or briefly unavailable.
 * Reserve the frame while it loads, and show a message if it never arrives.
 */
export function CardImage({
  src,
  alt,
  width,
  height,
  className = "",
  transparent = false,
}: Props) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [seen, setSeen] = useState(src);

  // Reset during render. An effect would run after a cached image's load event
  // and leave the preview stuck invisible.
  if (src !== seen) {
    setSeen(src);
    setState("loading");
  }

  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth > 0) setState("ready");
  }, [src]);

  const frame = width && height ? { aspectRatio: `${width} / ${height}` } : undefined;

  return (
    <div
      className={`relative w-full ${className}`}
      style={{ maxWidth: width ? `min(100%, ${width}px)` : "100%" }}
    >
      {state === "loading" && (
        <div
          className="w-full animate-pulse rounded-xl bg-white/[0.04]"
          style={frame ?? { aspectRatio: "3 / 1" }}
          aria-hidden
        />
      )}

      {state === "error" && (
        <div
          className="flex flex-col items-center justify-center gap-2 px-4 py-8 text-center"
          style={frame}
        >
          <AlertCircle className="h-5 w-5 text-primary/40" aria-hidden />
          <p className="text-xs text-gray-500">
            Preview unavailable. The live service may be waking up.
          </p>
        </div>
      )}

      {state !== "error" && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading="lazy"
          decoding="async"
          onLoad={() => setState("ready")}
          onError={() => setState("error")}
          className={`w-full rounded-xl shadow-2xl transition-opacity duration-300 ${
            state === "ready"
              ? "relative z-10 h-auto opacity-100"
              : "absolute inset-0 h-full opacity-0"
          } ${transparent ? "checkerboard" : ""}`}
        />
      )}
    </div>
  );
}
