import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import type { ComponentDemo, DemoVariant } from "@/registry/types";
import { CodeBlock } from "@/components/registry/CodeBlock";
import { Carousel } from "@/components/ui/Carousel";

export interface ComponentPreviewProps {
  /** Demo a renderizar (preview + código, o variantes seleccionables). */
  demo: ComponentDemo;
}

type Tab = "preview" | "code";

/** Si el selector tiene más de este número de variantes, se vuelve carrusel. */
const CAROUSEL_THRESHOLD = 5;

export function ComponentPreview({ demo }: ComponentPreviewProps) {
  const [tab, setTab] = useState<Tab>("preview");
  const [activeVariant, setActiveVariant] = useState(0);

  // normaliza: una demo simple se trata como una única "variante" sin selector.
  const variants: DemoVariant[] = useMemo(() => {
    if (demo.variants && demo.variants.length > 0) return demo.variants;
    return [
      {
        label: demo.title,
        preview: demo.preview,
        code: demo.code ?? "",
      },
    ];
  }, [demo]);

  const hasSelector = (demo.variants?.length ?? 0) > 1;
  const current = variants[Math.min(activeVariant, variants.length - 1)];

  const selectorButtons = variants.map((variant, index) => (
    <button
      key={variant.label}
      type="button"
      onClick={() => setActiveVariant(index)}
      className={cn(
        "w-full rounded-md px-3 py-1.5 text-left text-sm transition-colors",
        index === activeVariant
          ? "bg-accent-bg font-medium text-accent"
          : "text-text hover:bg-accent-bg/50 hover:text-heading",
      )}
    >
      {variant.label}
    </button>
  ));

  const useCarousel = variants.length > CAROUSEL_THRESHOLD;

  return (
    <div className="flex flex-col gap-2">
      {demo.title && (
        <h4 className="text-sm font-medium text-heading">{demo.title}</h4>
      )}

      <div className="overflow-hidden rounded-card border border-border">
        <div className="flex gap-1 border-b border-border bg-surface p-1.5">
          {(["preview", "code"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                "rounded-md px-3 py-1 text-sm font-medium transition-colors",
                tab === t
                  ? "bg-accent-bg text-accent"
                  : "text-text hover:text-heading",
              )}
            >
              {t === "preview" ? "Preview" : "Código"}
            </button>
          ))}
        </div>

        {tab === "preview" ? (
          <div className="flex">
            {/* selector vertical de variantes */}
            {hasSelector && (
              <div className="w-40 shrink-0 border-r border-border bg-surface p-2">
                {useCarousel ? (
                  <Carousel
                    orientation="vertical"
                    itemsPerPage={CAROUSEL_THRESHOLD}
                    size={CAROUSEL_THRESHOLD * 38}
                    showIndicators={false}
                    items={selectorButtons}
                  />
                ) : (
                  <div className="flex flex-col gap-1">{selectorButtons}</div>
                )}
              </div>
            )}

            {/* preview de la variante activa */}
            <div className="flex min-h-[160px] flex-1 flex-wrap items-center justify-center gap-4 bg-bg p-8">
              {current?.preview}
            </div>
          </div>
        ) : (
          <CodeBlock code={current?.code ?? ""} className="rounded-none border-0" />
        )}
      </div>
    </div>
  );
}
