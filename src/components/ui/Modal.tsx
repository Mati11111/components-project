import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { AnimatedText, type TextEffect } from "@/components/ui/AnimatedText";

export type ModalVariant = "primary" | "secondary";

export interface ModalProps {
  /** Si el modal está abierto. */
  open: boolean;
  /** Se llama al pedir cierre (Escape, backdrop o botón de cerrar). */
  onClose: () => void;
  /**
   * Estilo de la cabecera:
   * - "primary": banner de color (accent) con letras claras. Para formularios
   *   o diálogos importantes.
   * - "secondary": cabecera plana, sin banner, solo texto. Para contenido
   *   menos importante.
   */
  variant?: ModalVariant;
  /** Título mostrado en la cabecera. */
  title?: ReactNode;
  /**
   * Efecto de animación del título (si es un string). Opt-in: por defecto
   * "none". Ver AnimatedText.
   */
  titleEffect?: TextEffect;
  /** Contenido del cuerpo. */
  children?: ReactNode;
  /** Acciones de la cabecera, a la derecha del título. */
  headerActions?: ReactNode;
  /** Contenido fijo al pie. */
  footer?: ReactNode;
  /** Ancho máximo del panel (clase Tailwind). */
  maxWidth?: string;
  /** Muestra el botón ✕ de cierre (default true). */
  showClose?: boolean;
  /** Clase extra para el panel. */
  className?: string;
}

/**
 * Modal genérico: overlay con backdrop, cierre con Escape o clic afuera,
 * y bloqueo del scroll del body mientras está abierto. Usa los tokens
 * del tema (surface, border, text, accent).
 */
export function Modal({
  open,
  onClose,
  variant = "primary",
  title,
  titleEffect = "none",
  children,
  headerActions,
  footer,
  maxWidth = "max-w-3xl",
  showClose = true,
  className,
}: ModalProps) {
  // Mantiene el modal montado mientras corre la animación de salida.
  const [mounted, setMounted] = useState(open);
  // Dispara las clases de animación de entrada/salida.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      // En el próximo frame activamos las clases de entrada para que la
      // transición ocurra desde el estado inicial.
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    }
    // Cierre: corre la animación de salida y luego desmonta.
    setVisible(false);
    const timeout = setTimeout(() => setMounted(false), 200);
    return () => clearTimeout(timeout);
  }, [open]);

  useEffect(() => {
    if (!mounted) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [mounted, onClose]);

  if (!mounted) return null;

  const hasHeader = title != null || headerActions != null || showClose;
  const isPrimary = variant === "primary";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-black/60 backdrop-blur-sm",
          visible ? "modal-backdrop-in" : "modal-backdrop-out",
        )}
      />

      <div
        className={cn(
          "relative flex max-h-[85vh] w-full flex-col overflow-hidden",
          "rounded-card border border-border bg-surface shadow-theme",
          visible ? "modal-panel-in" : "modal-panel-out",
          maxWidth,
          className,
        )}
      >
        {hasHeader && (
          <header
            className={cn(
              "flex items-center justify-between gap-3 px-4 py-3",
              isPrimary
                ? "bg-accent text-bg"
                : "border-b border-border text-heading",
            )}
          >
            <div className="min-w-0 text-sm font-medium">
              {typeof title === "string" && titleEffect !== "none" ? (
                <AnimatedText text={title} effect={titleEffect} />
              ) : (
                title
              )}
            </div>
            <div className="flex items-center gap-2">
              {headerActions}
              {showClose && (
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Cerrar"
                  className={cn(
                    "rounded-md px-2 py-1 transition-colors",
                    isPrimary
                      ? "text-bg/80 hover:bg-black/10 hover:text-bg"
                      : "text-text hover:bg-accent-bg hover:text-accent",
                  )}
                >
                  ✕
                </button>
              )}
            </div>
          </header>
        )}

        <div className="min-h-0 flex-1 overflow-auto">{children}</div>

        {footer && (
          <footer className="flex items-center justify-end gap-2 border-t border-border px-4 py-3">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
}
