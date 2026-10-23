export { default as Header } from "./Header/Header";
export type { HeaderProps } from "./Header/Header";

export { default as Terminal } from "./Terminal/Terminal";
export {
  DEFAULT_TERMINAL_LINES,
  DEFAULT_RESUME_TEXT,
} from "./Terminal/Terminal";
export type { TerminalProps, TerminalLine } from "./Terminal/Terminal";

export { default as Bars } from "./Bars/Bars";
export {
  DEFAULT_HEADERS,
  DEFAULT_FRAMEWORK_DETAILS,
  DEFAULT_EXPERIENCES,
  DEFAULT_CAREERS,
  DEFAULT_PROJECTS,
} from "./Bars/Bars";
export type {
  BarsProps,
  FrameworkDetail,
  FrameworkHeader,
  ExperienceSection,
} from "./Bars/Bars";

export { default as Footer } from "./Footer/Footer";
export type { FooterProps } from "./Footer/Footer";

export { default as Experience } from "./Experience/Experience";
export { DEFAULT_EXPERIENCE_CATEGORIES } from "./Experience/Experience";
export type {
  ExperienceProps,
  ExperienceItem,
  ExperienceCategory,
} from "./Experience/Experience";

export { default as ThemeToggle } from "./ThemeToggle/ThemeToggle";
export type { ThemeToggleProps, Theme } from "./ThemeToggle/ThemeToggle";
