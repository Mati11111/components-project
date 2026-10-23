import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { registry } from "@/registry";
import type { RegistryEntry } from "@/registry/types";
import { ComponentPreview } from "@/components/registry/ComponentPreview";
import { PropsTable } from "@/components/registry/PropsTable";
import { ColorPalette } from "@/components/registry/ColorPalette";
import {
  CodeModal,
  type CodeModalFile,
} from "@/components/registry/CodeModal";
import { Badge } from "@/components/ui/Badge";
import { PageTitle } from "@/components/ui/PageTitle";
import { ThemeToggle } from "@/react-components";

type View = { kind: "component"; slug: string } | { kind: "colors" };

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
  const [view, setView] = useState<View>({
    kind: "component",
    slug: registry[0]?.slug ?? "",
  });

  const grouped = useMemo(() => {
    const map = new Map<string, RegistryEntry[]>();
    for (const entry of registry) {
      const list = map.get(entry.category) ?? [];
      list.push(entry);
      map.set(entry.category, list);
    }
    return [...map.entries()];
  }, []);

  const activeEntry =
    view.kind === "component" ? registry.find((e) => e.slug === view.slug) : undefined;

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
          {grouped.map(([category, entries]) => (
            <nav key={category} className="flex flex-col gap-1">
              <span className="px-2 text-xs font-semibold uppercase tracking-wide text-text">
                {category}
              </span>
              {entries.map((entry) => (
                <button
                  key={entry.slug}
                  type="button"
                  onClick={() => setView({ kind: "component", slug: entry.slug })}
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
          ))}

          <nav className="flex flex-col gap-1 border-t border-border pt-4">
            <span className="px-2 text-xs font-semibold uppercase tracking-wide text-text">
              Sistema
            </span>
            <button
              type="button"
              onClick={() => setView({ kind: "colors" })}
              className={cn(
                "rounded-md px-2 py-1.5 text-left text-sm transition-colors",
                view.kind === "colors"
                  ? "bg-accent-bg font-medium text-accent"
                  : "text-text hover:bg-accent-bg/50 hover:text-heading",
              )}
            >
              Colores
            </button>
          </nav>
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
