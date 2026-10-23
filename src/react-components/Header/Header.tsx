import { useState } from "react";
import type { AnimationEvent } from "react";
import styles from "./Header.module.css";

export interface HeaderProps {
  /** Name revealed after the prompt animation (default "MATI"). */
  name?: string;
  /** Decoration shown next to the name (default "</>"). */
  decoration?: string;
  /** Extra class name appended to the root element. */
  className?: string;
}

/**
 * Big centered animated intro.
 * step 0 -> a blinking `>` prompt
 * step 1 -> a `>` translates away while the name reveals from the left
 * Reproduces the step-based animation with internal state, no external events.
 */
export default function Header({
  name = "MATI",
  decoration = "</>",
  className,
}: HeaderProps) {
  const [step, setStep] = useState<number>(0);

  // step 0: el `>` parpadea; al terminar, empieza el barrido.
  const handleBlinkEnd = (_event: AnimationEvent<HTMLSpanElement>): void => {
    setStep(1);
  };

  // once the sweep finishes, drop the moving `>` so only the name remains.
  const handleSweepEnd = (_event: AnimationEvent<HTMLSpanElement>): void => {
    setStep(2);
  };

  const rootClassName = className
    ? `${styles.header} ${className}`
    : styles.header;

  return (
    <section className={rootClassName}>
      <div className={styles.sweepWrapper}>
        {/* el texto se revela de izquierda a derecha (desde step 1) */}
        <div className={step >= 1 ? styles.nameWrapper : styles.nameHidden}>
          <h1 className={styles.name}>{name}</h1>
          <p className={styles.decoration}>{decoration}</p>
        </div>

        {/* el mismo `>` parpadea en el borde izquierdo y luego barre, sin
            cambiar de contenedor ni de posición de inicio (no hay salto) */}
        {step === 0 && (
          <span
            className={styles.blinkPrompt}
            aria-hidden
            onAnimationEnd={handleBlinkEnd}
          >
            &gt;
          </span>
        )}
        {step === 1 && (
          <span
            className={styles.sweepPrompt}
            aria-hidden
            onAnimationEnd={handleSweepEnd}
          >
            &gt;
          </span>
        )}
      </div>
    </section>
  );
}
