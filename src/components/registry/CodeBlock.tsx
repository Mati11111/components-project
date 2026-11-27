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
        "relative overflow-hidden rounded-none border border-border bg-code-bg",
        className,
      )}
    >
      <div className="hud-titlebar justify-between">
        <span className="font-mono">{language}</span>
        <button
          type="button"
          onClick={copy}
          className="rounded-none border border-transparent px-2 py-0.5 uppercase tracking-[0.2em] text-hud-bar-fg transition-colors hover:border-hud-accent"
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
