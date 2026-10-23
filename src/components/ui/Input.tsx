import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Etiqueta opcional mostrada sobre el input. */
  label?: string;
  /** Mensaje de error; cambia el estilo del borde. */
  error?: string;
}

export function Input({ label, error, className, id, ...props }: InputProps) {
  const inputId = id ?? props.name;
  return (
    <label className="flex flex-col gap-1.5 text-left">
      {label && (
        <span className="text-sm font-medium text-heading">{label}</span>
      )}
      <input
        id={inputId}
        className={cn(
          "h-10 w-full rounded-lg border bg-bg px-3 text-[15px] text-heading",
          "placeholder:text-text transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-border",
          error ? "border-red-400" : "border-border",
          className,
        )}
        aria-invalid={error ? true : undefined}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </label>
  );
}
