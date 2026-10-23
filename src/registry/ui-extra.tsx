import { useState } from "react";
import type { ReactNode } from "react";
import type { RegistryEntry } from "@/registry/types";
import { Modal, type ModalVariant } from "@/components/ui/Modal";
import { Carousel } from "@/components/ui/Carousel";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { toast, Toaster } from "@/components/ui/toast";
import { AnimatedText, type TextEffect } from "@/components/ui/AnimatedText";
import { PageTitle } from "@/components/ui/PageTitle";

import modalSource from "@/components/ui/Modal.tsx?raw";
import toastSource from "@/components/ui/toast.tsx?raw";
import carouselSource from "@/components/ui/Carousel.tsx?raw";
import animatedTextSource from "@/components/ui/AnimatedText.tsx?raw";
import pageTitleSource from "@/components/ui/PageTitle.tsx?raw";

/** Demo del Modal con variante configurable (primary con banner / secondary plano). */
function ModalDemo({ variant }: { variant: ModalVariant }) {
  const [open, setOpen] = useState(false);
  const isPrimary = variant === "primary";
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        {isPrimary ? "Abrir formulario" : "Abrir aviso"}
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        variant={variant}
        title={isPrimary ? "Editar perfil" : "Detalles"}
        maxWidth="max-w-md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setOpen(false)}>
              {isPrimary ? "Guardar" : "Entendido"}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-3 p-5 text-sm text-text">
          {isPrimary ? (
            <>
              <p className="text-heading">
                Cabecera con banner de color: para formularios o acciones
                importantes.
              </p>
              <input
                className="h-10 rounded-lg border border-border bg-bg px-3 text-heading"
                placeholder="Nombre"
              />
            </>
          ) : (
            <p>
              Cabecera plana, sin banner: para contenido secundario o menos
              importante.
            </p>
          )}
        </div>
      </Modal>
    </>
  );
}

/** Caja de muestra para los ítems del carrusel. */
function DemoBox({ children }: { children: ReactNode }) {
  return (
    <Card className="flex h-24 w-full items-center justify-center text-xl font-medium text-heading">
      {children}
    </Card>
  );
}

const demoItems = [1, 2, 3, 4, 5, 6].map((n) => <DemoBox key={n}>{n}</DemoBox>);

/** Demo de AnimatedText con botón para re-disparar la animación. */
function AnimatedTextDemo({ effect }: { effect: TextEffect }) {
  const [playKey, setPlayKey] = useState(0);
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-2xl font-medium text-heading">
        {/* key fuerza el re-montaje para reproducir la animación de nuevo */}
        <AnimatedText key={playKey} text="Hola mundo" effect={effect} />
      </div>
      {effect !== "none" && (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setPlayKey((k) => k + 1)}
        >
          Reproducir
        </Button>
      )}
    </div>
  );
}

/** Demo de toasts: botones que disparan cada variante. */
function ToastDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button variant="secondary" onClick={() => toast("Mensaje simple")}>
        Default
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast.success("Guardado", { description: "Todo salió bien" })
        }
      >
        Success
      </Button>
      <Button
        variant="secondary"
        onClick={() => toast.error("Algo falló")}
      >
        Error
      </Button>
      <Button variant="secondary" onClick={() => toast.info("Info útil")}>
        Info
      </Button>
      {/* El Toaster normalmente va una sola vez en la raíz de la app */}
      <Toaster position="bottom-right" />
    </div>
  );
}

export const uiExtraRegistry: RegistryEntry[] = [
  {
    slug: "modal",
    name: "Modal",
    description:
      "Diálogo modal genérico: backdrop, cierre con Escape/clic afuera, header y footer.",
    category: "Otros",
    filePath: "src/components/ui/Modal.tsx",
    dependencies: ["clsx", "tailwind-merge"],
    source: modalSource,
    props: [
      {
        name: "open",
        type: "boolean",
        required: true,
        description: "Si el modal está visible.",
      },
      {
        name: "onClose",
        type: "() => void",
        required: true,
        description: "Se llama al cerrar (Escape, backdrop o ✕).",
      },
      {
        name: "variant",
        type: '"primary" | "secondary"',
        default: '"primary"',
        description:
          "primary: cabecera con banner de color (importante). secondary: cabecera plana.",
      },
      {
        name: "title",
        type: "ReactNode",
        description: "Título en la cabecera.",
      },
      {
        name: "headerActions",
        type: "ReactNode",
        description: "Acciones a la derecha del título.",
      },
      {
        name: "footer",
        type: "ReactNode",
        description: "Contenido fijo al pie.",
      },
      {
        name: "maxWidth",
        type: "string",
        default: '"max-w-3xl"',
        description: "Clase Tailwind de ancho máximo del panel.",
      },
      {
        name: "showClose",
        type: "boolean",
        default: "true",
        description: "Muestra el botón ✕ de cierre.",
      },
      {
        name: "children",
        type: "ReactNode",
        description: "Cuerpo del modal.",
      },
    ],
    demos: [
      {
        title: "Variantes de cabecera",
        variants: [
          {
            label: "Primary (banner)",
            preview: <ModalDemo variant="primary" />,
            code: `<Modal
  open={open}
  onClose={() => setOpen(false)}
  variant="primary"
  title="Editar perfil"
  footer={
    <>
      <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
      <Button onClick={() => setOpen(false)}>Guardar</Button>
    </>
  }
>
  <form className="p-5">...</form>
</Modal>`,
          },
          {
            label: "Secondary (plano)",
            preview: <ModalDemo variant="secondary" />,
            code: `<Modal
  open={open}
  onClose={() => setOpen(false)}
  variant="secondary"
  title="Detalles"
  footer={<Button onClick={() => setOpen(false)}>Entendido</Button>}
>
  <div className="p-5 text-sm text-text">Contenido secundario.</div>
</Modal>`,
          },
        ],
      },
    ],
  },
  {
    slug: "toast",
    name: "Toast",
    description:
      "Notificaciones con la librería sonner, con un <Toaster/> tematizado con la paleta del proyecto.",
    category: "Otros",
    filePath: "src/components/ui/toast.tsx",
    dependencies: ["sonner"],
    source: toastSource,
    props: [
      {
        name: "toast(message, data?)",
        type: "(message, data?: ExternalToast) => string | number",
        description:
          "API de sonner. Variantes: toast.success/error/info/warning/promise.",
      },
      {
        name: "data.description",
        type: "ReactNode",
        description: "Texto secundario bajo el título.",
      },
      {
        name: "data.duration",
        type: "number",
        default: "4000",
        description: "Ms antes de cerrarse (default de sonner).",
      },
      {
        name: "<Toaster position>",
        type: '"top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right"',
        default: '"bottom-right"',
        description: "Esquina donde se apilan los toasts.",
      },
      {
        name: "<Toaster richColors>",
        type: "boolean",
        default: "false",
        description: "Usa los colores vivos por tipo de sonner.",
      },
    ],
    demos: [
      {
        title: "Variantes",
        preview: <ToastDemo />,
        code: `// 1) montá el Toaster una vez en la raíz
<Toaster position="bottom-right" />

// 2) dispará toasts desde cualquier lado
toast("Mensaje simple");
toast.success("Guardado", { description: "Todo salió bien" });
toast.error("Algo falló");
toast.info("Info útil");`,
      },
    ],
  },
  {
    slug: "carousel",
    name: "Carousel",
    description:
      "Carrusel horizontal con paginación, o vertical con scroll y elemento centrado.",
    category: "Otros",
    filePath: "src/components/ui/Carousel.tsx",
    dependencies: ["clsx", "tailwind-merge"],
    source: carouselSource,
    props: [
      {
        name: "items",
        type: "ReactNode[]",
        required: true,
        description: "Elementos a paginar.",
      },
      {
        name: "orientation",
        type: '"horizontal" | "vertical"',
        default: '"horizontal"',
        description: "Dirección del desplazamiento.",
      },
      {
        name: "itemsPerPage",
        type: "number",
        default: "1",
        description: "Elementos por página (solo horizontal).",
      },
      {
        name: "size",
        type: "number | string",
        description: "Alto del viewport cuando es vertical.",
      },
      {
        name: "showIndicators",
        type: "boolean",
        default: "true",
        description: "Muestra los puntos indicadores (solo horizontal).",
      },
      {
        name: "showArrows",
        type: "boolean",
        default: "true",
        description: "Muestra las flechas de navegación (solo horizontal).",
      },
    ],
    demos: [
      {
        title: "Orientación y elementos por página",
        variants: [
          {
            label: "Horizontal · 1",
            preview: (
              <div className="w-full max-w-sm">
                <Carousel items={demoItems} orientation="horizontal" />
              </div>
            ),
            code: `<Carousel items={items} orientation="horizontal" itemsPerPage={1} />`,
          },
          {
            label: "Horizontal · 2",
            preview: (
              <div className="w-full max-w-md">
                <Carousel
                  items={demoItems}
                  orientation="horizontal"
                  itemsPerPage={2}
                />
              </div>
            ),
            code: `<Carousel items={items} orientation="horizontal" itemsPerPage={2} />`,
          },
          {
            label: "Horizontal · 3",
            preview: (
              <div className="w-full max-w-lg">
                <Carousel
                  items={demoItems}
                  orientation="horizontal"
                  itemsPerPage={3}
                />
              </div>
            ),
            code: `<Carousel items={items} orientation="horizontal" itemsPerPage={3} />`,
          },
          {
            label: "Vertical (scroll)",
            preview: (
              <div className="w-full max-w-xs">
                <Carousel
                  items={demoItems}
                  orientation="vertical"
                  size={280}
                />
              </div>
            ),
            code: `<Carousel items={items} orientation="vertical" size={280} />`,
          },
        ],
      },
    ],
  },
  {
    slug: "animated-text",
    name: "AnimatedText",
    description:
      "Texto con animación de aparición opcional: reveal (izq→der con fade) o scramble (letras al azar que se resuelven).",
    category: "Otros",
    filePath: "src/components/ui/AnimatedText.tsx",
    dependencies: ["clsx", "tailwind-merge"],
    source: animatedTextSource,
    props: [
      {
        name: "text",
        type: "string",
        required: true,
        description: "Texto a animar.",
      },
      {
        name: "effect",
        type: '"none" | "reveal" | "scramble"',
        default: '"none"',
        description:
          "Efecto de aparición. Siempre opt-in: por defecto sin animación.",
      },
      {
        name: "duration",
        type: "number",
        default: "800",
        description: "Duración total de la animación en ms.",
      },
      {
        name: "delay",
        type: "number",
        default: "0",
        description: "Retardo antes de iniciar en ms.",
      },
      {
        name: "scrambleChars",
        type: "string",
        description: "Caracteres usados por el efecto scramble.",
      },
      {
        name: "as",
        type: "ElementType",
        default: '"span"',
        description: "Etiqueta HTML a renderizar.",
      },
    ],
    demos: [
      {
        title: "Efectos de aparición",
        variants: [
          {
            label: "None (default)",
            preview: <AnimatedTextDemo effect="none" />,
            code: `<AnimatedText text="Hola mundo" />`,
          },
          {
            label: "Reveal",
            preview: <AnimatedTextDemo effect="reveal" />,
            code: `<AnimatedText text="Hola mundo" effect="reveal" />`,
          },
          {
            label: "Scramble",
            preview: <AnimatedTextDemo effect="scramble" />,
            code: `<AnimatedText text="Hola mundo" effect="scramble" />`,
          },
        ],
      },
    ],
  },
  {
    slug: "page-title",
    name: "PageTitle",
    description:
      "Título de página grande (estilo header del portfolio), con decoración, subtítulo y efecto de texto opcionales.",
    category: "Otros",
    filePath: "src/components/ui/PageTitle.tsx",
    dependencies: ["clsx", "tailwind-merge"],
    source: pageTitleSource,
    props: [
      {
        name: "text",
        type: "string",
        required: true,
        description: "Texto principal del título.",
      },
      {
        name: "decoration",
        type: "string",
        description: 'Decoración junto al texto (ej: "</>").',
      },
      {
        name: "subtitle",
        type: "string",
        description: "Subtítulo opcional debajo.",
      },
      {
        name: "effect",
        type: '"none" | "reveal" | "scramble"',
        default: '"none"',
        description: "Efecto de aparición del título (opt-in).",
      },
      {
        name: "align",
        type: '"left" | "center"',
        default: '"left"',
        description: "Alineación del contenido.",
      },
    ],
    demos: [
      {
        title: "Título de página",
        variants: [
          {
            label: "Con decoración",
            preview: (
              <PageTitle
                text="Librería"
                decoration="</>"
                subtitle="Componentes genéricos para desarrollo"
              />
            ),
            code: `<PageTitle
  text="Librería de componentes"
  decoration="</>"
  subtitle="Componentes genéricos para desarrollo"
/>`,
          },
          {
            label: "Centrado",
            preview: <PageTitle text="Bienvenido" align="center" />,
            code: `<PageTitle text="Bienvenido" align="center" />`,
          },
          {
            label: "Con efecto scramble",
            preview: <PageTitle text="Bienvenido" effect="scramble" />,
            code: `<PageTitle text="Bienvenido" effect="scramble" />`,
          },
        ],
      },
    ],
  },
];
