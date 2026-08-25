import React, { useState, useEffect, useMemo } from "react";
import { getProjects } from "../../../api/projects.api";
import "../../../styles/dossier.css";
import { CaseBoardProvider, CasePin } from "../../../components/caseboard/CaseBoard";
import RedactedLink from "../../../components/caseboard/RedactedLink";
import styles from "./ProjectsPage.module.css";

// A short label for the margin note — take the part before any " // " split
// so "Raven OS // Secure Portfolio & Admin Console" just reads "Raven OS".
function shortTitle(title) {
  return (title || "").split(" // ")[0];
}

// The detective's own cross-reference: find every pair of case files that
// share a piece of stack, and note which one chip on each card is the
// "same as" evidence — so the string system can draw a line between them
// and the UI can circle exactly those two chips in red.
function computeSharedSkillLinks(projects) {
  const bySkill = new Map();
  projects.forEach((p, pi) => {
    (p.skills || []).forEach((sk, si) => {
      const key = sk.trim().toLowerCase();
      if (!bySkill.has(key)) bySkill.set(key, []);
      bySkill.get(key).push({ pi, si });
    });
  });

  const links = [];
  const chipMeta = new Map(); // `${pi}-${si}` -> { primary, note }

  bySkill.forEach((occurrences) => {
    const distinct = [];
    for (const occ of occurrences) {
      if (!distinct.some((d) => d.pi === occ.pi)) distinct.push(occ);
    }
    if (distinct.length < 2) return;
    const [a, b] = distinct;
    const idA = `skill-${a.pi}-${a.si}`;
    const idB = `skill-${b.pi}-${b.si}`;
    if (chipMeta.has(idA) || chipMeta.has(idB)) return; // keep each card's markup to one flagged chip
    links.push([idA, idB]);
    chipMeta.set(idA, { primary: true, note: `SAME AS ${shortTitle(projects[b.pi]?.title).toUpperCase()}` });
    chipMeta.set(idB, { primary: false, note: `SAME AS ${shortTitle(projects[a.pi]?.title).toUpperCase()}` });
  });

  return { links, chipMeta };
}

const categoryList = ["All", "Client", "Personal", "Open Source", "Hackathon", "Other"];

// Image helper for "link icon method": use URL or fallback
function getImageSrc(img) {
  if (!img) return "/default-thumb.png"; // fallback icon local asset
  if (/^https?:\/\//.test(img)) return img; // full URL (CDN, cloud, github, etc.)
  return "/default-thumb.png"; // fallback for anything else
}

// Helper to format dates cleanly
function formatLogDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short" });
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [imgErrorMap, setImgErrorMap] = useState({});

  useEffect(() => {
    setLoading(true);
    getProjects(category === "All" ? {} : { category })
      .then((res) => {
        const data = Array.isArray(res) ? res : res?.data || [];
        setProjects(data);
      })
      .catch(() => setProjects(window.__mockProjects || []))
      .finally(() => setLoading(false));
  }, [category]);

  function handleImgError(id) {
    setImgErrorMap((prev) => ({ ...prev, [id]: true }));
  }

  const visibleProjects = useMemo(() => projects.filter((p) => p.visible !== false), [projects]);
  const { links: skillLinks, chipMeta } = useMemo(
    () => computeSharedSkillLinks(visibleProjects),
    [visibleProjects]
  );

  return (
    <div className={`${styles.page} deskBg`}>
      <CaseBoardProvider crossTies={skillLinks}>
        <section className={styles.container}>
          {/* HEADER */}
          <div className={`${styles.header} torn paperShadow`}>
            <CasePin id="projects-header" order={0} className={styles.headerPin} />
            <div className={`${styles.headerKicker} ink`}>ARCHIVE // CASE LOG</div>
            <h1 className={`${styles.title} display`}>DEPLOYED OPERATIONS</h1>
            <p className={`${styles.subtitle} bodyCopy`}>Every shipped system, filed, stamped, and cross-referenced.</p>
          </div>

          {/* FILTER BAR */}
          <div className={styles.filterBar}>
            {categoryList.map((cat) => (
              <button
                key={cat}
                className={`${styles.filterTab} ink ${category === cat ? styles.active : ""}`}
                onClick={() => setCategory(cat)}
              >
                {cat === "All" ? "ALL_SYSTEMS" : cat.toUpperCase()}
              </button>
            ))}
          </div>

          {/* MAIN GRID */}
          {loading ? (
            <div className={`${styles.loader} ink`}>SEARCHING ARCHIVES...</div>
          ) : !visibleProjects.length ? (
            <div className={`${styles.loader} ink`}>NO MATCHING CASE FILES.</div>
          ) : (
            <div className={styles.grid}>
              {visibleProjects.map((project, idx) => (
                <div className={`${styles.card} paperShadow`} key={project.id}>
                  <CasePin id={`case-${project.id}`} order={idx + 1} className={styles.cardPin} />
                  <div className={`${styles.folderTab} ink`}>CASE_{String(idx + 1).padStart(2, "0")}</div>

                  <div className={styles.imageFrame}>
                    {!imgErrorMap[project.id] && project.image ? (
                      <img
                        src={getImageSrc(project.image)}
                        alt={project.title}
                        className={styles.projectImg}
                        onError={() => handleImgError(project.id)}
                        loading="lazy"
                      />
                    ) : (
                      <div className={`${styles.fallback} ink`}>PHOTO REDACTED</div>
                    )}
                    <svg viewBox="0 0 24 44" className={styles.paperclip} aria-hidden="true">
                      <path
                        d="M8 6 Q8 2 12 2 Q18 2 18 8 L18 30 Q18 36 12 36 Q8 36 8 32 L8 14 Q8 11 11 11 Q14 11 14 14 L14 27"
                        fill="none"
                        stroke="#9a9a9a"
                        strokeWidth="2.4"
                      />
                    </svg>
                  </div>

                  <div className={`${styles.categoryStamp} ink`}>{project.category}</div>

                  <div className={styles.cardBody}>
                    <div className={`${styles.cardTitle} ink`}>{project.title}</div>

                    {(project.date_start || project.date_end) && (
                      <div className={`${styles.projectDates} ink`}>
                        {project.date_start && (
                          <span>
                            INIT: <strong>{formatLogDate(project.date_start)}</strong>
                          </span>
                        )}
                        {project.date_start && project.date_end && <span className={styles.dateSeparator}>{"//"}</span>}
                        {project.date_end && (
                          <span>
                            END: <strong>{formatLogDate(project.date_end)}</strong>
                          </span>
                        )}
                        {project.date_start && !project.date_end && (
                          <>
                            <span className={styles.dateSeparator}>{"//"}</span>
                            <span className={styles.activeStatus}>ACTIVE</span>
                          </>
                        )}
                      </div>
                    )}

                    {project.highlight && (
                      <div className={`${styles.highlight} ink`}>
                        <span className={styles.highlightMark}>KEY EVIDENCE</span>
                        &#9733; {project.highlight}
                      </div>
                    )}

                    {project.description && (
                      <div className={`${styles.brief} bodyCopy`} title={project.description}>
                        {project.description}
                      </div>
                    )}

                    {!!(project.skills && project.skills.length) && (
                      <div className={styles.techStack}>
                        {project.skills.map((sk, i) => {
                          const chipId = `skill-${idx}-${i}`;
                          const meta = chipMeta.get(chipId);
                          if (!meta) {
                            return (
                              <span className={`${styles.techChip} ink`} key={i}>{sk}</span>
                            );
                          }
                          return (
                            <span className={`${styles.techChip} ${styles.linkedChip} ink`} key={i}>
                              <CasePin id={chipId} order={0} sequential={false} className={styles.chipAnchor} />
                              {sk}
                              {meta.primary && (
                                <span className={`${styles.linkNote} hand`}>{meta.note}</span>
                              )}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className={styles.cardFooter}>
                    {project.repo_link && (
                      <RedactedLink href={project.repo_link} target="_blank" rel="noopener noreferrer" stamp="ENCRYPTED">
                        {"</> SOURCE"}
                      </RedactedLink>
                    )}
                    {project.demo_link && (
                      <RedactedLink href={project.demo_link} target="_blank" rel="noopener noreferrer" stamp="LIVE FEED">
                        {"LIVE_DEMO ->"}
                      </RedactedLink>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </CaseBoardProvider>
    </div>
  );
}
