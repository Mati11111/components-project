import { useMemo, useState } from "react";
import styles from "./Experience.module.css";

/** A single detail item (job, degree, project...). */
export type ExperienceItem = {
  /** Short label shown in the middle list (e.g. company name). */
  label: string;
  /** Title of the detail panel (e.g. role). */
  title: string;
  /** Subtitle under the title (e.g. company / institution). */
  subtitle?: string;
  /** Date range (e.g. "Apr 2026 - Present"). */
  date?: string;
  /** Free-form description paragraph. */
  description?: string;
  /** Technology/skill tags shown bottom-right. */
  tags?: string[];
};

/** A category grouping several items (Work experience, Education...). */
export type ExperienceCategory = {
  /** Category label shown in the left column. */
  label: string;
  /** Items belonging to this category. */
  items: ExperienceItem[];
};

export interface ExperienceProps {
  /** Window title shown in the terminal header bar. */
  title?: string;
  /** Path label shown above the columns. */
  path?: string;
  /** Categories to render (left column). */
  categories?: ExperienceCategory[];
  /** Extra class name appended to the root element. */
  className?: string;
}

/** Default demo data (matches the portfolio screenshot). */
export const DEFAULT_EXPERIENCE_CATEGORIES: ExperienceCategory[] = [
  {
    label: "Work experience",
    items: [
      {
        label: "Anticipa",
        title: "Full-Stack Developer",
        subtitle: "Anticipa",
        date: "Apr 2026 - Present",
        description:
          "Backend development for the health sector (FONASA). Design and " +
          "implementation of microservices and APIs with Python, FastAPI and " +
          "SQLAlchemy. Built business logic in a scalable, maintainable " +
          "architecture for critical internal processes.",
        tags: ["FastAPI", "SQLAlchemy", "PostgreSQL"],
      },
      {
        label: "Apiux (Fonasa)",
        title: "Backend Developer",
        subtitle: "Apiux",
        date: "2025 - 2026",
        description:
          "ETL pipelines and data integration for FONASA using Informatica " +
          "PowerCenter and Oracle SQL. Reporting with Power BI.",
        tags: ["Informatica", "OracleSQL", "Power BI"],
      },
      {
        label: "Forcast",
        title: "Full-Stack Developer",
        subtitle: "Forcast",
        date: "2024 - 2025",
        description:
          "Web platform development with the MERN stack, Docker and CI/CD " +
          "pipelines. Integration of distributed technologies.",
        tags: ["React", "Node.js", "Docker"],
      },
      {
        label: "Entix",
        title: "Frontend Developer",
        subtitle: "Entix",
        date: "2024",
        description:
          "Built responsive UIs and optimized user flows and performance " +
          "for client-facing web applications.",
        tags: ["React", "Tailwind", "TypeScript"],
      },
      {
        label: "Servcon",
        title: "IT Support",
        subtitle: "Servcon",
        date: "2023 - 2024",
        description:
          "Linux systems administration and internal support. Automation " +
          "of recurring tasks with Bash scripting.",
        tags: ["Linux", "Bash"],
      },
      {
        label: "Psys",
        title: "Junior Developer",
        subtitle: "Psys",
        date: "2023",
        description:
          "First professional experience building and maintaining internal " +
          "tools and small web features.",
        tags: ["JavaScript", "SQL"],
      },
    ],
  },
  {
    label: "Education",
    items: [
      {
        label: "Computer Engineering",
        title: "Computer Engineering",
        subtitle: "University",
        date: "2019 - 2024",
        description:
          "Degree in Computer Engineering with focus on software " +
          "development, data structures and distributed systems.",
        tags: ["Algorithms", "Databases", "Networks"],
      },
    ],
  },
  {
    label: "Personal projects",
    items: [
      {
        label: "Portfolio",
        title: "Developer Portfolio",
        subtitle: "Open source",
        date: "2026",
        description:
          "Terminal-themed portfolio built with React and CSS Modules, " +
          "fully animated and responsive.",
        tags: ["React", "CSS Modules", "Vite"],
      },
    ],
  },
];

export default function Experience({
  title = "portfolio@localhost ~/documents/work_experience",
  path = "portfolio@localhost:~/documents/work_experience",
  categories = DEFAULT_EXPERIENCE_CATEGORIES,
  className,
}: ExperienceProps) {
  const [categoryIndex, setCategoryIndex] = useState<number>(0);
  const [itemIndex, setItemIndex] = useState<number>(0);

  const activeCategory = categories[categoryIndex] ?? categories[0];
  const items = activeCategory?.items ?? [];
  const activeItem = useMemo<ExperienceItem | undefined>(
    () => items[itemIndex] ?? items[0],
    [items, itemIndex],
  );

  function selectCategory(index: number): void {
    setCategoryIndex(index);
    setItemIndex(0);
  }

  const rootClassName = className
    ? `${styles.experience} ${className}`
    : styles.experience;

  return (
    <section className={rootClassName} aria-label={title}>
      <div className={styles.header}>{title}</div>

      <div className={styles.body}>
        <p className={styles.path}>{path}</p>

        <div className={styles.columns}>
          {/* ----- categories ----- */}
          <ul className={styles.column} role="tablist" aria-label="Categories">
            {categories.map((category, index) => (
              <li key={category.label}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={index === categoryIndex}
                  className={`${styles.rowButton} ${
                    index === categoryIndex ? styles.rowSelected : ""
                  }`}
                  onClick={() => selectCategory(index)}
                >
                  {category.label}
                </button>
              </li>
            ))}
          </ul>

          {/* ----- items ----- */}
          <ul className={styles.column} role="tablist" aria-label="Items">
            {items.map((item, index) => (
              <li key={item.label}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={index === itemIndex}
                  className={`${styles.rowButton} ${
                    index === itemIndex ? styles.rowSelected : ""
                  }`}
                  onClick={() => setItemIndex(index)}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          {/* ----- detail ----- */}
          <div className={styles.detail}>
            {activeItem && (
              <>
                <h3 className={styles.detailTitle}>{activeItem.title}</h3>
                {activeItem.subtitle && (
                  <p className={styles.detailSubtitle}>{activeItem.subtitle}</p>
                )}
                {activeItem.date && (
                  <p className={styles.detailDate}>{activeItem.date}</p>
                )}
                {activeItem.description && (
                  <p className={styles.detailDescription}>
                    {activeItem.description}
                  </p>
                )}
                {activeItem.tags && activeItem.tags.length > 0 && (
                  <p className={styles.detailTags}>
                    {activeItem.tags.join(" | ")}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
