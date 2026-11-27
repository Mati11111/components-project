import { toast } from "@/components/ui/toast";

/** Un asset descargable de marca. */
interface AssetDoc {
  /** Nombre visible del asset. */
  name: string;
  /** Descripción corta. */
  description: string;
  /** Archivo(s) descargable(s). El primero se usa para la previsualización. */
  files: AssetFile[];
  /** Fondo de la previsualización: claro u oscuro. */
  previewBg?: "light" | "dark";
  /**
   * Ruta (dentro de public/) de un HTML a renderizar en la previsualización
   * mediante un <iframe>. Útil para assets que son HTML (ej: la firma), así el
   * preview refleja el archivo real en vez de una imagen estática.
   */
  previewHtml?: string;
}

interface AssetFile {
  /** Etiqueta del formato (ej: "PNG", "SVG"). */
  label: string;
  /** Ruta del archivo dentro de public/ (sin el base path). */
  file: string;
  /** Nombre sugerido al descargar. */
  downloadName: string;
}

// Base path del sitio (/components/ en prod, / en dev). Así las URLs de los
// assets de public/ se resuelven bien bajo el subpath.
const BASE = import.meta.env.BASE_URL;

// Origen de producción donde se sirve la librería. Se usa para construir las
// URLs absolutas que se muestran para consumir los assets desde otras apps
// (ej. el portfolio). Deja una barra final consistente con BASE.
const PROD_ORIGIN = "https://mati-dev.cl";

/** Construye la URL pública (relativa) de un archivo de public/ respetando el base path. */
function publicUrl(file: string): string {
  return `${BASE}${file}`.replace(/([^:]\/)\/+/g, "$1");
}

/** URL absoluta de producción del asset, para consumir desde otras apps. */
function absoluteUrl(file: string): string {
  return `${PROD_ORIGIN}${publicUrl(file)}`;
}

const assets: AssetDoc[] = [
  {
    name: "Imagen social HUD",
    description:
      "Open Graph con la marca HUD (1200×630): cuadrícula, marcas de registro y acento naranja. Úsala en og:image y twitter:image.",
    previewBg: "dark",
    files: [
      {
        label: "PNG",
        file: "brand/mati-social-hud.png",
        downloadName: "mati-social-hud.png",
      },
      {
        label: "SVG",
        file: "brand/mati-social-hud.svg",
        downloadName: "mati-social-hud.svg",
      },
    ],
  },
  {
    name: "Imagen social",
    description:
      "Open Graph / preview al compartir el link (1200×630). Úsala en og:image y twitter:image.",
    previewBg: "dark",
    files: [
      {
        label: "PNG",
        file: "brand/mati-social.png",
        downloadName: "mati-social.png",
      },
      {
        label: "SVG",
        file: "brand/mati-social.svg",
        downloadName: "mati-social.svg",
      },
    ],
  },
  {
    name: "Firma",
    description:
      "Firma de correo con el wordmark “MATI”. Versión HTML para Gmail/Outlook e imagen a prueba de fallos.",
    previewBg: "light",
    previewHtml: "brand/firma-email.html",
    files: [
      {
        label: "PNG",
        file: "brand/firma-email.png",
        downloadName: "mati-firma.png",
      },
      {
        label: "HTML",
        file: "brand/firma-email.html",
        downloadName: "mati-firma.html",
      },
      {
        label: "Avatar SVG",
        file: "brand/mati-avatar.svg",
        downloadName: "mati-avatar.svg",
      },
    ],
  },
  {
    name: "Icono de perfil",
    description:
      "Isotipo de la marca. Para avatar, favicon y app icon.",
    previewBg: "light",
    files: [
      {
        label: "SVG",
        file: "brand/favicon.svg",
        downloadName: "mati-icono.svg",
      },
      {
        label: "ICO",
        file: "brand/favicon.ico",
        downloadName: "favicon.ico",
      },
      {
        label: "Avatar PNG",
        file: "brand/mati-avatar.png",
        downloadName: "mati-avatar.png",
      },
    ],
  },
  {
    name: "Carta de presentación",
    description:
      "Recorrido completo de experiencia, formación y habilidades, en formato poco técnico. Versión web con la marca HUD: línea de tiempo, tema claro/oscuro e impresión.",
    previewBg: "dark",
    previewHtml: "documents/carta-presentacion.html",
    files: [
      {
        label: "HTML",
        file: "documents/carta-presentacion.html",
        downloadName: "carta_presentacion_matias_chaparro.html",
      },
    ],
  },
  {
    name: "CV",
    description:
      "CV profesional de una página con las últimas experiencias y tecnologías.",
    previewBg: "light",
    files: [
      {
        label: "PDF",
        file: "documents/cv.pdf",
        downloadName: "cv_matias_chaparro.pdf",
      },
    ],
  },
];

async function copyUrl(url: string) {
  try {
    await navigator.clipboard.writeText(url);
    toast.success("URL copiada", { description: url });
  } catch {
    toast.error("No se pudo copiar");
  }
}

async function downloadFile(file: AssetFile) {
  try {
    const url = publicUrl(file.file);
    const res = await fetch(url);
    if (!res.ok) throw new Error(String(res.status));
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = file.downloadName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(objectUrl);
    toast.success("Descargando", { description: file.downloadName });
  } catch {
    toast.error("No se pudo descargar", { description: file.downloadName });
  }
}

function AssetCard({ asset }: { asset: AssetDoc }) {
  const preview = asset.files[0];
  return (
    <div className="hud-frame flex flex-col border border-border bg-surface">
      <div
        className="relative flex h-40 w-full items-center justify-center overflow-hidden border-b border-border p-6"
        style={{
          background: asset.previewBg === "dark" ? "#181818" : "#ededed",
        }}
      >
        {asset.previewHtml ? (
          <iframe
            src={publicUrl(asset.previewHtml)}
            title={`${asset.name} (preview)`}
            loading="lazy"
            scrolling="no"
            className="pointer-events-none h-full w-full border-0"
          />
        ) : (
          <img
            src={publicUrl(preview.file)}
            alt={asset.name}
            className="max-h-full max-w-full object-contain"
            loading="lazy"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-col gap-1">
          <h3 className="flex items-center gap-2 text-sm font-normal uppercase tracking-[0.12em] text-heading">
            <span aria-hidden className="hud-square" />
            {asset.name}
          </h3>
          <p className="text-[13px] font-light leading-snug text-text">
            {asset.description}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {asset.files.map((file) => (
            <button
              key={file.downloadName}
              type="button"
              onClick={() => downloadFile(file)}
              className="hud-hover inline-flex items-center gap-1.5 rounded-none border border-border bg-bg px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.25em] text-text transition-colors"
            >
              <span aria-hidden>↓</span>
              {file.label}
            </button>
          ))}
        </div>

        {/* URLs públicas para consumir el asset desde otras apps (portfolio). */}
        <div className="mt-auto flex flex-col gap-1.5 border-t border-border pt-3">
          <span className="hud-label text-text">
            Usar desde otra app
          </span>
          {asset.files.map((file) => {
            const url = absoluteUrl(file.file);
            return (
              <button
                key={file.file}
                type="button"
                onClick={() => copyUrl(url)}
                title={`Copiar URL (${file.label})`}
                className="hud-hover group flex items-center gap-2 rounded-none border border-transparent bg-code-bg px-2 py-1.5 text-left transition-colors"
              >
                <span className="shrink-0 rounded-none bg-surface px-1.5 py-0.5 text-[10px] uppercase tracking-[0.2em] text-text">
                  {file.label}
                </span>
                <code className="min-w-0 flex-1 truncate font-mono text-[11px] text-heading">
                  {url}
                </code>
                <span
                  aria-hidden
                  className="shrink-0 text-[10px] uppercase tracking-[0.2em] text-text transition-colors group-hover:text-hud-accent"
                >
                  copiar
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * Panel de documentos descargables de marca: imagen social, firma e icono
 * de perfil. Cada tarjeta previsualiza el asset y ofrece sus formatos.
 */
export function DocumentsPanel() {
  return (
    <div className="flex flex-col gap-4">
      <p className="rounded-none border border-border bg-code-bg px-3 py-2 text-[13px] font-light text-text">
        Todos los assets son archivos estáticos y públicos. Copiá la URL de
        cualquier formato y usala directo desde otra app (por ejemplo tu
        portfolio) en un <code className="text-accent">&lt;img src&gt;</code>,{" "}
        <code className="text-accent">og:image</code> o{" "}
        <code className="text-accent">&lt;link rel="icon"&gt;</code>.
      </p>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {assets.map((asset) => (
          <AssetCard key={asset.name} asset={asset} />
        ))}
      </div>
    </div>
  );
}
