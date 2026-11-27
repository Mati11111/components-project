import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { registry } from "@/registry";
import type { RegistryEntry } from "@/registry/types";
import { ComponentPreview } from "@/components/registry/ComponentPreview";
import { PropsTable } from "@/components/registry/PropsTable";
import { ColorPalette } from "@/components/registry/ColorPalette";
import { DocumentsPanel } from "@/components/registry/DocumentsPanel";
import {
  CodeModal,
  type CodeModalFile,
} from "@/components/registry/CodeModal";
import { Badge } from "@/components/ui/Badge";
import { useEffect } from "react";
import { HudSwitch } from "@/components/hud/HudSwitch";

/** Interruptor de tema con estética HUD (LT | DK). Guarda la elección en localStorage. */
function ThemeSwitch() {
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem("theme");
    return (
      stored === "dark" ||
      (stored !== "light" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  // Aplica el tema al documento cada vez que cambia.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.classList.toggle("light", !dark);
  }, [dark]);

  const toggle = () => {
    const next = !dark;
    localStorage.setItem("theme", next ? "dark" : "light");
    setDark(next);
  };

  return (
    <HudSwitch
      label="MODE"
      options={["LT", "DK"]}
      activeIndex={dark ? 1 : 0}
      onToggle={toggle}
      ariaLabel={dark ? "Activar modo claro" : "Activar modo oscuro"}
      checked={dark}
    />
  );
}

type View =
  | { kind: "component"; slug: string }
  | { kind: "colors" }
  | { kind: "documents" };

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="hud-label flex items-center gap-3 text-heading">
        <span aria-hidden className="hud-square" />
        {title}
      </h3>
      {children}
    </section>
  );
}

function ComponentDoc({ entry }: { entry: RegistryEntry }) {
  const [codeOpen, setCodeOpen] = useState(false);

  const files: CodeModalFile[] = [
    {
      filePath: entry.filePath,
      code: entry.source,
      language: "tsx",
    },
    ...(entry.extraFiles ?? []).map((f) => ({
      filePath: f.filePath,
      code: f.code,
      language: f.language ?? "css",
    })),
  ];

  return (
    <article className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-3xl font-light uppercase tracking-[0.08em] text-heading">{entry.name}</h2>
          <Badge variant="neutral">{entry.category}</Badge>
          <button
            type="button"
            onClick={() => setCodeOpen(true)}
            className="hud-label hud-hover inline-flex items-center gap-1.5 rounded-none border border-border bg-surface px-2.5 py-1 text-text transition-colors"
          >
            <span aria-hidden className="font-mono">
              {"</>"}
            </span>
            Ver código
          </button>
        </div>
        <p className="text-text">{entry.description}</p>
        {entry.dependencies && entry.dependencies.length > 0 && (
          <p className="font-mono text-xs text-text">
            npm i {entry.dependencies.join(" ")}
          </p>
        )}
      </header>

      <Section title="Ejemplos">
        <div className="flex flex-col gap-6">
          {entry.demos.map((demo) => (
            <ComponentPreview key={demo.title} demo={demo} />
          ))}
        </div>
      </Section>

      <Section title="Interface (props)">
        <PropsTable props={entry.props} />
      </Section>

      <CodeModal
        open={codeOpen}
        onClose={() => setCodeOpen(false)}
        title={entry.name}
        files={files}
      />
    </article>
  );
}

export function Registry() {
  const [query, setQuery] = useState("");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  // Agrupa por categoría, ordenando alfabéticamente tanto las secciones
  // como los componentes dentro de cada una (locale es, case-insensitive).
  const grouped = useMemo(() => {
    const byName = (a: RegistryEntry, b: RegistryEntry) =>
      a.name.localeCompare(b.name, "es", { sensitivity: "base" });

    const map = new Map<string, RegistryEntry[]>();
    for (const entry of registry) {
      const list = map.get(entry.category) ?? [];
      list.push(entry);
      map.set(entry.category, list);
    }
    return [...map.entries()]
      .map(([category, entries]) => [category, [...entries].sort(byName)] as const)
      .sort((a, b) => a[0].localeCompare(b[0], "es", { sensitivity: "base" }));
  }, []);

  // Filtra por el texto del buscador (nombre, categoría o descripción) y
  // descarta las secciones que quedan sin resultados.
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return grouped;
    return grouped
      .map(
        ([category, entries]) =>
          [
            category,
            entries.filter(
              (e) =>
                e.name.toLowerCase().includes(q) ||
                e.category.toLowerCase().includes(q) ||
                e.description.toLowerCase().includes(q),
            ),
          ] as const,
      )
      .filter(([, entries]) => entries.length > 0);
  }, [grouped, query]);

  const [view, setView] = useState<View>({
    kind: "component",
    slug: registry[0]?.slug ?? "",
  });

  const searching = query.trim().length > 0;

  // Items fijos de la sección "Sistema" (no vienen del registry), ordenados
  // alfabéticamente y filtrados por el buscador.
  const systemItems = useMemo(() => {
    const items: { label: string; view: View }[] = [
      { label: "Colores", view: { kind: "colors" } as View },
      { label: "Documentos", view: { kind: "documents" } as View },
    ].sort((a, b) =>
      a.label.localeCompare(b.label, "es", { sensitivity: "base" }),
    );
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) => i.label.toLowerCase().includes(q));
  }, [query]);

  const systemCollapsed = !searching && collapsed["Sistema"];

  const activeEntry =
    view.kind === "component" ? registry.find((e) => e.slug === view.slug) : undefined;

  function toggleSection(category: string) {
    setCollapsed((prev) => ({ ...prev, [category]: !prev[category] }));
  }

  return (
    <div className="mx-auto flex min-h-svh max-w-6xl flex-col px-4">
      <header className="relative flex items-start justify-between gap-4 border-b border-border px-6 py-10 sm:px-10">
        {/* marcas decorativas HUD */}
        <span aria-hidden className="hud-cross left-2 top-2">+</span>
        <span aria-hidden className="hud-cross hud-cross-accent right-2 top-2">
          +
        </span>
        <span aria-hidden className="hud-cross bottom-2 left-2">+</span>
        <span aria-hidden className="hud-cross bottom-2 right-2">+</span>

        <div className="flex min-w-0 flex-col gap-4">
          <div
            aria-hidden
            className="hud-label flex flex-wrap items-center gap-x-6 gap-y-1 text-text"
          >
            <span className="flex items-center gap-2">
              <span className="hud-square" />
              SYS/MATI · COMPONENTS / SANTIAGO CL
            </span>
            <span>v2026 · ONLINE</span>
            <span className="hud-barcode text-hud-mark" />
          </div>
          <h1 className="text-3xl font-light uppercase tracking-[0.25em] text-heading sm:text-5xl">
            Librería de componentes
          </h1>
          <p className="hud-block self-start text-sm">
            Componentes genéricos para desarrollo
          </p>
        </div>
        <ThemeSwitch />
      </header>

      <div className="flex flex-1 flex-col gap-8 py-8 md:flex-row">
        <aside className="flex shrink-0 flex-col gap-5 md:w-52">
          <div className="relative">
            <span
              aria-hidden
              className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-text"
            >
              ⌕
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar…"
              aria-label="Buscar componentes"
              className="hud-hover h-9 w-full rounded-none border border-border bg-surface pl-7 pr-2 text-sm text-heading placeholder:text-text transition-colors"
            />
          </div>

          {filtered.length === 0 && (
            <p className="px-2 text-sm text-text">Sin resultados.</p>
          )}

          {filtered.map(([category, entries]) => {
            const isCollapsed = !searching && collapsed[category];
            return (
              <nav key={category} className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => toggleSection(category)}
                  aria-expanded={!isCollapsed}
                  className="hud-label flex items-center justify-between gap-2 rounded-none px-2 py-1 text-text transition-colors hover:text-heading"
                >
                  <span>{category}</span>
                  <span
                    aria-hidden
                    className={cn(
                      "text-[10px] transition-transform",
                      isCollapsed ? "" : "rotate-90",
                    )}
                  >
                    ▶
                  </span>
                </button>
                {!isCollapsed &&
                  entries.map((entry) => (
                    <button
                      key={entry.slug}
                      type="button"
                      onClick={() =>
                        setView({ kind: "component", slug: entry.slug })
                      }
                      className={cn(
                        "hud-item rounded-none px-2 py-1.5 text-left text-xs transition-colors",
                        view.kind === "component" && view.slug === entry.slug
                          ? "is-active"
                          : "text-text",
                      )}
                    >
                      {entry.name}
                    </button>
                  ))}
              </nav>
            );
          })}

          {systemItems.length > 0 && (
            <nav className="flex flex-col gap-1 border-t border-border pt-4">
              <button
                type="button"
                onClick={() => toggleSection("Sistema")}
                aria-expanded={!systemCollapsed}
                className="hud-label flex items-center justify-between gap-2 rounded-none px-2 py-1 text-text transition-colors hover:text-heading"
              >
                <span>Sistema</span>
                <span
                  aria-hidden
                  className={cn(
                    "text-[10px] transition-transform",
                    systemCollapsed ? "" : "rotate-90",
                  )}
                >
                  ▶
                </span>
              </button>
              {!systemCollapsed &&
                systemItems.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setView(item.view)}
                    className={cn(
                      "hud-item rounded-none px-2 py-1.5 text-left text-xs transition-colors",
                      view.kind === item.view.kind
                        ? "is-active"
                        : "text-text",
                    )}
                  >
                    {item.label}
                  </button>
                ))}
            </nav>
          )}
        </aside>

        <main className="min-w-0 flex-1">
          {view.kind === "colors" ? (
            <article className="flex flex-col gap-6">
              <header className="flex flex-col gap-2">
                <h2 className="text-3xl font-light uppercase tracking-[0.08em] text-heading">Colores</h2>
                <p className="text-text">
                  La paleta base de 6 colores de la plataforma y los tokens
                  semánticos del tema. Hacé clic en cualquier swatch para
                  copiar su valor.
                </p>
              </header>
              <ColorPalette />
            </article>
          ) : view.kind === "documents" ? (
            <article className="flex flex-col gap-6">
              <header className="flex flex-col gap-2">
                <h2 className="text-3xl font-light uppercase tracking-[0.08em] text-heading">Documentos</h2>
                <p className="text-text">
                  Assets de marca para descargar: la imagen social, la firma y
                  el icono de perfil. Descargá el formato que necesites.
                </p>
              </header>
              <DocumentsPanel />
            </article>
          ) : activeEntry ? (
            <ComponentDoc entry={activeEntry} />
          ) : (
            <p className="text-text">Seleccioná un componente.</p>
          )}
        </main>
      </div>
    </div>
  );
}
