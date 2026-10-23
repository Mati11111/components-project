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
import { PageTitle } from "@/components/ui/PageTitle";
import { ThemeToggle } from "@/react-components";

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
      <h3 className="text-sm font-semibold uppercase tracking-wide text-text">
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
          <h2 className="text-3xl font-medium text-heading">{entry.name}</h2>
          <Badge variant="neutral">{entry.category}</Badge>
          <button
            type="button"
            onClick={() => setCodeOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1 text-xs font-medium text-text transition-colors hover:border-accent-border hover:text-accent"
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
      <header className="flex items-start justify-between gap-4 border-b border-border py-6">
        <PageTitle
          text="Librería de componentes"
          subtitle="Componentes genéricos para desarrollo"
        />
        <ThemeToggle />
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
              className="h-9 w-full rounded-md border border-border bg-bg pl-7 pr-2 text-sm text-heading placeholder:text-text transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-border"
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
                  className="flex items-center justify-between gap-2 rounded-md px-2 py-1 text-xs font-semibold uppercase tracking-wide text-text transition-colors hover:text-heading"
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
                        "rounded-md px-2 py-1.5 text-left text-sm transition-colors",
                        view.kind === "component" && view.slug === entry.slug
                          ? "bg-accent-bg font-medium text-accent"
                          : "text-text hover:bg-accent-bg/50 hover:text-heading",
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
                className="flex items-center justify-between gap-2 rounded-md px-2 py-1 text-xs font-semibold uppercase tracking-wide text-text transition-colors hover:text-heading"
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
                      "rounded-md px-2 py-1.5 text-left text-sm transition-colors",
                      view.kind === item.view.kind
                        ? "bg-accent-bg font-medium text-accent"
                        : "text-text hover:bg-accent-bg/50 hover:text-heading",
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
                <h2 className="text-3xl font-medium text-heading">Colores</h2>
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
                <h2 className="text-3xl font-medium text-heading">Documentos</h2>
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
