import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export type BadgeVariant = "accent" | "neutral" | "outline";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Estilo visual del badge. */
  variant?: BadgeVariant;
}

const variants: Record<BadgeVariant, string> = {
  accent: "bg-accent-bg text-accent border border-transparent",
  neutral: "bg-code-bg text-heading border border-transparent",
  outline: "bg-transparent text-text border border-border",
};

export function Badge({ variant = "accent", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
