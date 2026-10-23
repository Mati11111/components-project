import type { RegistryEntry } from "@/registry/types";
import { portfolioRegistry } from "@/registry/portfolio";
import { uiExtraRegistry } from "@/registry/ui-extra";
import { seoRegistry } from "@/registry/seo";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";

const buttonSource = `import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variants: Record<ButtonVariant, string> = {
  primary: "bg-accent text-bg border border-transparent hover:opacity-90",
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
}`;

const badgeSource = `import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export type BadgeVariant = "accent" | "neutral" | "outline";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
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
}`;

const inputSource = `import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
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
}`;

const cardSource = `import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-card border border-border bg-surface text-text",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: CardProps) {
  return <div className={cn("flex flex-col gap-1 p-5 pb-0", className)} {...props} />;
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-lg font-medium text-heading", className)} {...props} />;
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-text", className)} {...props} />;
}

export function CardContent({ className, ...props }: CardProps) {
  return <div className={cn("p-5", className)} {...props} />;
}

export function CardFooter({ className, ...props }: CardProps) {
  return <div className={cn("flex items-center gap-2 p-5 pt-0", className)} {...props} />;
}`;

const uiRegistry: RegistryEntry[] = [
  {
    slug: "button",
    name: "Button",
    description: "Botón con variantes de estilo y tamaños.",
    category: "Otros",
    filePath: "src/components/ui/Button.tsx",
    dependencies: ["clsx", "tailwind-merge"],
    source: buttonSource,
    props: [
      {
        name: "variant",
        type: '"primary" | "secondary" | "outline" | "ghost"',
        default: '"primary"',
        description: "Estilo visual del botón.",
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg"',
        default: '"md"',
        description: "Tamaño del botón.",
      },
      {
        name: "...props",
        type: "ButtonHTMLAttributes<HTMLButtonElement>",
        description: "Todos los atributos nativos de <button>.",
      },
    ],
    demos: [
      {
        title: "Variantes",
        preview: (
          <>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
          </>
        ),
        code: `<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>`,
      },
      {
        title: "Tamaños",
        preview: (
          <>
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </>
        ),
        code: `<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>`,
      },
    ],
  },
  {
    slug: "badge",
    name: "Badge",
    description: "Etiqueta compacta para estados y categorías.",
    category: "Otros",
    filePath: "src/components/ui/Badge.tsx",
    dependencies: ["clsx", "tailwind-merge"],
    source: badgeSource,
    props: [
      {
        name: "variant",
        type: '"accent" | "neutral" | "outline"',
        default: '"accent"',
        description: "Estilo visual del badge.",
      },
      {
        name: "...props",
        type: "HTMLAttributes<HTMLSpanElement>",
        description: "Todos los atributos nativos de <span>.",
      },
    ],
    demos: [
      {
        title: "Variantes",
        preview: (
          <>
            <Badge variant="accent">Accent</Badge>
            <Badge variant="neutral">Neutral</Badge>
            <Badge variant="outline">Outline</Badge>
          </>
        ),
        code: `<Badge variant="accent">Accent</Badge>
<Badge variant="neutral">Neutral</Badge>
<Badge variant="outline">Outline</Badge>`,
      },
    ],
  },
  {
    slug: "input",
    name: "Input",
    description: "Campo de texto con label y estado de error.",
    category: "Otros",
    filePath: "src/components/ui/Input.tsx",
    dependencies: ["clsx", "tailwind-merge"],
    source: inputSource,
    props: [
      {
        name: "label",
        type: "string",
        description: "Etiqueta mostrada sobre el input.",
      },
      {
        name: "error",
        type: "string",
        description: "Mensaje de error; marca el borde en rojo.",
      },
      {
        name: "...props",
        type: "InputHTMLAttributes<HTMLInputElement>",
        description: "Todos los atributos nativos de <input>.",
      },
    ],
    demos: [
      {
        title: "Básico",
        preview: (
          <div className="w-full max-w-xs">
            <Input label="Email" placeholder="tu@email.com" type="email" />
          </div>
        ),
        code: `<Input label="Email" placeholder="tu@email.com" type="email" />`,
      },
      {
        title: "Con error",
        preview: (
          <div className="w-full max-w-xs">
            <Input
              label="Usuario"
              placeholder="usuario"
              defaultValue="ab"
              error="Mínimo 3 caracteres."
            />
          </div>
        ),
        code: `<Input
  label="Usuario"
  placeholder="usuario"
  error="Mínimo 3 caracteres."
/>`,
      },
    ],
  },
  {
    slug: "card",
    name: "Card",
    description: "Contenedor compuesto para agrupar contenido.",
    category: "Otros",
    filePath: "src/components/ui/Card.tsx",
    dependencies: ["clsx", "tailwind-merge"],
    source: cardSource,
    props: [
      {
        name: "...props",
        type: "HTMLAttributes<HTMLDivElement>",
        description:
          "Card, CardHeader, CardContent y CardFooter aceptan atributos de <div>.",
      },
    ],
    demos: [
      {
        title: "Composición",
        preview: (
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>Plan Pro</CardTitle>
              <CardDescription>Todo lo que necesitás para crecer.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-medium text-heading">
                $29<span className="text-sm text-text">/mes</span>
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Suscribirse</Button>
            </CardFooter>
          </Card>
        ),
        code: `<Card className="w-full max-w-sm">
  <CardHeader>
    <CardTitle>Plan Pro</CardTitle>
    <CardDescription>Todo lo que necesitás para crecer.</CardDescription>
  </CardHeader>
  <CardContent>
    <p className="text-2xl font-medium text-heading">
      $29<span className="text-sm text-text">/mes</span>
    </p>
  </CardContent>
  <CardFooter>
    <Button className="w-full">Suscribirse</Button>
  </CardFooter>
</Card>`,
      },
    ],
  },
];

export const registry: RegistryEntry[] = [
  ...portfolioRegistry,
  ...uiRegistry,
  ...uiExtraRegistry,
  ...seoRegistry,
];

export function getEntry(slug: string): RegistryEntry | undefined {
  return registry.find((e) => e.slug === slug);
}
