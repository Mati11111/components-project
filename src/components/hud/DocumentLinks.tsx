import { cn } from "@/lib/utils";

export interface DocumentLinksProps {
  /** URL para abrir el documento en una ventana nueva. */
  view?: string;
  /** Texto del enlace de abrir. Sin etiqueta, la acción no se muestra. */
  viewLabel?: string;
  /** URL para descargar el documento. */
  download?: string;
  /** Texto del enlace de descargar. Sin etiqueta, la acción no se muestra. */
  downloadLabel?: string;
  /** Nombre con el que se guarda el archivo descargado. */
  downloadName?: string;
  /**
   * Texto que acompaña a una acción cuya URL aún no existe (ej. "pendiente").
   * @default ""
   */
  pendingLabel?: string;
  /** Clases extra para el contenedor. */
  className?: string;
}

/**
 * Enlaces para abrir y descargar un documento. Solo se muestran las acciones
 * con etiqueta. Si falta la URL de una acción, se ve atenuada y sin enlace.
 *
 * @example
 * ```tsx
 * <DocumentLinks
 *   view="/docs/cv.pdf"
 *   viewLabel="Ver"
 *   download="/docs/cv.pdf"
 *   downloadLabel="Descargar"
 *   downloadName="cv-mati.pdf"
 *   pendingLabel="pendiente"
 * />
 * ```
 */
export function DocumentLinks({
  view,
  viewLabel,
  download,
  downloadLabel,
  downloadName,
  pendingLabel = "",
  className,
}: DocumentLinksProps) {
  const actions = [
    { key: "view", url: view, label: viewLabel, isDownload: false },
    { key: "download", url: download, label: downloadLabel, isDownload: true },
  ];

  return (
    <div className={cn("flex flex-wrap gap-x-5 gap-y-2 text-sm", className)}>
      {actions
        .filter(({ label }) => Boolean(label))
        .map(({ key, url, label, isDownload }) =>
          url ? (
            <a
              key={key}
              href={url}
              {...(isDownload
                ? { download: downloadName || true }
                : { target: "_blank", rel: "noopener noreferrer" })}
              className="w-fit underline underline-offset-4 hover:text-[var(--hud-accent,#ff5f1f)] focus-visible:outline-2 focus-visible:outline-[var(--hud-accent,#ff5f1f)]"
            >
              {label}
            </a>
          ) : (
            <span key={key} className="w-fit opacity-50">
              {pendingLabel ? `${label} (${pendingLabel})` : label}
            </span>
          ),
        )}
    </div>
  );
}
