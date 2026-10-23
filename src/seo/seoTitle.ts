import { BRAND } from "./seo.config";

/**
 * Construye el título de la pestaña del navegador con el formato uniforme:
 *   `MATI | PORTFOLIO`, `MATI | COMPONENTS`, ...
 *
 * @param section - Sección en mayúsculas (ej. "COMPONENTS", "PORTFOLIO").
 * @returns título formateado.
 */
export function seoTitle(section: string): string {
  const safe = (section || "").trim().toUpperCase();
  return safe ? `${BRAND} | ${safe}` : BRAND;
}
