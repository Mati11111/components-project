import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/toast";

export interface CodeBlockProps {
  /** Código a mostrar. */
  code: string;
  /** Lenguaje (solo etiqueta visual). */
  language?: string;
  /** Clases extra para el contenedor. */
  className?: string;
}

export function CodeBlock({ code, language = "tsx", className }: CodeBlockProps) {
  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Código copiado");
    } catch {
      toast.error("No se pudo copiar el código");
    }
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border border-border bg-code-bg",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-border px-3 py-1.5">
        <span className="font-mono text-xs text-text">{language}</span>
        <button
          type="button"
          onClick={copy}
          className="rounded-md px-2 py-1 text-xs font-medium text-text transition-colors hover:bg-accent-bg hover:text-accent"
        >
          Copiar
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-left">
        <code className="font-mono text-[13px] leading-relaxed text-heading">
          {code}
        </code>
      </pre>
    </div>
  );
}
