import { useEffect, useRef, useState } from "react";
import styles from "./Footer.module.css";

export interface FooterProps {
  githubUrl?: string;
  linkedinUrl?: string;
  email?: string;
  signText?: string;
  year?: number;
  socialsLabel?: string;
  copyEmailLabel?: string;
  className?: string;
}

export default function Footer({
  githubUrl = "https://github.com/Mati11111",
  linkedinUrl = "https://www.linkedin.com/in/mat%C3%ADas-chaparro-d%C3%ADaz-a6749027a/",
  email = "matias.chaparro.mail@gmail.com",
  signText = "Designed & Developed by Matías Chaparro",
  year = new Date().getFullYear(),
  socialsLabel = "Social media links",
  copyEmailLabel = "Copy email to clipboard",
  className,
}: FooterProps) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [copyStatus, setCopyStatus] = useState<string>("");

  // reveal-on-scroll (IntersectionObserver), cleaned up on unmount
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      { threshold: 0.1 },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleCopyEmail = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(email);
      setCopyStatus(`${email} copied to clipboard`);
    } catch {
      setCopyStatus(`Could not copy the email. Copy it manually: ${email}`);
    }
  };

  const rootClassName = className
    ? `${styles.footer} ${className}`
    : styles.footer;

  return (
    <div className={rootClassName} ref={sentinelRef}>
      <section>
        <nav
          aria-label={socialsLabel}
          className={`${styles.iconsContainer} ${visible ? styles.iconsVisible : ""}`}
        >
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub (opens in a new tab)"
            className={styles.iconLink}
          >
            {/* GithubIcon */}
            <span className={styles.icon} aria-hidden />
          </a>

          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn (opens in a new tab)"
            className={styles.iconLink}
          >
            {/* LinkedinIcon */}
            <span className={styles.icon} aria-hidden />
          </a>

          <button
            type="button"
            onClick={handleCopyEmail}
            className={styles.iconButton}
            aria-label={copyEmailLabel}
          >
            {/* EmailIcon */}
            <span className={styles.icon} aria-hidden />
          </button>
        </nav>
        <p className={styles.srOnly} role="status" aria-live="polite">
          {copyStatus}
        </p>
      </section>

      <div className={styles.signBlock}>
        <p className={`${styles.sign} ${visible ? styles.signVisible : ""}`}>
          {signText}
        </p>
        <div className={styles.copyrightRow}>
          <p
            className={`${styles.copyright} ${visible ? styles.copyrightVisible : ""}`}
          >
            &copy;
          </p>
          <p
            className={`${styles.copyrightYear} ${visible ? styles.copyrightYearVisible : ""}`}
          >
            {year}
          </p>
        </div>
      </div>
    </div>
  );
}
