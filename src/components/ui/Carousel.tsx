import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type CarouselOrientation = "horizontal" | "vertical";

export interface CarouselProps {
  /** Elementos a paginar/scrollear. */
  items: ReactNode[];
  /** Dirección del desplazamiento. */
  orientation?: CarouselOrientation;
  /** Cuántos elementos se muestran por página (solo horizontal, default 1). */
  itemsPerPage?: number;
  /** Alto del viewport cuando es vertical (clase o valor CSS). */
  size?: number | string;
  /** Muestra los indicadores de página (solo horizontal, default true). */
  showIndicators?: boolean;
  /** Muestra las flechas de navegación (solo horizontal, default true). */
  showArrows?: boolean;
  /** Clase extra para el contenedor. */
  className?: string;
}

/**
 * Carrusel con dos modos:
 * - Horizontal: paginación por grupos de `itemsPerPage`, con flechas e indicadores.
 * - Vertical: scroll con snap, el elemento centrado se ve nítido y los vecinos
 *   asoman arriba/abajo más opacos para que visualmente quede uno solo centrado.
 */
export function Carousel({
  items,
  orientation = "horizontal",
  itemsPerPage = 1,
  size,
  showIndicators = true,
  showArrows = true,
  className,
}: CarouselProps) {
  if (orientation === "vertical") {
    return <VerticalCarousel items={items} size={size} className={className} />;
  }

  return (
    <HorizontalCarousel
      items={items}
      itemsPerPage={itemsPerPage}
      showIndicators={showIndicators}
      showArrows={showArrows}
      className={className}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Vertical: scroll con snap y centrado                                        */
/* -------------------------------------------------------------------------- */

function VerticalCarousel({
  items,
  size,
  className,
}: {
  items: ReactNode[];
  size?: number | string;
  className?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  // Relleno arriba/abajo = mitad del viewport menos la mitad de un item,
  // para que el primero y el último puedan quedar exactamente centrados.
  const [pad, setPad] = useState(0);

  // Solo los items reales llevan [data-index]; los spacers quedan afuera.
  const getItemEls = (container: HTMLElement) =>
    Array.from(
      container.querySelectorAll<HTMLElement>("[data-index]"),
    );

  // Recalcula el relleno a partir del alto real del primer item.
  const recomputePad = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;
    const first = getItemEls(container)[0];
    if (!first) return;
    const next = Math.max(
      0,
      container.clientHeight / 2 - first.offsetHeight / 2,
    );
    setPad(next);
  }, []);

  useEffect(() => {
    recomputePad();
    const container = scrollRef.current;
    if (!container) return;
    const ro = new ResizeObserver(() => recomputePad());
    ro.observe(container);
    const first = getItemEls(container)[0];
    if (first) ro.observe(first);
    return () => ro.disconnect();
  }, [recomputePad, items.length]);

  // Atrapa el scroll de la rueda mientras el puntero está dentro: el delta se
  // aplica al scroll interno y no se propaga a la página (listener no pasivo).
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let snapTimer: number | undefined;

    const snapToClosest = () => {
      const center = container.scrollTop + container.clientHeight / 2;
      let closest: HTMLElement | undefined;
      let min = Infinity;
      getItemEls(container).forEach((child) => {
        const childCenter = child.offsetTop + child.offsetHeight / 2;
        const dist = Math.abs(childCenter - center);
        if (dist < min) {
          min = dist;
          closest = child;
        }
      });
      if (!closest) return;
      const target =
        closest.offsetTop - (container.clientHeight - closest.offsetHeight) / 2;
      container.scrollTo({ top: target, behavior: "smooth" });
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const max = container.scrollHeight - container.clientHeight;
      // Escritura instantánea y clampeada: el scroll se siente fluido,
      // sin pelearse con scroll-smooth ni con el snap durante el gesto.
      container.scrollTop = Math.max(
        0,
        Math.min(max, container.scrollTop + e.deltaY),
      );
      // Al terminar de scrollear, acomoda el item más cercano al centro.
      window.clearTimeout(snapTimer);
      snapTimer = window.setTimeout(snapToClosest, 120);
    };

    container.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", onWheel);
      window.clearTimeout(snapTimer);
    };
  }, []);

  // Detecta el item más cercano al centro del viewport al scrollear.
  const handleScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;
    const center = container.scrollTop + container.clientHeight / 2;
    let closest = 0;
    let min = Infinity;
    getItemEls(container).forEach((child) => {
      const i = Number(child.dataset.index);
      const childCenter = child.offsetTop + child.offsetHeight / 2;
      const dist = Math.abs(childCenter - center);
      if (dist < min) {
        min = dist;
        closest = i;
      }
    });
    setActive(closest);
  }, []);

  useEffect(() => {
    handleScroll();
  }, [handleScroll, items.length]);

  // Centra el item clickeado con scroll suave.
  const centerItem = useCallback((index: number) => {
    const container = scrollRef.current;
    if (!container) return;
    const child = container.querySelector<HTMLElement>(
      `[data-index="${index}"]`,
    );
    if (!child) return;
    const target =
      child.offsetTop - (container.clientHeight - child.offsetHeight) / 2;
    container.scrollTo({ top: target, behavior: "smooth" });
  }, []);

  return (
    <div className={cn("relative", className)}>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="no-scrollbar flex flex-col items-center overflow-y-auto"
        style={{
          height: size,
          maxHeight: size,
          paddingTop: pad,
          paddingBottom: pad,
        }}
      >
        {items.map((item, i) => {
          const isActive = i === active;
          return (
            <div
              key={i}
              data-index={i}
              onClick={() => centerItem(i)}
              className={cn(
                "flex w-full shrink-0 cursor-pointer items-center justify-center",
                "-my-3 transition-all duration-300 ease-out",
                isActive
                  ? "z-10 scale-105 opacity-100"
                  : "z-0 scale-90 opacity-40",
              )}
            >
              {item}
            </div>
          );
        })}
      </div>

      {/* degradados para reforzar el foco en el centro */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-bg to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-bg to-transparent"
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Horizontal: paginación por grupos con flechas e indicadores                 */
/* -------------------------------------------------------------------------- */

function HorizontalCarousel({
  items,
  itemsPerPage,
  showIndicators,
  showArrows,
  className,
}: {
  items: ReactNode[];
  itemsPerPage: number;
  showIndicators: boolean;
  showArrows: boolean;
  className?: string;
}) {
  const [page, setPage] = useState(0);
  const perPage = Math.max(1, itemsPerPage);

  const pages = useMemo(() => {
    const chunks: ReactNode[][] = [];
    for (let i = 0; i < items.length; i += perPage) {
      chunks.push(items.slice(i, i + perPage));
    }
    return chunks.length > 0 ? chunks : [[]];
  }, [items, perPage]);

  const totalPages = pages.length;
  const current = Math.min(page, totalPages - 1);

  const prev = () => setPage((p) => Math.max(0, p - 1));
  const next = () => setPage((p) => Math.min(totalPages - 1, p + 1));

  const atStart = current === 0;
  const atEnd = current === totalPages - 1;

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* fila: flecha + viewport + flecha */}
      <div className="flex flex-row items-stretch gap-2">
        {showArrows && (
          <NavButton direction="left" disabled={atStart} onClick={prev} />
        )}

        {/* viewport */}
        <div className="relative flex-1 overflow-hidden">
          <div
            className="flex h-full flex-row transition-transform duration-300 ease-out"
            style={{
              transform: `translateX(-${current * 100}%)`,
            }}
          >
            {pages.map((group, index) => (
              <div
                key={index}
                className="flex h-full w-full shrink-0 flex-row gap-2"
              >
                {group.map((item, i) => (
                  <div
                    key={i}
                    className="flex min-w-0 flex-1 items-center justify-center"
                  >
                    {item}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {showArrows && (
          <NavButton direction="right" disabled={atEnd} onClick={next} />
        )}
      </div>

      {/* paginación debajo */}
      {showIndicators && totalPages > 1 && (
        <div className="flex justify-center gap-1.5">
          {pages.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Ir a la página ${index + 1}`}
              aria-current={index === current}
              onClick={() => setPage(index)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                index === current
                  ? "w-5 bg-accent"
                  : "w-1.5 bg-border hover:bg-accent-border",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function NavButton({
  direction,
  disabled,
  onClick,
}: {
  direction: "left" | "right";
  disabled: boolean;
  onClick: () => void;
}) {
  const glyph = direction === "left" ? "‹" : "›";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={`Página ${direction}`}
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center self-center rounded-full border border-border bg-surface text-text transition-colors",
        "hover:border-accent-border hover:text-accent",
        "disabled:cursor-default disabled:opacity-40 disabled:hover:border-border disabled:hover:text-text",
      )}
    >
      <span aria-hidden className="text-lg leading-none">
        {glyph}
      </span>
    </button>
  );
}
