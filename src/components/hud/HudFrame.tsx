import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ScrambleText } from "./ScrambleText";

const CORNER = "14px";
const LINE = "2px";
const ACCENT = "var(--hud-accent,#ff5f1f)";
const MARK = "var(--hud-mark,currentColor)";

/** Cuatro esquinas de registro; la superior izquierda va en naranja. */
const cornersStyle: CSSProperties = {
  background: [
    `linear-gradient(${ACCENT},${ACCENT}) top left / ${CORNER} ${LINE}`,
    `linear-gradient(${ACCENT},${ACCENT}) top left / ${LINE} ${CORNER}`,
    `linear-gradient(${MARK},${MARK}) top right / ${CORNER} ${LINE}`,
    `linear-gradient(${MARK},${MARK}) top right / ${LINE} ${CORNER}`,
    `linear-gradient(${MARK},${MARK}) bottom left / ${CORNER} ${LINE}`,
    `linear-gradient(${MARK},${MARK}) bottom left / ${LINE} ${CORNER}`,
    `linear-gradient(${MARK},${MARK}) bottom right / ${CORNER} ${LINE}`,
    `linear-gradient(${MARK},${MARK}) bottom right / ${LINE} ${CORNER}`,
  ].join(","),
  backgroundRepeat: "no-repeat",
};

const miniBarcodeStyle: CSSProperties = {
  background:
    "repeating-linear-gradient(90deg, currentColor 0 2px, transparent 2px 3px, currentColor 3px 5px, transparent 5px 7px)",
};

const scanlinesStyle: CSSProperties = {
  backgroundImage:
    "repeating-linear-gradient(to bottom, rgb(128 128 128 / 0.06) 0 1px, transparent 1px 3px)",
};

export interface HudFrameProps {
  /** Título de la barra (se muestra en mayúsculas con efecto decodificar). */
  title: string;
  /**
   * Número de la ventana en la etiqueta externa `WIN/0N · SSH · LIVE`.
   * @default 1
   */
  index?: number;
  /** Contenido del cuerpo de la ventana. */
  children?: ReactNode;
  /** Clases extra para el contenedor. */
  className?: string;
}

/**
 * Ventana tipo terminal HUD: esquinas de registro, etiqueta externa
 * `WIN/0N · SSH · LIVE`, barra de título con cuadrito naranja y mini código
 * de barras, línea naranja bajo la barra, borde de 1px y cuerpo con líneas
 * de monitor muy suaves. Colores con `--hud-accent` y `--hud-mark`.
 *
 * @example
 * ```tsx
 * <HudFrame title="experiencia" index={2}>
 *   <p>Contenido de la ventana</p>
 * </HudFrame>
 * ```
 */
export function HudFrame({ title, index = 1, children, className }: HudFrameProps) {
  return (
    <div className={cn("relative mt-8", className)}>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-6 left-0 whitespace-nowrap text-[0.6rem] font-medium tracking-[0.3em] text-[var(--hud-mark,currentColor)] opacity-70"
      >
        {`WIN/0${index}\u00a0\u00a0·\u00a0\u00a0SSH\u00a0\u00a0·\u00a0\u00a0LIVE`}
      </span>
      <section
        aria-label={title}
        className="relative flex flex-col border border-[color-mix(in_srgb,currentColor_40%,transparent)]"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-[7px] z-10"
          style={cornersStyle}
        />
        <header className="flex min-h-10 items-center border-b border-b-[var(--hud-accent,#ff5f1f)] px-4 text-[0.7rem] font-medium uppercase tracking-[0.2em]">
          <span className="mr-3 inline-block size-2 flex-none bg-[var(--hud-accent,#ff5f1f)]" />
          <ScrambleText text={title} className="block min-w-0 flex-1 truncate" />
          <span
            aria-hidden="true"
            className="ml-3 inline-block h-2 w-10 flex-none opacity-60"
            style={miniBarcodeStyle}
          />
        </header>
        <div className="p-4" style={scanlinesStyle}>
          {children}
        </div>
      </section>
    </div>
  );
}
