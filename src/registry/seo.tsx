import type { RegistryEntry } from "@/registry/types";

// Código fuente real importado como texto (Vite `?raw`): lo que se muestra
// y copia siempre coincide con el archivo del repo.
import seoSource from "@/seo/Seo.tsx?raw";
import seoConfigSource from "@/seo/seo.config.ts?raw";
import seoTitleSource from "@/seo/seoTitle.ts?raw";

export const seoRegistry: RegistryEntry[] = [
  {
    slug: "seo",
    name: "Seo",
    description:
      "Head/SEO unificado con el portfolio: título “MATI | <SECCIÓN>”, Open Graph, Twitter cards y JSON-LD (schema.org Person). Depende de react-helmet-async + <HelmetProvider>.",
    category: "SEO",
    filePath: "src/seo/Seo.tsx",
    extraFiles: [
      {
        filePath: "src/seo/seo.config.ts",
        code: seoConfigSource,
        language: "ts",
      },
      {
        filePath: "src/seo/seoTitle.ts",
        code: seoTitleSource,
        language: "ts",
      },
    ],
    dependencies: ["react-helmet-async"],
    source: seoSource,
    props: [
      {
        name: "section",
        type: "string",
        default: '"COMPONENTS"',
        description:
          'Sección en mayúsculas para el título de pestaña: "MATI | <SECCIÓN>".',
      },
      {
        name: "description",
        type: "string",
        description: "Meta description y descripción del JSON-LD.",
      },
      {
        name: "ogTitle",
        type: "string",
        description: "Título usado en Open Graph y Twitter cards.",
      },
      {
        name: "ogImage",
        type: "string",
        description:
          "URL absoluta de la imagen social (preview al compartir, 1200×630).",
      },
      {
        name: "ogImageAlt",
        type: "string",
        description: "Texto alternativo de la imagen social.",
      },
      {
        name: "siteUrl",
        type: "string",
        description: "URL canónica de producción del sitio.",
      },
      {
        name: "locale",
        type: "string",
        default: '"es_ES"',
        description: "Locale OG; define también el lang del <html>.",
      },
      {
        name: "themeColor",
        type: "string",
        description: "Color de UI del navegador móvil (meta theme-color).",
      },
    ],
    demos: [
      {
        title: "Uso en el layout raíz",
        preview: (
          <div className="flex w-full max-w-md flex-col gap-3">
            <p className="text-sm text-text">
              Renderizá <code className="font-mono text-accent">&lt;Seo /&gt;</code>{" "}
              una sola vez en el layout raíz. Inyecta todo el{" "}
              <code className="font-mono text-accent">&lt;head&gt;</code> vía{" "}
              <code className="font-mono text-accent">react-helmet-async</code>.
            </p>
            <div className="rounded-lg border border-border bg-code-bg p-3 font-mono text-xs text-heading">
              <span className="text-text">&lt;title&gt;</span> MATI | COMPONENTS{" "}
              <span className="text-text">&lt;/title&gt;</span>
            </div>
          </div>
        ),
        code: `<Seo section="COMPONENTS" />`,
      },
      {
        title: "Setup con HelmetProvider",
        preview: (
          <p className="w-full max-w-md text-sm text-text">
            Envolvé la app en{" "}
            <code className="font-mono text-accent">&lt;HelmetProvider&gt;</code> en{" "}
            <code className="font-mono text-accent">main.tsx</code> para que{" "}
            <code className="font-mono text-accent">&lt;Seo /&gt;</code> pueda
            escribir en el head.
          </p>
        ),
        code: `// main.tsx
import { HelmetProvider } from "react-helmet-async";

root.render(
  <HelmetProvider>
    <App />
  </HelmetProvider>,
);

// App.tsx
import Seo from "@/seo/Seo";

export default function App() {
  return (
    <>
      <Seo section="COMPONENTS" />
      {/* ...resto de la app... */}
    </>
  );
}`,
      },
    ],
  },
];
