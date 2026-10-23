import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import styles from "./Bars.module.css";

/** Detailed metrics for a single framework/skill. */
export type FrameworkDetail = {
  framework: string;
  area: string;
  language: string;
  experience_time: string;
};

/** Table header definition. */
export type FrameworkHeader = { id: string; label: string };

/** A section of experience (job, career item, project...). */
export type ExperienceSection = {
  frameworks?: string[];
  about_frameworks?: FrameworkDetail[];
  "framework-headers"?: FrameworkHeader[];
};

export interface BarsProps {
  experiences?: ExperienceSection[];
  careers?: ExperienceSection[];
  projects?: ExperienceSection[];
  headers?: FrameworkHeader[];
  className?: string;
}

const ITEMS_PER_PAGE = 10;

/** Default table headers. */
export const DEFAULT_HEADERS: FrameworkHeader[] = [
  { id: "framework", label: "FRAMEWORK" },
  { id: "area", label: "AREA" },
  { id: "language", label: "LANGUAGE" },
  { id: "projects_amount", label: "PROJECTS AMOUNT" },
  { id: "experience_time", label: "EXPERIENCE TIME" },
];

/** Default demo framework details (English). */
export const DEFAULT_FRAMEWORK_DETAILS: FrameworkDetail[] = [
  { framework: "React", area: "Frontend", language: "JavaScript", experience_time: "2 YEARS" },
  { framework: "NodeJs", area: "Backend", language: "JavaScript", experience_time: "2 YEARS" },
  { framework: "ExpressJs", area: "Backend", language: "JavaScript", experience_time: "2 YEARS" },
  { framework: "Tailwind", area: "Frontend", language: "CSS", experience_time: "1 YEAR" },
  { framework: "MongoDB", area: "Backend", language: "JavaScript", experience_time: "1 YEAR" },
  { framework: "Docker", area: "DevOps", language: "Docker", experience_time: "1 YEAR" },
  { framework: "PostgreSQL", area: "Backend", language: "SQL", experience_time: "1 YEAR" },
  { framework: "Linux", area: "IT Support", language: "Bash", experience_time: "3 YEARS" },
  { framework: "FastAPI", area: "Backend", language: "Python", experience_time: "8 MONTHS" },
  { framework: "SQLAlchemy", area: "Backend", language: "Python", experience_time: "8 MONTHS" },
  { framework: "OracleSQL", area: "Backend", language: "SQL", experience_time: "8 MONTHS" },
  { framework: "NextJs", area: "Frontend", language: "JavaScript", experience_time: "4 MONTHS" },
  { framework: "Prisma", area: "Backend", language: "SQL", experience_time: "4 MONTHS" },
  { framework: "AWS", area: "IT Support", language: "CLI", experience_time: "4 MONTHS" },
  { framework: "Cloudflare", area: "DevOps", language: "CLI", experience_time: "6 MONTHS" },
  { framework: "Power BI", area: "Data", language: "Power BI", experience_time: "4 MONTHS" },
];

/** Default demo data: a single section carrying all demo frameworks. */
export const DEFAULT_EXPERIENCES: ExperienceSection[] = [
  {
    frameworks: DEFAULT_FRAMEWORK_DETAILS.map((d) => d.framework),
    about_frameworks: DEFAULT_FRAMEWORK_DETAILS,
    "framework-headers": DEFAULT_HEADERS,
  },
];

export const DEFAULT_CAREERS: ExperienceSection[] = [];
export const DEFAULT_PROJECTS: ExperienceSection[] = [
  { "framework-headers": DEFAULT_HEADERS },
];

type FrameworkCount = Record<string, number>;
type FrameworkDetailsMap = Record<string, FrameworkDetail>;

// convert an experience_time label ("3 AÑOS", "8 MESES", "1 AÑO", "2 YEARS") into months
function monthsFromExperience(str = ""): number {
  if (!str) return 0;
  const number = parseInt(str, 10) || 0;
  const isYears = /(a[nñ]o|year)/i.test(str);
  return isYears ? number * 12 : number;
}

export default function Bars({
  experiences = DEFAULT_EXPERIENCES,
  careers = DEFAULT_CAREERS,
  projects = DEFAULT_PROJECTS,
  headers = DEFAULT_HEADERS,
  className,
}: BarsProps) {
  const [allFrameworks, setAllFrameworks] = useState<string[]>([]);
  const [frameworkCount, setFrameworkCount] = useState<FrameworkCount>({});
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [frameworkDetails, setFrameworkDetails] = useState<FrameworkDetailsMap>(
    {},
  );
  const [hTopHeaders, setHTopHeaders] = useState<FrameworkHeader[]>([]);
  // table sorting -> starts by experience time, changeable from the headers
  const [sorterOption, setSorterOption] = useState<string>("experience_time");

  // table rows sorted by the selected column
  const sortedTableFrameworks = useMemo<string[]>(() => {
    return [...allFrameworks].sort((a, b) => {
      switch (sorterOption) {
        // most experienced first
        case "experience_time":
          return (
            monthsFromExperience(frameworkDetails[b]?.experience_time) -
            monthsFromExperience(frameworkDetails[a]?.experience_time)
          );
        // most used first
        case "projects_amount":
          return (frameworkCount[b] || 0) - (frameworkCount[a] || 0);
        // alphabetical
        case "area":
          return (frameworkDetails[a]?.area || "").localeCompare(
            frameworkDetails[b]?.area || "",
          );
        case "language":
          return (frameworkDetails[a]?.language || "").localeCompare(
            frameworkDetails[b]?.language || "",
          );
        case "framework":
        default:
          return a.localeCompare(b);
      }
    });
  }, [allFrameworks, sorterOption, frameworkDetails, frameworkCount]);

  // most experienced framework (in months) -> 100% reference for the bars
  const maxMonths = useMemo<number>(() => {
    const values = Object.values(frameworkDetails).map((d) =>
      monthsFromExperience(d?.experience_time),
    );
    return values.length ? Math.max(...values) : 0;
  }, [frameworkDetails]);

  // bar width relative to the most experienced framework (min 8%)
  const getPercent = (frameworkName: string): number => {
    const months = monthsFromExperience(
      frameworkDetails[frameworkName]?.experience_time,
    );
    if (!maxMonths || !months) return 0;
    return Math.max((months / maxMonths) * 100, 8);
  };

  useEffect(() => {
    const sections = [...experiences, ...careers, ...projects];

    // set all framework names
    const allFrameworksList = sections.flatMap(
      (section) => section.frameworks || [],
    );
    // set framework count
    const countMap = allFrameworksList.reduce<FrameworkCount>(
      (amount, framework) => {
        amount[framework] = (amount[framework] || 0) + 1;
        return amount;
      },
      {},
    );
    // set framework details
    const allFrameworkDetails = sections.flatMap(
      (section) => section["about_frameworks"] || [],
    );
    const detailsMap = allFrameworkDetails.reduce<FrameworkDetailsMap>(
      (list, item) => {
        list[item.framework] = item;
        return list;
      },
      {},
    );

    // always order by experience time (months) -> highest first
    const orderedFrameworks = Object.keys(countMap).sort((a, b) => {
      const monthsA = monthsFromExperience(detailsMap[a]?.experience_time);
      const monthsB = monthsFromExperience(detailsMap[b]?.experience_time);
      if (monthsB !== monthsA) return monthsB - monthsA;
      return a.localeCompare(b);
    });

    // header source: projects[0] if provided, else the headers prop
    const resolvedHeaders =
      projects[0]?.["framework-headers"] ?? headers ?? DEFAULT_HEADERS;

    setFrameworkCount(countMap);
    setHTopHeaders(resolvedHeaders);
    setAllFrameworks(orderedFrameworks);
    setFrameworkDetails(detailsMap);
  }, [experiences, careers, projects, headers]);

  function goToNextPage(): void {
    setCurrentPage((prevPage) => prevPage + 1);
  }

  function goToPrevPage(): void {
    setCurrentPage((prevPage) => prevPage - 1);
  }

  const totalPages = Math.max(
    1,
    Math.ceil(allFrameworks.length / ITEMS_PER_PAGE),
  );

  // ----- renderers -----
  function renderBar(frameworkName: string, labelClass: string) {
    const percent = getPercent(frameworkName);
    return (
      <div key={frameworkName} className={styles.barItem}>
        <span className={labelClass}>{frameworkName}</span>
        <div className={styles.barTrack}>
          <div
            className={styles.barFill}
            style={{ "--bar-width": `${percent}%` } as CSSProperties}
          />
        </div>
      </div>
    );
  }

  function renderDesktopTableRows() {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentItems = sortedTableFrameworks.slice(startIndex, endIndex);
    return currentItems.map((item, index) => {
      const details = frameworkDetails[item];
      if (
        !details ||
        !details.area ||
        !details.language ||
        !details.experience_time ||
        frameworkCount[item] == null
      ) {
        return null;
      }
      const isFirst = index === 0 && startIndex === 0;
      return (
        <tr
          key={item}
          className={`${styles.row} ${isFirst ? styles.rowFirst : ""}`}
        >
          <td className={styles.td}>{item}</td>
          <td className={styles.td}>{details?.area || "—"}</td>
          <td className={styles.td}>{details?.language || "—"}</td>
          <td className={styles.td}>{frameworkCount[item] ?? "—"}</td>
          <td className={styles.td}>{details?.experience_time || "—"}</td>
        </tr>
      );
    });
  }

  function renderMobileTableRows() {
    return allFrameworks.slice(0, 6).map((item, index) => {
      const details = frameworkDetails[item];
      return (
        <tr
          key={item}
          className={`${styles.row} ${index === 0 ? styles.rowFirst : ""}`}
        >
          <td className={styles.td}>{item}</td>
          <td className={styles.td}>{details?.area || "—"}</td>
          <td className={styles.td}>{details?.language || "—"}</td>
          <td className={styles.td}>{details?.experience_time || "—"}</td>
        </tr>
      );
    });
  }

  const rootClassName = className ? `${styles.bars} ${className}` : styles.bars;

  return (
    <div className={rootClassName}>
      {/* ---------- DESKTOP VIEW ---------- */}
      <div className={styles.desktopView}>
        <section className={styles.barsRow}>
          <section className={styles.barsColumn}>
            {allFrameworks
              .slice(0, 4)
              .map((frameworkName) => renderBar(frameworkName, styles.barLabel))}
          </section>
          <section className={styles.barsColumn}>
            {allFrameworks
              .slice(4, 8)
              .map((frameworkName) => renderBar(frameworkName, styles.barLabel))}
          </section>
        </section>

        <section className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                {hTopHeaders.map((header) => (
                  <th
                    key={header.id}
                    onClick={() => {
                      setSorterOption(header.id);
                      setCurrentPage(1);
                    }}
                    className={`${styles.th} ${
                      sorterOption === header.id ? styles.thActive : ""
                    }`}
                  >
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>{renderDesktopTableRows()}</tbody>
          </table>
        </section>

        <div className={styles.pagination}>
          <div className={styles.paginationGroup}>
            <button
              type="button"
              className={styles.pageButton}
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              {/* LeftIcon */}
              <span className={styles.icon} aria-hidden />
            </button>
            <button
              type="button"
              className={styles.pageButton}
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              {/* RightIcon */}
              <span className={`${styles.icon} ${styles.iconRotated}`} aria-hidden />
            </button>
          </div>
        </div>
      </div>

      {/* ---------- MOBILE VIEW ---------- */}
      <div className={styles.mobileView}>
        <section>
          <section className={styles.mobileBarsColumn}>
            {allFrameworks
              .slice(0, 6)
              .map((frameworkName) => renderBar(frameworkName, styles.barLabel))}
          </section>
        </section>

        <section>
          <table className={styles.mobileTable}>
            <thead className={styles.thead}>
              <tr>
                {hTopHeaders
                  .filter((header) => header.id !== "projects_amount")
                  .map((header) => (
                    <th
                      key={header.id}
                      className={`${styles.th} ${
                        sorterOption === header.id ? styles.thActive : ""
                      }`}
                    >
                      {header.label}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>{renderMobileTableRows()}</tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
