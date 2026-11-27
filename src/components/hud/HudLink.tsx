import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface HudLinkProps {
  /** Índice mostrado al inicio (ej. "01"). */
  index?: string;
  /** Slot para un ícono (se marca como decorativo). */
  icon?: ReactNode;
  /** Texto principal del enlace. */
  label: string;
  /**
   * Acción mostrada al final (símbolo o texto corto, ej. "COPIAR").
   * @default "↗"
   */
  action?: string;
  /** Si se define, se renderiza como `<a>`; si no, como `<button>`. */
  href?: string;
  /**
   * Abre el enlace en una pestaña nueva (solo con `href`).
   * @default true
   */
  external?: boolean;
  /** Acción al hacer clic. */
  onClick?: () => void;
  /**
   * Marca el estado "hecho" (borde y acción en naranja), útil tras copiar.
   * @default false
   */
  done?: boolean;
  /** Texto accesible; por defecto se usa `label`. */
  ariaLabel?: string;
  /** Clases extra. */
  className?: string;
}

/**
 * Botón o enlace de contacto estilo footer HUD: índice, ícono, etiqueta y
 * acción. Al pasar el cursor el borde se vuelve naranja y la acción se
 * desplaza en diagonal.
 *
 * @example
 * ```tsx
 * <HudLink
 *   index="01"
 *   label="GitHub"
 *   href="https://github.com/usuario"
 *   icon={<GithubIcon />}
 * />
 * ```
 */
export function HudLink({
  index,
  icon,
  label,
  action = "↗",
  href,
  external = true,
  onClick,
  done = false,
  ariaLabel,
  className,
}: HudLinkProps) {
  const classes = cn(
    "group inline-flex cursor-pointer items-center gap-[0.6rem] rounded-none border px-[0.8rem] py-2",
    "border-[color-mix(in_srgb,currentColor_30%,transparent)] bg-transparent",
    "text-[0.7rem] font-medium uppercase tracking-[0.25em] no-underline",
    "transition-colors duration-200",
    "hover:border-[var(--hud-accent,#ff5f1f)] hover:bg-[color-mix(in_srgb,currentColor_6%,transparent)]",
    "focus-visible:border-[var(--hud-accent,#ff5f1f)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--hud-accent,#ff5f1f)]",
    done && "border-[var(--hud-accent,#ff5f1f)]",
    className,
  );

  const content = (
    <>
      {index && (
        <span aria-hidden="true" className="text-[0.55rem] opacity-50">
          {index}
        </span>
      )}
      {icon && (
        <span aria-hidden="true" className="inline-flex">
          {icon}
        </span>
      )}
      <span>{label}</span>
      <span
        aria-hidden="true"
        className={cn(
          "text-[0.6rem] opacity-60 transition-transform duration-200",
          "group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100",
          done && "text-[var(--hud-accent,#ff5f1f)] opacity-100",
        )}
      >
        {action}
      </span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        aria-label={
          ariaLabel ?? (external ? `${label} (se abre en una pestaña nueva)` : label)
        }
        onClick={onClick}
        className={classes}
      >
        {content}
      </a>
    );
  }

  return (
    <button type="button" aria-label={ariaLabel ?? label} onClick={onClick} className={classes}>
      {content}
    </button>
  );
}
