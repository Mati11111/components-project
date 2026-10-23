import { useEffect, useState } from "react";
import styles from "./ThemeToggle.module.css";

export type Theme = "light" | "dark";

export interface ThemeToggleProps {
  /** aria-label shown while in light mode (clicking switches to dark). */
  lightLabel?: string;
  /** aria-label shown while in dark mode (clicking switches to light). */
  darkLabel?: string;
  /** localStorage key used to persist the chosen theme. */
  storageKey?: string;
  /** class toggled on document.documentElement for the dark theme. */
  darkClassName?: string;
  /** callback fired after each toggle with the newly applied theme. */
  onChange?: (theme: Theme) => void;
  className?: string;
}

function readStoredTheme(storageKey: string): Theme | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(storageKey);
    return stored === "dark" || stored === "light" ? stored : null;
  } catch {
    return null;
  }
}

function getInitialTheme(storageKey: string): Theme {
  const stored = readStoredTheme(storageKey);
  if (stored) return stored;

  if (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }

  return "light";
}

export default function ThemeToggle({
  lightLabel = "Activate dark mode",
  darkLabel = "Activate light mode",
  storageKey = "theme",
  darkClassName = "dark",
  onChange,
  className,
}: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme>("light");

  // On mount, resolve the initial theme and apply it to the document.
  useEffect(() => {
    const initial = getInitialTheme(storageKey);
    setTheme(initial);

    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle(
        darkClassName,
        initial === "dark",
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleTheme = (): void => {
    const next: Theme = theme === "dark" ? "light" : "dark";

    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle(darkClassName, next === "dark");
    }

    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(storageKey, next);
      } catch {
        // ignore storage failures (private mode, disabled storage, etc.)
      }
    }

    setTheme(next);
    onChange?.(next);
  };

  const isDark = theme === "dark";

  const rootClassName = className
    ? `${styles.toggle} ${className}`
    : styles.toggle;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={rootClassName}
      aria-label={isDark ? darkLabel : lightLabel}
    >
      {isDark ? (
        <span
          className={`${styles.icon} ${styles.iconBack} ${styles.moon}`}
          aria-hidden
        />
      ) : (
        <span className={`${styles.icon} ${styles.sun}`} aria-hidden />
      )}
    </button>
  );
}
