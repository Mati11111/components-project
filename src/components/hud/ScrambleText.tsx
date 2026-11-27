import { useEffect, useRef, useState } from "react";
import type { ElementType } from "react";
import { cn } from "@/lib/utils";

const GLYPHS = "!<>-_\\/[]{}=+*^?#01ABCDEFXZ█▓▒░";
const FRAME_MS = 30;

export interface ScrambleTextProps {
  /** Texto final que se revela. */
  text: string;
  /**
   * Espera en ms antes de empezar a decodificar.
   * @default 0
   */
  delay?: number;
  /**
   * Si es true, decodifica solo la primera vez que entra en pantalla.
   * Si es false, repite cada vez que vuelve a verse.
   * @default true
   */
  once?: boolean;
  /**
   * Etiqueta HTML que se renderiza.
   * @default "span"
   */
  as?: "span" | "p";
  /** Clases extra para el elemento. */
  className?: string;
}

/**
 * Texto que se decodifica tipo cyberpunk: los glifos al azar se fijan de
 * izquierda a derecha hasta mostrar el texto final. Respeta
 * `prefers-reduced-motion` (queda fijo) y limpia sus timers al desmontar.
 * Los lectores de pantalla leen siempre el texto final.
 *
 * @example
 * ```tsx
 * <ScrambleText text="END OF TRANSMISSION" delay={300} />
 * ```
 */
export function ScrambleText({
  text,
  delay = 0,
  once = true,
  as = "span",
  className,
}: ScrambleTextProps) {
  const Tag = as as ElementType;
  const ref = useRef<HTMLElement>(null);
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    setDisplay(text);
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timeout = 0;
    let interval = 0;

    const stop = () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };

    const run = () => {
      stop();
      const chars = [...text];
      const duration = Math.min(1400, Math.max(500, chars.length * 45));
      const frames = Math.ceil(duration / FRAME_MS);
      // Cada carácter se revela en un frame, con algo de azar para no ser lineal.
      const revealAt = chars.map(
        (_, i) =>
          Math.floor((i / chars.length) * frames * 0.8) +
          Math.floor(Math.random() * frames * 0.2),
      );
      timeout = window.setTimeout(() => {
        let frame = 0;
        interval = window.setInterval(() => {
          setDisplay(
            chars
              .map((char, i) =>
                char.trim() === "" || frame >= revealAt[i]
                  ? char
                  : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
              )
              .join(""),
          );
          if (++frame > frames) {
            stop();
            setDisplay(text);
          }
        }, FRAME_MS);
      }, delay);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          if (once) observer.unobserve(entry.target);
          run();
        });
      },
      { threshold: 0.5 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      stop();
    };
  }, [text, delay, once]);

  return (
    <Tag ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className={cn("whitespace-pre-wrap")}>
        {display}
      </span>
    </Tag>
  );
}
