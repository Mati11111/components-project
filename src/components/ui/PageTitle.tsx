import { cn } from "@/lib/utils";
import { AnimatedText, type TextEffect } from "@/components/ui/AnimatedText";

export interface PageTitleProps {
  /** Texto principal del título. */
  text: string;
  /** Decoración opcional mostrada junto al texto (ej: "</>"). */
  decoration?: string;
  /** Subtítulo opcional debajo. */
  subtitle?: string;
  /** Efecto de aparición del título (opt-in; ver AnimatedText). */
  effect?: TextEffect;
  /** Alineación del contenido. */
  align?: "left" | "center";
  /** Clase extra para el contenedor. */
  className?: string;
}

/**
 * Título de página grande, al estilo del Header del portfolio pero genérico
 * y sin animación de intro. Escala con el ancho del contenedor (container
 * query units) y acepta una decoración y un efecto de texto opcionales.
 */
export function PageTitle({
  text,
  decoration,
  subtitle,
  effect = "none",
  align = "left",
  className,
}: PageTitleProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 [container-type:inline-size]",
        align === "center" ? "items-center text-center" : "items-start",
        className,
      )}
    >
      <h1
        className="flex items-baseline gap-[0.25em] whitespace-nowrap font-heading font-medium uppercase leading-none tracking-tight text-heading"
        style={{ fontWeight: 500, fontSize: "clamp(2.5rem, 12cqw, 9rem)" }}
      >
        <AnimatedText text={text} effect={effect} />
        {decoration && (
          <span className="text-accent" aria-hidden>
            {decoration}
          </span>
        )}
      </h1>
      {subtitle && (
        <p className="whitespace-nowrap text-sm text-text">{subtitle}</p>
      )}
    </div>
  );
}
