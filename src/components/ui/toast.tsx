import { Toaster as SonnerToaster, toast } from "sonner";
import type { CSSProperties } from "react";

// Re-exportamos la API de sonner para que el resto del proyecto importe
// desde un único lugar (@/components/ui/toast).
export { toast };
export type { ExternalToast } from "sonner";

export type ToasterPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export interface ToasterProps {
  /** Esquina donde se apilan los toasts. */
  position?: ToasterPosition;
  /** Usa los colores vivos de sonner por tipo (success/error/...). */
  richColors?: boolean;
}

/**
 * Toaster de sonner tematizado con la paleta del proyecto.
 *
 * Sonner lee variables CSS del contenedor para pintar los toasts
 * (`--normal-bg`, `--normal-text`, `--normal-border`). Las mapeamos a
 * nuestros tokens de tema para que combine con el resto de la plataforma
 * y respete light/dark automáticamente.
 */
export function Toaster({
  position = "bottom-right",
  richColors = false,
}: ToasterProps) {
  const themeVars = {
    "--normal-bg": "var(--surface)",
    "--normal-text": "var(--text-h)",
    "--normal-border": "var(--border)",
    "--border-radius": "12px",
  } as CSSProperties;

  return (
    <SonnerToaster
      position={position}
      richColors={richColors}
      toastOptions={{
        style: {
          background: "var(--surface)",
          color: "var(--text-h)",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow)",
          fontFamily: "var(--sans)",
        },
        classNames: {
          description: "sonner-desc",
          actionButton: "sonner-action",
        },
      }}
      style={themeVars}
    />
  );
}
