import type { ReactNode } from "react";

/** Describe una prop de un componente para mostrar su interface. */
export interface PropDef {
  /** Nombre de la prop. */
  name: string;
  /** Tipo TypeScript (como string legible). */
  type: string;
  /** Valor por defecto, si aplica. */
  default?: string;
  /** Si la prop es obligatoria. */
  required?: boolean;
  /** Descripción corta de la prop. */
  description?: string;
}

/** Una variante seleccionable dentro de una demo. */
export interface DemoVariant {
  /** Etiqueta mostrada en el selector vertical. */
  label: string;
  /** Preview en vivo de esta variante. */
  preview: ReactNode;
  /** Código correspondiente a esta variante. */
  code: string;
}

/** Una demo de un componente dentro del registry. */
export interface ComponentDemo {
  /** Título de la demo (ej: "Variantes", "Tamaños"). */
  title: string;
  /** Preview único (demo simple). Usar esto o `variants`. */
  preview?: ReactNode;
  /** Código del preview único. */
  code?: string;
  /**
   * Variantes seleccionables. Si se define, ComponentPreview muestra un
   * selector vertical a la izquierda (carrusel si hay más de 5).
   */
  variants?: DemoVariant[];
}

/** Un archivo fuente adicional del componente (ej: su CSS Module). */
export interface SourceFile {
  /** Ruta/nombre del archivo. */
  filePath: string;
  /** Contenido del archivo. */
  code: string;
  /** Lenguaje para la etiqueta del bloque de código. */
  language?: string;
}

/** Entrada completa de un componente en el registry. */
export interface RegistryEntry {
  /** Identificador único (slug) usado en la URL/hash. */
  slug: string;
  /** Nombre visible del componente. */
  name: string;
  /** Descripción corta de para qué sirve. */
  description: string;
  /** Categoría para agrupar en la navegación. */
  category: string;
  /** Código fuente completo del componente (para copiar y pegar). */
  source: string;
  /** Ruta sugerida donde pegar el archivo. */
  filePath: string;
  /** Archivos extra que acompañan al componente (ej: CSS Modules). */
  extraFiles?: SourceFile[];
  /** Dependencias npm que requiere el componente. */
  dependencies?: string[];
  /** Interface de props del componente. */
  props: PropDef[];
  /** Demos en vivo con su código. */
  demos: ComponentDemo[];
}
