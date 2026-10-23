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
    previewBg: "dark",
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
    <div className="flex flex-col overflow-hidden rounded-card border border-border bg-surface">
      <div
        className="flex h-40 w-full items-center justify-center border-b border-border p-6"
        style={{
          background: asset.previewBg === "dark" ? "#181818" : "#ededed",
        }}
      >
        <img
          src={publicUrl(preview.file)}
          alt={asset.name}
          className="max-h-full max-w-full object-contain"
          loading="lazy"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-medium text-heading">{asset.name}</h3>
          <p className="text-[13px] leading-snug text-text">
            {asset.description}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {asset.files.map((file) => (
            <button
              key={file.downloadName}
              type="button"
              onClick={() => downloadFile(file)}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-bg px-2.5 py-1.5 text-xs font-medium text-text transition-colors hover:border-accent-border hover:text-accent"
            >
              <span aria-hidden>↓</span>
              {file.label}
            </button>
          ))}
        </div>

        {/* URLs públicas para consumir el asset desde otras apps (portfolio). */}
        <div className="mt-auto flex flex-col gap-1.5 border-t border-border pt-3">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-text">
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
                className="group flex items-center gap-2 rounded-md bg-code-bg px-2 py-1.5 text-left transition-colors hover:bg-accent-bg/50"
              >
                <span className="shrink-0 rounded bg-surface px-1.5 py-0.5 font-mono text-[10px] text-text">
                  {file.label}
                </span>
                <code className="min-w-0 flex-1 truncate font-mono text-[11px] text-heading">
                  {url}
                </code>
                <span
                  aria-hidden
                  className="shrink-0 text-[11px] text-text transition-colors group-hover:text-accent"
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
      <p className="rounded-md border border-border bg-code-bg px-3 py-2 text-[13px] text-text">
        Todos los assets son archivos estáticos y públicos. Copiá la URL de
        cualquier formato y usala directo desde otra app (por ejemplo tu
        portfolio) en un <code className="text-accent">&lt;img src&gt;</code>,{" "}
        <code className="text-accent">og:image</code> o{" "}
        <code className="text-accent">&lt;link rel="icon"&gt;</code>.
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {assets.map((asset) => (
          <AssetCard key={asset.name} asset={asset} />
        ))}
      </div>
    </div>
  );
}
