import type { RegistryEntry } from "@/registry/types";
import {
  Header,
  Terminal,
  Bars,
  Footer,
  Experience,
  ThemeToggle,
} from "@/react-components";
import { DEFAULT_TERMINAL_LINES } from "@/react-components";

// Código fuente real importado como texto (Vite `?raw`): lo que se muestra
// y copia siempre coincide con el archivo del repo.
import headerSource from "@/react-components/Header/Header.tsx?raw";
import headerCss from "@/react-components/Header/Header.module.css?raw";
import terminalSource from "@/react-components/Terminal/Terminal.tsx?raw";
import terminalCss from "@/react-components/Terminal/Terminal.module.css?raw";
import barsSource from "@/react-components/Bars/Bars.tsx?raw";
import barsCss from "@/react-components/Bars/Bars.module.css?raw";
import footerSource from "@/react-components/Footer/Footer.tsx?raw";
import footerCss from "@/react-components/Footer/Footer.module.css?raw";
import experienceSource from "@/react-components/Experience/Experience.tsx?raw";
import experienceCss from "@/react-components/Experience/Experience.module.css?raw";
import themeToggleSource from "@/react-components/ThemeToggle/ThemeToggle.tsx?raw";
import themeToggleCss from "@/react-components/ThemeToggle/ThemeToggle.module.css?raw";

/** Marco oscuro para previsualizar los componentes "dark terminal". */
function DarkStage({
  children,
  height,
  padded,
  dotted = true,
}: {
  children: React.ReactNode;
  height?: number | string;
  padded?: boolean;
  /** Fondo punteado tipo terminal. Activado por defecto. */
  dotted?: boolean;
}) {
  return (
    <div
      className={`w-full overflow-hidden rounded-lg bg-[#202124] text-[#dddddd] ${
        padded ? "p-5" : ""
      }`}
      style={{
        height,
        ...(dotted
          ? {
              // fondo punteado tipo "terminal" (igual al portfolio real)
              backgroundImage:
                "radial-gradient(rgba(221,221,221,0.12) 1px, transparent 1px)",
              backgroundSize: "16px 16px",
              backgroundPosition: "center",
            }
          : {}),
      }}
    >
      {children}
    </div>
  );
}

export const portfolioRegistry: RegistryEntry[] = [
  {
    slug: "header",
    name: "Header",
    description:
      "Intro animada: un prompt parpadea, se desliza y revela el nombre.",
    category: "Portfolio",
    filePath: "src/react-components/Header/Header.tsx",
    extraFiles: [
      {
        filePath: "src/react-components/Header/Header.module.css",
        code: headerCss,
        language: "css",
      },
    ],
    dependencies: [],
    source: headerSource,
    props: [
      {
        name: "name",
        type: "string",
        default: '"MATI"',
        description: "Nombre revelado tras la animación del prompt.",
      },
      {
        name: "decoration",
        type: "string",
        default: '"</>"',
        description: "Decoración mostrada junto al nombre.",
      },
      {
        name: "className",
        type: "string",
        description: "Clase extra para el elemento raíz.",
      },
    ],
    demos: [
      {
        title: "Animación de intro",
        preview: (
          <DarkStage height={220} dotted={false}>
            <Header name="MATI" decoration="</>" />
          </DarkStage>
        ),
        code: `import { Header } from "@/react-components";

<Header name="MATI" decoration="</>" />`,
      },
    ],
  },
  {
    slug: "terminal",
    name: "Terminal",
    description:
      "Terminal con efecto typewriter línea por línea y revelado al hacer scroll.",
    category: "Portfolio",
    filePath: "src/react-components/Terminal/Terminal.tsx",
    extraFiles: [
      {
        filePath: "src/react-components/Terminal/Terminal.module.css",
        code: terminalCss,
        language: "css",
      },
    ],
    dependencies: [],
    source: terminalSource,
    props: [
      {
        name: "title",
        type: "string",
        required: true,
        description: "Título de la barra superior.",
      },
      {
        name: "lines",
        type: "TerminalLine[]",
        required: true,
        description: "Líneas (command u output) a animar.",
      },
      {
        name: "animated",
        type: "boolean",
        default: "true",
        description: "Anima la secuencia; false renderiza todo al instante.",
      },
      {
        name: "startDelay",
        type: "number",
        default: "0",
        description: "Retardo en ms antes de arrancar la animación.",
      },
      {
        name: "onComplete",
        type: "() => void",
        description: "Callback al terminar toda la secuencia.",
      },
      {
        name: "className",
        type: "string",
        description: "Clase extra para el elemento raíz.",
      },
    ],
    demos: [
      {
        title: "Secuencia por defecto",
        preview: (
          <DarkStage padded>
            <Terminal
              title="portfolio@localhost"
              lines={DEFAULT_TERMINAL_LINES}
            />
          </DarkStage>
        ),
        code: `import { Terminal, DEFAULT_TERMINAL_LINES } from "@/react-components";

<Terminal title="portfolio@localhost" lines={DEFAULT_TERMINAL_LINES} />`,
      },
    ],
  },
  {
    slug: "bars",
    name: "Bars",
    description:
      "Barras de experiencia por framework con tabla ordenable y paginación.",
    category: "Portfolio",
    filePath: "src/react-components/Bars/Bars.tsx",
    extraFiles: [
      {
        filePath: "src/react-components/Bars/Bars.module.css",
        code: barsCss,
        language: "css",
      },
    ],
    dependencies: [],
    source: barsSource,
    props: [
      {
        name: "experiences",
        type: "ExperienceSection[]",
        default: "DEFAULT_EXPERIENCES",
        description: "Secciones con frameworks y sus detalles.",
      },
      {
        name: "careers",
        type: "ExperienceSection[]",
        default: "[]",
        description: "Secciones de carrera adicionales.",
      },
      {
        name: "projects",
        type: "ExperienceSection[]",
        default: "DEFAULT_PROJECTS",
        description: "Secciones de proyectos; projects[0] define los headers.",
      },
      {
        name: "headers",
        type: "FrameworkHeader[]",
        default: "DEFAULT_HEADERS",
        description: "Encabezados de la tabla.",
      },
      {
        name: "className",
        type: "string",
        description: "Clase extra para el elemento raíz.",
      },
    ],
    demos: [
      {
        title: "Datos de demo",
        preview: (
          <DarkStage height={420} padded>
            <Bars />
          </DarkStage>
        ),
        code: `import { Bars } from "@/react-components";

<Bars />`,
      },
    ],
  },
  {
    slug: "footer",
    name: "Footer",
    description:
      "Footer con links sociales, copiar email al portapapeles y revelado al scroll.",
    category: "Portfolio",
    filePath: "src/react-components/Footer/Footer.tsx",
    extraFiles: [
      {
        filePath: "src/react-components/Footer/Footer.module.css",
        code: footerCss,
        language: "css",
      },
    ],
    dependencies: [],
    source: footerSource,
    props: [
      {
        name: "githubUrl",
        type: "string",
        description: "URL del perfil de GitHub.",
      },
      {
        name: "linkedinUrl",
        type: "string",
        description: "URL del perfil de LinkedIn.",
      },
      {
        name: "email",
        type: "string",
        description: "Email que se copia al portapapeles.",
      },
      {
        name: "signText",
        type: "string",
        description: "Texto de firma mostrado en el footer.",
      },
      {
        name: "year",
        type: "number",
        default: "new Date().getFullYear()",
        description: "Año del copyright.",
      },
      {
        name: "className",
        type: "string",
        description: "Clase extra para el elemento raíz.",
      },
    ],
    demos: [
      {
        title: "Footer completo",
        preview: (
          <DarkStage height={180} padded>
            <div className="flex h-full items-center justify-center">
              <Footer signText="Designed & Developed by Matías Chaparro" />
            </div>
          </DarkStage>
        ),
        code: `import { Footer } from "@/react-components";

<Footer signText="Designed & Developed by Matías Chaparro" />`,
      },
    ],
  },
  {
    slug: "experience",
    name: "Experience",
    description:
      "Explorador maestro-detalle de experiencia: categorías, ítems y panel de detalle.",
    category: "Portfolio",
    filePath: "src/react-components/Experience/Experience.tsx",
    extraFiles: [
      {
        filePath: "src/react-components/Experience/Experience.module.css",
        code: experienceCss,
        language: "css",
      },
    ],
    dependencies: [],
    source: experienceSource,
    props: [
      {
        name: "title",
        type: "string",
        default: '"portfolio@localhost ~/documents/work_experience"',
        description: "Título de la barra superior.",
      },
      {
        name: "path",
        type: "string",
        default: '"portfolio@localhost:~/documents/work_experience"',
        description: "Ruta mostrada sobre las columnas.",
      },
      {
        name: "categories",
        type: "ExperienceCategory[]",
        default: "DEFAULT_EXPERIENCE_CATEGORIES",
        description: "Categorías con sus ítems (columna izquierda).",
      },
      {
        name: "className",
        type: "string",
        description: "Clase extra para el elemento raíz.",
      },
    ],
    demos: [
      {
        title: "Maestro-detalle",
        preview: (
          <DarkStage height={420} padded>
            <Experience />
          </DarkStage>
        ),
        code: `import { Experience } from "@/react-components";

<Experience />`,
      },
    ],
  },
  {
    slug: "theme-toggle",
    name: "ThemeToggle",
    description:
      "Botón sol/luna que alterna el tema (clase .dark) y lo persiste en localStorage.",
    category: "Portfolio",
    filePath: "src/react-components/ThemeToggle/ThemeToggle.tsx",
    extraFiles: [
      {
        filePath: "src/react-components/ThemeToggle/ThemeToggle.module.css",
        code: themeToggleCss,
        language: "css",
      },
    ],
    dependencies: [],
    source: themeToggleSource,
    props: [
      {
        name: "lightLabel",
        type: "string",
        default: '"Activate dark mode"',
        description: "aria-label en modo claro (clic pasa a oscuro).",
      },
      {
        name: "darkLabel",
        type: "string",
        default: '"Activate light mode"',
        description: "aria-label en modo oscuro (clic pasa a claro).",
      },
      {
        name: "storageKey",
        type: "string",
        default: '"theme"',
        description: "Clave de localStorage para persistir el tema.",
      },
      {
        name: "darkClassName",
        type: "string",
        default: '"dark"',
        description: "Clase aplicada en <html> para el tema oscuro.",
      },
      {
        name: "onChange",
        type: "(theme: Theme) => void",
        description: "Callback tras cada cambio de tema.",
      },
      {
        name: "className",
        type: "string",
        description: "Clase extra para el elemento raíz.",
      },
    ],
    demos: [
      {
        title: "Alternar tema",
        preview: (
          <DarkStage height={120} padded>
            <div className="flex h-full items-center justify-center">
              <ThemeToggle />
            </div>
          </DarkStage>
        ),
        code: `import { ThemeToggle } from "@/react-components";

{/* alterna la clase .dark en <html> y persiste en localStorage */}
<ThemeToggle />`,
      },
    ],
  },
];
