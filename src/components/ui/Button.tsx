import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Estilo visual del botón. */
  variant?: ButtonVariant;
  /** Tamaño del botón. */
  size?: ButtonSize;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-bg border border-transparent hover:opacity-90",
  secondary:
    "bg-accent-bg text-accent border border-transparent hover:border-accent-border",
  outline:
    "bg-transparent text-heading border border-border hover:border-accent-border",
  ghost: "bg-transparent text-text border border-transparent hover:bg-accent-bg",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-[15px]",
  lg: "h-12 px-6 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium",
        "transition-colors focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-accent-border disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
