import { cn } from "@/lib/utils";

export interface HudSwitchProps {
  /** Etiqueta técnica chica sobre las celdas (ej. "MODE"). */
  label: string;
  /** Textos de las celdas (ej. ["LT", "DK"]). Deben ser únicos. */
  options: string[];
  /** Índice de la celda activa. */
  activeIndex: number;
  /** Acción al hacer clic en el interruptor. */
  onToggle: () => void;
  /** Texto accesible del botón. */
  ariaLabel: string;
  /**
   * Si se define, el botón actúa como `role="switch"` con `aria-checked`.
   * @default undefined
   */
  checked?: boolean;
  /**
   * Muestra la animación de cambio en curso y marca `aria-busy`.
   * @default false
   */
  busy?: boolean;
  /** Clases extra para el botón. */
  className?: string;
}

/**
 * Interruptor segmentado con estética HUD: etiqueta chica con cuadrito
 * naranja y celdas; la celda activa se ve invertida con una línea naranja
 * abajo. Colores configurables con `--hud-accent`, `--hud-ink` y `--hud-fg`.
 *
 * @example
 * ```tsx
 * <HudSwitch
 *   label="MODE"
 *   options={["LT", "DK"]}
 *   activeIndex={1}
 *   onToggle={toggle}
 *   ariaLabel="Activar modo claro"
 *   checked
 * />
 * ```
 */
export function HudSwitch({
  label,
  options,
  activeIndex,
  onToggle,
  ariaLabel,
  checked,
  busy = false,
  className,
}: HudSwitchProps) {
  const isSwitch = typeof checked === "boolean";
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={ariaLabel}
      {...(isSwitch ? { role: "switch", "aria-checked": checked } : {})}
      aria-busy={busy || undefined}
      className={cn(
        "group inline-flex cursor-pointer flex-col gap-1 rounded-none border p-1.5",
        "border-[color-mix(in_srgb,var(--hud-fg,#dddddd)_30%,transparent)]",
        "bg-[var(--hud-ink,#181818)] text-[var(--hud-fg,#dddddd)]",
        "text-[0.6rem] font-medium uppercase tracking-[0.25em]",
        "transition-colors duration-200 hover:border-[var(--hud-accent,#ff5f1f)]",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--hud-accent,#ff5f1f)]",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="flex items-center gap-1.5 opacity-70"
      >
        <span className="inline-block size-[0.35rem] bg-[var(--hud-accent,#ff5f1f)]" />
        {label}
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "flex border border-[color-mix(in_srgb,var(--hud-fg,#dddddd)_30%,transparent)]",
          busy && "animate-pulse",
        )}
      >
        {options.map((option, index) => (
          <span
            key={option}
            className={cn(
              "py-[0.15rem] pr-1.5 pl-2 transition-colors duration-200",
              index === activeIndex &&
                "bg-[var(--hud-fg,#dddddd)] text-[var(--hud-ink,#181818)] shadow-[inset_0_-2px_0_var(--hud-accent,#ff5f1f)]",
            )}
          >
            {option}
          </span>
        ))}
      </span>
    </button>
  );
}
