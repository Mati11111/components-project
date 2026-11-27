import {
  colorTokens,
  paletteColors,
  type ColorToken,
  type PaletteColor,
} from "@/registry/colors";
import { toast } from "@/components/ui/toast";

async function copyValue(value: string, label: string) {
  try {
    await navigator.clipboard.writeText(value);
    toast.success("Copiado", { description: `${label}: ${value}` });
  } catch {
    toast.error("No se pudo copiar");
  }
}

function TokenSwatch({ token }: { token: ColorToken }) {
  return (
    <button
      type="button"
      onClick={() => copyValue(`var(${token.cssVar})`, token.name)}
      className="group flex flex-col overflow-hidden rounded-none border border-border bg-surface text-left transition-colors hud-hover"
    >
      <span
        className="h-20 w-full border-b border-border"
        style={{ background: `var(${token.cssVar})` }}
      />
      <span className="flex flex-col gap-1 p-3">
        <span className="flex items-center justify-between">
          <span className="text-sm font-normal text-heading">{token.name}</span>
          <span className="hud-label text-text transition-colors group-hover:text-hud-accent">
            copiar var
          </span>
        </span>
        <code className="font-mono text-xs text-accent">{token.cssVar}</code>
        <span className="flex gap-2 font-mono text-xs text-text">
          <span title="Modo claro">◻ {token.light}</span>
          <span title="Modo oscuro">◼ {token.dark}</span>
        </span>
        <span className="text-xs text-text">{token.usage}</span>
      </span>
    </button>
  );
}

function PaletteSwatch({ color }: { color: PaletteColor }) {
  return (
    <button
      type="button"
      onClick={() => copyValue(color.hex, color.name)}
      className="group flex flex-col overflow-hidden rounded-none border border-border bg-surface text-left transition-colors hud-hover"
    >
      <span
        className="h-20 w-full border-b border-border"
        style={{ background: color.hex }}
      />
      <span className="flex flex-col gap-1 p-3">
        <span className="flex items-center justify-between">
          <span className="text-sm font-normal text-heading">{color.name}</span>
          <span className="hud-label text-text transition-colors group-hover:text-hud-accent">
            copiar hex
          </span>
        </span>
        <code className="font-mono text-[13px] uppercase text-heading">
          {color.hex}
        </code>
        <code className="font-mono text-xs text-accent">{color.cssVar}</code>
        <span className="text-xs text-text">{color.usage}</span>
      </span>
    </button>
  );
}

export interface ColorPaletteProps {
  /** Tokens semánticos a mostrar. Por defecto usa toda la paleta del sistema. */
  tokens?: ColorToken[];
  /** Colores base a mostrar. Por defecto los 6 de la plataforma. */
  palette?: PaletteColor[];
}

export function ColorPalette({
  tokens = colorTokens,
  palette = paletteColors,
}: ColorPaletteProps) {
  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <h3 className="hud-label text-text">
            Paleta base
          </h3>
          <p className="text-sm text-text">
            Los 6 colores de la plataforma. Hex fijos; clic para copiar.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {palette.map((color) => (
            <PaletteSwatch key={color.cssVar} color={color} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <h3 className="hud-label text-text">
            Tokens del tema
          </h3>
          <p className="text-sm text-text">
            Variables semánticas que cambian entre light y dark. Clic para
            copiar su <code className="text-heading">var()</code>.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {tokens.map((token) => (
            <TokenSwatch key={token.cssVar} token={token} />
          ))}
        </div>
      </section>
    </div>
  );
}
