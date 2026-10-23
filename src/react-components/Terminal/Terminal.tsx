import { useEffect, useRef, useState } from "react";
import styles from "./Terminal.module.css";

/** A single terminal line: a typed command or a plain output line. */
export type TerminalLine =
  | { type: "command"; prompt: string; text: string }
  | { type: "output"; text: string };

export interface TerminalProps {
  /** Title shown in the terminal header bar. */
  title: string;
  /** Ordered lines to render/animate. */
  lines: TerminalLine[];
  /** Animate the sequence (default true). false renders everything instantly. */
  animated?: boolean;
  /** Delay in ms before the animation starts once visible. */
  startDelay?: number;
  /** Called once the whole sequence has finished (no global event bus). */
  onComplete?: () => void;
  /** Extra class name appended to the root element. */
  className?: string;
}

/** Resume text used as the default output line. */
export const DEFAULT_RESUME_TEXT =
  "Computer Engineer and Full-Stack Developer with remote work experience, " +
  "specialized in web platform development, user flow optimization and performance. " +
  "I have worked with React, MERN, Node.js, Docker, CI/CD, ETL (Informatica PowerCenter), " +
  "SQL, Power BI and AWS, integrating distributed technologies such as Stellar and Soroban. " +
  "Experienced in project management and teamwork using Jira. Passionate about continuous " +
  "improvement, process efficiency and the adoption of new technologies.";

/** Example lines so <Terminal title="..." lines={DEFAULT_TERMINAL_LINES} /> works. */
export const DEFAULT_TERMINAL_LINES: TerminalLine[] = [
  { type: "command", prompt: "portfolio@localhost:~$", text: "cd documents" },
  {
    type: "command",
    prompt: "portfolio@localhost:~/documents$",
    text: "cat about_me_en.txt",
  },
  { type: "output", text: DEFAULT_RESUME_TEXT },
];

export default function Terminal({
  title,
  lines,
  animated = true,
  startDelay = 0,
  onComplete,
  className,
}: TerminalProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  // number of lines currently revealed
  const [visibleCount, setVisibleCount] = useState<number>(
    animated ? 0 : lines.length,
  );
  // index of the command line currently being typed (cursor active), or null
  const [typingIndex, setTypingIndex] = useState<number | null>(null);
  const [started, setStarted] = useState<boolean>(!animated);

  // keep latest onComplete without retriggering the observer effect
  const onCompleteRef = useRef<typeof onComplete>(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // instant mode: fire onComplete once mounted
  useEffect(() => {
    if (!animated) {
      onCompleteRef.current?.();
    }
  }, [animated]);

  // start the sequence when scrolled into view (IntersectionObserver)
  useEffect(() => {
    if (!animated) return;
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [animated]);

  // drive the sequence once started, respecting startDelay
  useEffect(() => {
    if (!animated || !started) return;

    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const revealLine = (index: number): void => {
      if (cancelled || index >= lines.length) {
        if (!cancelled && index >= lines.length) {
          onCompleteRef.current?.();
        }
        return;
      }

      const line = lines[index];

      if (line.type === "output") {
        // output lines just appear
        setTypingIndex(null);
        setVisibleCount(index + 1);
        revealLine(index + 1);
        return;
      }

      // command lines reveal via a typewriter animation with a block cursor
      setVisibleCount(index + 1);
      setTypingIndex(index);
      // reveal animation lasts 0.3s -> advance after it ends
      const timer = setTimeout(() => {
        if (cancelled) return;
        setTypingIndex(null);
        revealLine(index + 1);
      }, 300);
      timers.push(timer);
    };

    const startTimer = setTimeout(() => {
      revealLine(0);
    }, startDelay);
    timers.push(startTimer);

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [animated, started, startDelay, lines]);

  const rootClassName = className
    ? `${styles.terminal} ${className}`
    : styles.terminal;

  return (
    <section ref={containerRef} className={rootClassName} aria-label={title}>
      <div className={styles.header}>{title}</div>
      <div className={styles.body}>
        <div className={styles.lines}>
          {lines.map((line, index) => {
            const isVisible = index < visibleCount;
            const lineKey = `${line.type}-${index}`;

            if (line.type === "output") {
              return (
                <div className={styles.line} key={lineKey}>
                  <p
                    className={`${styles.outputText} ${isVisible ? "" : styles.hidden}`}
                  >
                    {line.text}
                  </p>
                </div>
              );
            }

            const isTyping = typingIndex === index;

            return (
              <div className={styles.line} key={lineKey}>
                <h2 className={styles.prompt}>{line.prompt}</h2>
                <p
                  className={`${styles.commandText} ${isVisible ? "" : styles.hidden} ${
                    isTyping ? styles.typing : ""
                  }`}
                >
                  {line.text}
                </p>
                {isTyping && (
                  <span
                    className={`${styles.cursor} ${styles.cursorTranslating}`}
                    aria-hidden
                  />
                )}
              </div>
            );
          })}
          {/* trailing blinking cursor once everything is done */}
          {visibleCount >= lines.length && typingIndex === null && (
            <div className={styles.line}>
              <span
                className={`${styles.cursor} ${styles.cursorBlinking}`}
                aria-hidden
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
