import { Helmet } from "react-helmet-async";
import { AUTHOR, SEO } from "./seo.config";
import { seoTitle } from "./seoTitle";

export interface SeoProps {
  /** Sección en mayúsculas para el título de pestaña: `MATI | <SECCIÓN>`. */
  section?: string;
  description?: string;
  ogTitle?: string;
  ogImage?: string;
  ogImageAlt?: string;
  siteUrl?: string;
  locale?: string;
  themeColor?: string;
  /** URL del favicon. Por defecto favicon.svg bajo el base path del sitio. */
  favicon?: string;
}

/**
 * Componente SEO reutilizable para proyectos Vite + React.
 *
 * Replica el mismo head/SEO del portfolio (Astro):
 *  - <title> uniforme: "MATI | <SECCIÓN>"
 *  - meta description + author
 *  - canonical
 *  - Open Graph (incluye la imagen social / preview al compartir el link)
 *  - Twitter cards
 *  - JSON-LD (schema.org Person)
 *  - theme-color
 *
 * Los valores por defecto se leen de ./seo.config.ts (único punto a editar).
 * Cualquier prop permite sobrescribir un valor puntual por página.
 *
 * Requiere: `react-helmet-async` y envolver la app en <HelmetProvider>.
 *   npm i react-helmet-async
 *
 *   // main.tsx
 *   import { HelmetProvider } from "react-helmet-async";
 *   root.render(<HelmetProvider><App /></HelmetProvider>);
 */
export default function Seo({
  section = SEO.section,
  description = SEO.description,
  ogTitle = SEO.ogTitle,
  ogImage = SEO.ogImage,
  ogImageAlt = SEO.ogImageAlt,
  siteUrl = SEO.siteUrl,
  locale = SEO.locale,
  themeColor = SEO.themeColor,
  favicon = `${import.meta.env.BASE_URL}favicon.svg?v=2`,
}: SeoProps = {}) {
  const title = seoTitle(section);

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: AUTHOR,
    url: siteUrl,
    image: ogImage,
    jobTitle: "Full-Stack Developer",
    description,
  };

  return (
    <Helmet>
      <html lang={locale.startsWith("es") ? "es" : "en"} />
      <title>{title}</title>

      <meta name="description" content={description} />
      <meta name="author" content={AUTHOR} />

      {/* Canonical */}
      <link rel="canonical" href={siteUrl} />

      {/* Favicon (resuelto bajo el base path, ej. /components/favicon.svg) */}
      <link rel="icon" type="image/svg+xml" href={favicon} />

      {/* Color de UI del navegador móvil */}
      <meta name="theme-color" content={themeColor} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={ogImageAlt} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content={locale} />
      <meta property="og:site_name" content={AUTHOR} />

      {/* Twitter / X Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={ogImageAlt} />

      {/* Datos estructurados */}
      <script type="application/ld+json">
        {JSON.stringify(personSchema)}
      </script>
    </Helmet>
  );
}
