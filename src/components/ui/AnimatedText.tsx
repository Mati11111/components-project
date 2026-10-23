import { useEffect, useRef, useState } from "react";
import type { ElementType } from "react";
import { cn } from "@/lib/utils";

export type TextEffect = "none" | "reveal" | "scramble";

export interface AnimatedTextProps {
  /** Texto a animar. */
  text: string;
  /**
   * Efecto de aparición. Por defecto "none" (sin animación): las animaciones
   * son siempre opt-in.
   * - "reveal": aparece de izquierda a derecha con desvanecido.
   * - "scramble": letras al azar que se resuelven en las reales.
   */
  effect?: TextEffect;
  /** Duración total de la animación en ms. */
  duration?: number;
  /** Retardo antes de iniciar en ms. */
  delay?: number;
  /** Caracteres usados por el efecto scramble. */
  scrambleChars?: string;
  /** Etiqueta HTML a renderizar (default "span"). */
  as?: ElementType;
  /** Clase extra. */
  className?: string;
}

const DEFAULT_SCRAMBLE_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!<>-_\\/[]{}=+*^?#";

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function AnimatedText({
  text,
  effect = "none",
  duration = 800,
  delay = 0,
  scrambleChars = DEFAULT_SCRAMBLE_CHARS,
  as,
  className,
}: AnimatedTextProps) {
  const Tag: ElementType = as ?? "span";
  const reduce = prefersReducedMotion();
  const animate = effect !== "none" && !reduce;

  // ----- scramble state -----
  const [display, setDisplay] = useState(() =>
    effect === "scramble" && !reduce ? "" : text,
  );
  const frame = useRef<number | null>(null);
  const startAt = useRef<number>(0);

  useEffect(() => {
    if (effect !== "scramble" || reduce) {
      setDisplay(text);
      return;
    }

    let cancelled = false;
    const chars = scrambleChars;
    startAt.current = performance.now() + delay;
    // cada letra se "resuelve" en un punto distinto del rango total
    const resolveAt = text
      .split("")
      .map((_, i) => (text.length <= 1 ? 1 : i / (text.length - 1)));

    const tick = (now: number) => {
      if (cancelled) return;
      const elapsed = now - startAt.current;
      if (elapsed < 0) {
        frame.current = requestAnimationFrame(tick);
        return;
      }
      const progress = Math.min(elapsed / duration, 1);

      let out = "";
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (ch === " ") {
          out += " ";
          continue;
        }
        // la letra queda fija cuando el progreso supera su punto de resolución
        if (progress >= resolveAt[i] * 0.85 + 0.15) {
          out += ch;
        } else {
          out += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      setDisplay(out);

      if (progress < 1) {
        frame.current = requestAnimationFrame(tick);
      } else {
        setDisplay(text);
      }
    };

    frame.current = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      if (frame.current != null) cancelAnimationFrame(frame.current);
    };
  }, [effect, text, duration, delay, scrambleChars, reduce]);

  // ----- reveal (CSS) -----
  if (effect === "reveal" && animate) {
    return (
      <Tag
        className={cn("at-reveal", className)}
        style={
          {
            "--at-duration": `${duration}ms`,
            "--at-delay": `${delay}ms`,
          } as React.CSSProperties
        }
      >
        {text}
      </Tag>
    );
  }

  // ----- scramble (JS) -----
  if (effect === "scramble" && animate) {
    return (
      <Tag className={className} aria-label={text}>
        <span aria-hidden>{display}</span>
      </Tag>
    );
  }

  // ----- none / reduced motion -----
  return <Tag className={className}>{text}</Tag>;
}
