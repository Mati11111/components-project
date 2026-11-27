import { useState } from "react";
import type { RegistryEntry } from "@/registry/types";
import { HudSwitch } from "@/components/hud/HudSwitch";
import { DocumentLinks } from "@/components/hud/DocumentLinks";
import { ScrambleText } from "@/components/hud/ScrambleText";
import { HudFrame } from "@/components/hud/HudFrame";
import {
  Barcode,
  HudLabel,
  HudBlock,
  CornerMarks,
  CompilingIndicator,
} from "@/components/hud/HudMarks";
import { HudLink } from "@/components/hud/HudLink";

import hudSwitchSource from "@/components/hud/HudSwitch.tsx?raw";
import documentLinksSource from "@/components/hud/DocumentLinks.tsx?raw";
import scrambleTextSource from "@/components/hud/ScrambleText.tsx?raw";
import hudFrameSource from "@/components/hud/HudFrame.tsx?raw";
import hudMarksSource from "@/components/hud/HudMarks.tsx?raw";
import hudLinkSource from "@/components/hud/HudLink.tsx?raw";

/** Demo del HudSwitch con estado local. */
function HudSwitchDemo({
  label,
  options,
  withSwitchRole = false,
}: {
  label: string;
  options: string[];
  withSwitchRole?: boolean;
}) {
  const [index, setIndex] = useState(0);
  return (
    <HudSwitch
      label={label}
      options={options}
      activeIndex={index}
      onToggle={() => setIndex((i) => (i + 1) % options.length)}
      ariaLabel={`Cambiar ${label}`}
      checked={withSwitchRole ? index === 1 : undefined}
    />
  );
}

/** Demo de ScrambleText con botón para repetir el efecto. */
function ScrambleDemo() {
  const [playKey, setPlayKey] = useState(0);
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-lg uppercase tracking-[0.2em]">
        <ScrambleText key={playKey} text="END OF TRANSMISSION" />
      </p>
      <button
        type="button"
        onClick={() => setPlayKey((k) => k + 1)}
        className="border border-current px-3 py-1 text-xs uppercase tracking-widest hover:border-[#ff5f1f]"
      >
        Repetir
      </button>
    </div>
  );
}

const hudMarksFile = "src/components/hud/HudMarks.tsx";

export const hudRegistry: RegistryEntry[] = [
  {
    slug: "hud-switch",
    name: "HudSwitch",
    description:
      "Interruptor segmentado HUD: etiqueta chica con cuadrito naranja y celdas; la activa se invierte con una línea naranja abajo.",
    category: "HUD",
    filePath: "src/components/hud/HudSwitch.tsx",
    dependencies: ["clsx", "tailwind-merge"],
    source: hudSwitchSource,
    props: [
      { name: "label", type: "string", required: true, description: "Etiqueta técnica sobre las celdas." },
      { name: "options", type: "string[]", required: true, description: "Textos de las celdas (únicos)." },
      { name: "activeIndex", type: "number", required: true, description: "Índice de la celda activa." },
      { name: "onToggle", type: "() => void", required: true, description: "Acción al hacer clic." },
      { name: "ariaLabel", type: "string", required: true, description: "Texto accesible del botón." },
      { name: "checked", type: "boolean", description: "Si se define, usa role=\"switch\" con aria-checked." },
      { name: "busy", type: "boolean", default: "false", description: "Animación de cambio en curso y aria-busy." },
      { name: "className", type: "string", description: "Clases extra del botón." },
    ],
    demos: [
      {
        title: "Variantes",
        variants: [
          {
            label: "Tema",
            preview: <HudSwitchDemo label="MODE" options={["LT", "DK"]} />,
            code: `<HudSwitch
  label="MODE"
  options={["LT", "DK"]}
  activeIndex={index}
  onToggle={() => setIndex((i) => (i + 1) % 2)}
  ariaLabel="Cambiar tema"
/>`,
          },
          {
            label: "Idioma (switch)",
            preview: <HudSwitchDemo label="LANG" options={["ES", "EN"]} withSwitchRole />,
            code: `<HudSwitch
  label="LANG"
  options={["ES", "EN"]}
  activeIndex={index}
  onToggle={toggle}
  ariaLabel="Cambiar idioma"
  checked={index === 1}
/>`,
          },
          {
            label: "Ocupado",
            preview: (
              <HudSwitch
                label="MODE"
                options={["LT", "DK"]}
                activeIndex={1}
                onToggle={() => {}}
                ariaLabel="Cambiando tema"
                busy
              />
            ),
            code: `<HudSwitch label="MODE" options={["LT", "DK"]} activeIndex={1} onToggle={toggle} ariaLabel="Cambiando tema" busy />`,
          },
        ],
      },
    ],
  },
  {
    slug: "document-links",
    name: "DocumentLinks",
    description:
      "Enlaces para abrir y descargar un documento; la acción sin URL se muestra atenuada como pendiente.",
    category: "HUD",
    filePath: "src/components/hud/DocumentLinks.tsx",
    dependencies: ["clsx", "tailwind-merge"],
    source: documentLinksSource,
    props: [
      { name: "view", type: "string", description: "URL para abrir en una ventana nueva." },
      { name: "viewLabel", type: "string", description: "Texto de abrir; sin él la acción no se muestra." },
      { name: "download", type: "string", description: "URL para descargar." },
      { name: "downloadLabel", type: "string", description: "Texto de descargar; sin él la acción no se muestra." },
      { name: "downloadName", type: "string", description: "Nombre del archivo descargado." },
      { name: "pendingLabel", type: "string", default: '""', description: "Texto junto a una acción sin URL (ej. \"pendiente\")." },
      { name: "className", type: "string", description: "Clases extra del contenedor." },
    ],
    demos: [
      {
        title: "Estados",
        variants: [
          {
            label: "Completo",
            preview: (
              <DocumentLinks
                view="#"
                viewLabel="Ver"
                download="#"
                downloadLabel="Descargar"
                downloadName="cv-mati.pdf"
              />
            ),
            code: `<DocumentLinks
  view="/docs/cv.pdf"
  viewLabel="Ver"
  download="/docs/cv.pdf"
  downloadLabel="Descargar"
  downloadName="cv-mati.pdf"
/>`,
          },
          {
            label: "Pendiente",
            preview: (
              <DocumentLinks
                viewLabel="Ver"
                downloadLabel="Descargar"
                pendingLabel="pendiente"
              />
            ),
            code: `<DocumentLinks viewLabel="Ver" downloadLabel="Descargar" pendingLabel="pendiente" />`,
          },
          {
            label: "Solo abrir",
            preview: <DocumentLinks view="#" viewLabel="Abrir presentación" />,
            code: `<DocumentLinks view="/docs/presentacion.pdf" viewLabel="Abrir presentación" />`,
          },
        ],
      },
    ],
  },
  {
    slug: "scramble-text",
    name: "ScrambleText",
    description:
      "Texto que se decodifica tipo cyberpunk: glifos al azar que se fijan de izquierda a derecha al entrar en pantalla. Respeta prefers-reduced-motion.",
    category: "HUD",
    filePath: "src/components/hud/ScrambleText.tsx",
    dependencies: ["clsx", "tailwind-merge"],
    source: scrambleTextSource,
    props: [
      { name: "text", type: "string", required: true, description: "Texto final que se revela." },
      { name: "delay", type: "number", default: "0", description: "Espera en ms antes de empezar." },
      { name: "once", type: "boolean", default: "true", description: "Solo la primera vez que entra en pantalla." },
      { name: "as", type: '"span" | "p"', default: '"span"', description: "Etiqueta HTML renderizada." },
      { name: "className", type: "string", description: "Clases extra." },
    ],
    demos: [
      {
        title: "Efecto",
        variants: [
          {
            label: "Con repetir",
            preview: <ScrambleDemo />,
            code: `<ScrambleText text="END OF TRANSMISSION" />`,
          },
          {
            label: "Con retraso",
            preview: (
              <ScrambleText
                as="p"
                text="SIGNAL [OK] · MATI-DEV.CL"
                delay={400}
                className="text-sm uppercase tracking-[0.3em]"
              />
            ),
            code: `<ScrambleText as="p" text="SIGNAL [OK] · MATI-DEV.CL" delay={400} />`,
          },
          {
            label: "Cada vez",
            preview: (
              <ScrambleText
                text="REPITE AL VOLVER A VERSE"
                once={false}
                className="text-sm uppercase tracking-[0.3em]"
              />
            ),
            code: `<ScrambleText text="REPITE AL VOLVER A VERSE" once={false} />`,
          },
        ],
      },
    ],
  },
  {
    slug: "hud-frame",
    name: "HudFrame",
    description:
      "Ventana tipo terminal HUD con esquinas de registro, etiqueta WIN/0N · SSH · LIVE, barra de título con código de barras y cuerpo con líneas de monitor.",
    category: "HUD",
    filePath: "src/components/hud/HudFrame.tsx",
    dependencies: ["clsx", "tailwind-merge"],
    extraFiles: [
      { filePath: "src/components/hud/ScrambleText.tsx", code: scrambleTextSource, language: "tsx" },
    ],
    source: hudFrameSource,
    props: [
      { name: "title", type: "string", required: true, description: "Título de la barra (mayúsculas, con efecto decodificar)." },
      { name: "index", type: "number", default: "1", description: "Número en la etiqueta WIN/0N." },
      { name: "children", type: "ReactNode", description: "Contenido del cuerpo." },
      { name: "className", type: "string", description: "Clases extra del contenedor." },
    ],
    demos: [
      {
        title: "Ventanas",
        variants: [
          {
            label: "Básica",
            preview: (
              <HudFrame title="experiencia" className="w-full max-w-md">
                <p className="text-sm">Contenido de la ventana.</p>
              </HudFrame>
            ),
            code: `<HudFrame title="experiencia">
  <p className="text-sm">Contenido de la ventana.</p>
</HudFrame>`,
          },
          {
            label: "Ventana 2",
            preview: (
              <HudFrame title="proyectos" index={2} className="w-full max-w-md">
                <ul className="flex flex-col gap-1 text-sm uppercase tracking-wider">
                  <li>01 · Portfolio</li>
                  <li>02 · Librería</li>
                </ul>
              </HudFrame>
            ),
            code: `<HudFrame title="proyectos" index={2}>
  <ul className="flex flex-col gap-1 text-sm uppercase tracking-wider">
    <li>01 · Portfolio</li>
    <li>02 · Librería</li>
  </ul>
</HudFrame>`,
          },
        ],
      },
    ],
  },
  {
    slug: "hud-marks",
    name: "HudMarks",
    description:
      "Piezas decorativas HUD: Barcode, HudLabel, HudBlock, CornerMarks y CompilingIndicator. Todas son aria-hidden.",
    category: "HUD",
    filePath: hudMarksFile,
    dependencies: ["clsx", "tailwind-merge"],
    source: hudMarksSource,
    props: [
      { name: "Barcode.animated", type: "boolean", default: "true", description: "Anima el escaneo del código de barras." },
      { name: "HudLabel.marker", type: "boolean", default: "false", description: "Cuadrito naranja antes del texto." },
      { name: "HudBlock.children", type: "ReactNode", required: true, description: "Texto del bloque invertido." },
      { name: "CornerMarks.className", type: "string", description: "Clases del contenedor absoluto (el padre debe ser relative)." },
      { name: "CompilingIndicator.total", type: "number", default: "8", description: "Celdas de la barra █░." },
      { name: "CompilingIndicator.intervalMs", type: "number", default: "220", description: "Ms entre avances de la barra." },
      { name: "className", type: "string", description: "Clases extra (todas las piezas)." },
    ],
    demos: [
      {
        title: "Piezas",
        variants: [
          {
            label: "Barcode",
            preview: (
              <div className="flex items-center gap-6">
                <Barcode />
                <Barcode animated={false} />
              </div>
            ),
            code: `<Barcode />
<Barcode animated={false} />`,
          },
          {
            label: "Label y Block",
            preview: (
              <div className="flex flex-col items-start gap-3">
                <HudLabel marker>END OF TRANSMISSION</HudLabel>
                <HudBlock>Fullstack developer</HudBlock>
              </div>
            ),
            code: `<HudLabel marker>END OF TRANSMISSION</HudLabel>
<HudBlock>Fullstack developer</HudBlock>`,
          },
          {
            label: "CornerMarks",
            preview: (
              <div className="relative h-32 w-full max-w-sm">
                <CornerMarks />
              </div>
            ),
            code: `<div className="relative h-32">
  <CornerMarks />
</div>`,
          },
          {
            label: "Compiling",
            preview: <CompilingIndicator />,
            code: `<CompilingIndicator total={8} />`,
          },
        ],
      },
    ],
  },
  {
    slug: "hud-link",
    name: "HudLink",
    description:
      "Botón o enlace de contacto estilo footer HUD: índice, ícono, etiqueta y acción. El borde se vuelve naranja al pasar el cursor.",
    category: "HUD",
    filePath: "src/components/hud/HudLink.tsx",
    dependencies: ["clsx", "tailwind-merge"],
    source: hudLinkSource,
    props: [
      { name: "label", type: "string", required: true, description: "Texto principal." },
      { name: "index", type: "string", description: "Índice al inicio (ej. \"01\")." },
      { name: "icon", type: "ReactNode", description: "Slot de ícono decorativo." },
      { name: "action", type: "string", default: '"↗"', description: "Símbolo o texto final." },
      { name: "href", type: "string", description: "Si existe, renderiza <a>; si no, <button>." },
      { name: "external", type: "boolean", default: "true", description: "Abre en pestaña nueva (solo con href)." },
      { name: "onClick", type: "() => void", description: "Acción al hacer clic." },
      { name: "done", type: "boolean", default: "false", description: "Estado hecho: borde y acción naranjas." },
      { name: "ariaLabel", type: "string", description: "Texto accesible; por defecto label." },
      { name: "className", type: "string", description: "Clases extra." },
    ],
    demos: [
      {
        title: "Usos",
        variants: [
          {
            label: "Enlace",
            preview: (
              <HudLink index="01" label="GitHub" href="https://github.com" icon={<span>◆</span>} />
            ),
            code: `<HudLink index="01" label="GitHub" href="https://github.com/usuario" icon={<GithubIcon />} />`,
          },
          {
            label: "Botón copiar",
            preview: <CopyDemo />,
            code: `<HudLink
  index="03"
  label="Email"
  action={copied ? "COPIADO" : "COPIAR"}
  done={copied}
  onClick={copy}
/>`,
          },
        ],
      },
    ],
  },
];

/** Demo de HudLink como botón con estado "hecho". */
function CopyDemo() {
  const [copied, setCopied] = useState(false);
  return (
    <HudLink
      index="03"
      label="Email"
      action={copied ? "COPIADO" : "COPIAR"}
      done={copied}
      onClick={() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
      }}
    />
  );
}
