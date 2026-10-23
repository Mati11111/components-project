import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/Modal";
import { Highlight } from "@/components/registry/highlight";
import { toast } from "@/components/ui/toast";

export interface CodeModalFile {
  /** Nombre/ruta del archivo (etiqueta de la pestaña). */
  filePath: string;
  /** Contenido del archivo. */
  code: string;
  /** Lenguaje para el resaltado. */
  language?: string;
}

export interface CodeModalProps {
  /** Si el modal está abierto. */
  open: boolean;
  /** Cierra el modal. */
  onClose: () => void;
  /** Título del modal (ej: nombre del componente). */
  title: string;
  /** Archivos a mostrar (uno o varios). */
  files: CodeModalFile[];
}

export function CodeModal({ open, onClose, title, files }: CodeModalProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (open) setActiveIndex(0);
  }, [open]);

  const activeFile = files[activeIndex] ?? files[0];

  async function copy() {
    if (!activeFile) return;
    try {
      await navigator.clipboard.writeText(activeFile.code);
      toast.success("Código copiado", {
        description: activeFile.filePath.split("/").pop(),
      });
    } catch {
      toast.error("No se pudo copiar el código");
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      variant="secondary"
      title={`Código — ${title}`}
      headerActions={
        <button
          type="button"
          onClick={copy}
          className="rounded-md px-2.5 py-1 text-xs font-medium text-text transition-colors hover:bg-accent-bg hover:text-accent"
        >
          Copiar
        </button>
      }
    >
      {/* tabs de archivos (si hay más de uno) */}
      {files.length > 1 && (
        <div className="sticky top-0 flex gap-1 border-b border-border bg-code-bg px-2 py-1.5">
          {files.map((file, index) => (
            <button
              key={file.filePath}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={cn(
                "rounded-md px-2.5 py-1 font-mono text-xs transition-colors",
                index === activeIndex
                  ? "bg-accent-bg text-accent"
                  : "text-text hover:text-heading",
              )}
              title={file.filePath}
            >
              {file.filePath.split("/").pop()}
            </button>
          ))}
        </div>
      )}

      <pre className="bg-code-bg p-4 text-left">
        <code className="font-mono text-[13px] leading-relaxed text-heading">
          {activeFile && (
            <Highlight code={activeFile.code} language={activeFile.language} />
          )}
        </code>
      </pre>
    </Modal>
  );
}
