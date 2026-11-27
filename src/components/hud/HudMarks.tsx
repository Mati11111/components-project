import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const BARCODE_PATTERN =
  "repeating-linear-gradient(90deg, currentColor 0 2px, transparent 2px 3px, currentColor 3px 4px, transparent 4px 7px, currentColor 7px 10px, transparent 10px 12px)";

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export interface BarcodeProps {
  /**
   * Anima el código de barras con un efecto de escaneo.
   * @default true
   */
  animated?: boolean;
  /** Clases extra (por ejemplo para cambiar el ancho). */
  className?: string;
}

/**
 * Código de barras decorativo, opcionalmente animado como un escaneo.
 * Usa el color de texto actual. Respeta `prefers-reduced-motion`.
 *
 * @example
 * ```tsx
 * <Barcode animated />
 * ```
 */
export function Barcode({ animated = true, className }: BarcodeProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!animated || !el || prefersReducedMotion()) return;
    if (typeof el.animate !== "function") return;
    const animation = el.animate(
      [{ backgroundPositionX: "0px" }, { backgroundPositionX: "12px" }],
      { duration: 1200, easing: "steps(6)", iterations: Infinity },
    );
    return () => animation.cancel();
  }, [animated]);

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={cn("inline-block h-3 w-[4.5rem]", className)}
      style={{ background: BARCODE_PATTERN }}
    />
  );
}

export interface HudLabelProps {
  /** Texto de la etiqueta. */
  children: ReactNode;
  /**
   * Muestra un cuadrito naranja antes del texto.
   * @default false
   */
  marker?: boolean;
  /** Clases extra. */
  className?: string;
}

/**
 * Etiqueta técnica: chica, en mayúsculas y muy espaciada.
 *
 * @example
 * ```tsx
 * <HudLabel marker>END OF TRANSMISSION</HudLabel>
 * ```
 */
export function HudLabel({ children, marker = false, className }: HudLabelProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex items-center gap-3 text-[0.625rem] font-medium uppercase leading-[1.4] tracking-[0.3em]",
        className,
      )}
    >
      {marker && (
        <span className="inline-block size-2 bg-[var(--hud-accent,#ff5f1f)]" />
      )}
      {children}
    </span>
  );
}

export interface HudBlockProps {
  /** Texto dentro del bloque. */
  children: ReactNode;
  /** Clases extra. */
  className?: string;
}

/**
 * Bloque invertido tipo "COLLECTOR'S EDITION". Colores configurables con
 * `--hud-invert-bg` y `--hud-invert-fg`.
 *
 * @example
 * ```tsx
 * <HudBlock>FULLSTACK DEVELOPER</HudBlock>
 * ```
 */
export function HudBlock({ children, className }: HudBlockProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-block bg-[var(--hud-invert-bg,#181818)] px-3 py-1 font-medium uppercase tracking-[0.2em] text-[var(--hud-invert-fg,#dddddd)]",
        className,
      )}
    >
      {children}
    </span>
  );
}

export interface CornerMarksProps {
  /** Clases extra del contenedor (se posiciona con `absolute inset-0`). */
  className?: string;
}

/**
 * Cruces "+" en las cuatro esquinas del contenedor padre (que debe ser
 * `relative`). La esquina superior izquierda va en naranja.
 *
 * @example
 * ```tsx
 * <div className="relative h-40">
 *   <CornerMarks />
 * </div>
 * ```
 */
export function CornerMarks({ className }: CornerMarksProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 text-[var(--hud-mark,currentColor)]",
        className,
      )}
    >
      <span className="absolute top-3 left-4 font-light text-[var(--hud-accent,#ff5f1f)]">
        +
      </span>
      <span className="absolute top-3 right-4 font-light">+</span>
      <span className="absolute bottom-3 left-4 font-light">+</span>
      <span className="absolute bottom-3 right-4 font-light">+</span>
    </div>
  );
}

export interface CompilingIndicatorProps {
  /**
   * Cantidad de celdas de la barra.
   * @default 8
   */
  total?: number;
  /**
   * Intervalo en ms entre cada avance de la barra.
   * @default 220
   */
  intervalMs?: number;
  /** Clases extra. */
  className?: string;
}

/**
 * Indicador "COMPILING... ██████░░ / HANDSHAKE [..]" que se llena en bucle
 * y muestra `[OK]` en naranja al completarse. Con `prefers-reduced-motion`
 * queda completo y fijo.
 *
 * @example
 * ```tsx
 * <CompilingIndicator total={10} />
 * ```
 */
export function CompilingIndicator({
  total = 8,
  intervalMs = 220,
  className,
}: CompilingIndicatorProps) {
  // Con movimiento reducido arranca completo y no avanza.
  const [step, setStep] = useState(() => (prefersReducedMotion() ? total : 0));

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const id = window.setInterval(() => {
      // 4 ticks de pausa al completar.
      setStep((s) => (s + 1) % (total + 4));
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [total, intervalMs]);

  const filled = Math.min(step, total);
  const done = filled === total;

  return (
    <p
      aria-hidden="true"
      className={cn(
        "text-[0.625rem] font-medium uppercase leading-[1.4] tracking-[0.3em] opacity-70",
        className,
      )}
    >
      COMPILING... {"█".repeat(filled)}
      {"░".repeat(total - filled)}
      <br />
      HANDSHAKE{" "}
      <span className={cn(done && "text-[var(--hud-accent,#ff5f1f)]")}>
        {done ? "[OK]" : "[..]"}
      </span>
    </p>
  );
}
