/** Token de color del sistema de diseño. */
export interface ColorToken {
  /** Nombre legible del token. */
  name: string;
  /** Variable CSS que lo expone. */
  cssVar: string;
  /** Clase Tailwind asociada (si aplica). */
  tailwind?: string;
  /** Valor en modo claro. */
  light: string;
  /** Valor en modo oscuro. */
  dark: string;
  /** Descripción de uso. */
  usage: string;
}

/** Un color crudo de la paleta base (no cambia entre temas). */
export interface PaletteColor {
  /** Nombre legible. */
  name: string;
  /** Valor hex. */
  hex: string;
  /** Variable CSS que lo expone. */
  cssVar: string;
  /** Clase Tailwind asociada. */
  tailwind: string;
  /** Dónde se usa. */
  usage: string;
}

/**
 * Los 6 colores base de la plataforma "dark terminal".
 * Son valores fijos; los temas los combinan de distinta forma.
 */
export const paletteColors: PaletteColor[] = [
  {
    name: "Black",
    hex: "#181818",
    cssVar: "--c-black",
    tailwind: "bg-palette-black",
    usage: "Negro casi puro: fondo principal (dark) y texto (light).",
  },
  {
    name: "Light",
    hex: "#dddddd",
    cssVar: "--c-light",
    tailwind: "bg-palette-light",
    usage: "Gris claro: texto (dark), fondo claro y presentación.",
  },
  {
    name: "Light 2",
    hex: "#d6d6d7",
    cssVar: "--c-light-2",
    tailwind: "bg-palette-light-2",
    usage: "Gris claro de barras: borde secundario y dot-bar.",
  },
  {
    name: "Dark",
    hex: "#202124",
    cssVar: "--c-dark",
    tailwind: "bg-palette-dark",
    usage: "Gris muy oscuro: superficies/variant y fondo de puntos.",
  },
  {
    name: "Selected",
    hex: "#323639",
    cssVar: "--c-selected",
    tailwind: "bg-palette-selected",
    usage: "Gris oscuro: estado seleccionado y cursor.",
  },
  {
    name: "Variant",
    hex: "#424242",
    cssVar: "--c-variant",
    tailwind: "bg-palette-variant",
    usage: "Gris medio: relleno de barras y bordes.",
  },
];

/**
 * Tokens semánticos del sistema. Los valores reflejan los definidos
 * en src/index.css (tema light default y tema dark por clase .dark).
 */
export const colorTokens: ColorToken[] = [
  {
    name: "Background",
    cssVar: "--bg",
    tailwind: "bg-bg",
    light: "#ffffff",
    dark: "#181818",
    usage: "Fondo principal de la página.",
  },
  {
    name: "Surface",
    cssVar: "--surface",
    tailwind: "bg-surface",
    light: "#f4f4f4",
    dark: "#202124",
    usage: "Fondo de tarjetas y superficies elevadas.",
  },
  {
    name: "Text",
    cssVar: "--text",
    tailwind: "text-text",
    light: "#181818",
    dark: "#dddddd",
    usage: "Color de texto base.",
  },
  {
    name: "Heading",
    cssVar: "--text-h",
    tailwind: "text-heading",
    light: "#181818",
    dark: "#dddddd",
    usage: "Títulos y texto de alto contraste.",
  },
  {
    name: "Border",
    cssVar: "--border",
    tailwind: "border-border",
    light: "#d6d6d7",
    dark: "#424242",
    usage: "Bordes y divisores.",
  },
  {
    name: "Code BG",
    cssVar: "--code-bg",
    tailwind: "bg-code-bg",
    light: "#f0f0f0",
    dark: "#202124",
    usage: "Fondo de bloques y chips de código.",
  },
  {
    name: "Accent",
    cssVar: "--accent",
    tailwind: "text-accent / bg-accent",
    light: "#181818",
    dark: "#dddddd",
    usage: "Color de marca para acciones primarias.",
  },
  {
    name: "Accent BG",
    cssVar: "--accent-bg",
    tailwind: "bg-accent-bg",
    light: "rgba(24, 24, 24, 0.08)",
    dark: "rgba(221, 221, 221, 0.1)",
    usage: "Fondo suave para estados y badges de acento.",
  },
  {
    name: "Accent Border",
    cssVar: "--accent-border",
    tailwind: "border-accent-border",
    light: "rgba(24, 24, 24, 0.35)",
    dark: "#d6d6d7",
    usage: "Bordes de elementos con acento en hover/focus.",
  },
];
