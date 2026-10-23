/**
 * Configuración central de SEO compartida entre proyectos (portfolio + librería).
 *
 * Esta es la ÚNICA pieza que cambia por proyecto. El resto del componente <Seo />
 * es idéntico en ambos repos para mantener el head/SEO uniforme.
 *
 * Marca de títulos de pestaña: `MATI | <SECCIÓN>`.
 */

export const BRAND = "MATI";

/** Nombre de la persona/autor para meta author, OG site_name y JSON-LD. */
export const AUTHOR = "Matías Chaparro";

/**
 * Config propia de ESTE proyecto (la librería de componentes).
 * En el portfolio el equivalente vive en el i18n (head.*), aquí lo dejamos explícito.
 */
export const SEO = {
  // -> título de pestaña: "MATI | COMPONENTS"
  section: "COMPONENTS",

  // Título usado en OG/Twitter (puede ser más descriptivo que el <title>).
  ogTitle: "Matías Chaparro | Librería de componentes",

  description:
    "Librería de componentes genéricos para desarrollo, creada por Matías Chaparro.",

  // URL canónica de producción de ESTE sitio.
  // La librería se sirve bajo el subpath /components en mati-dev.cl.
  siteUrl: "https://mati-dev.cl/components",

  // Imagen Open Graph (1200x630 recomendado).
  // Servida desde public/ bajo el base path /components/.
  ogImage: "https://mati-dev.cl/components/mati-social.png",

  ogImageAlt: "Matías Chaparro — Librería de componentes",

  locale: "es_ES",

  themeColor: "#181818",
} as const;
