// src/pages/public/Projects/ProjectsPage.jsx
import React, { useState, useEffect } from "react";
import { getProjects } from "../../../api/projects.api";
import styles from "./ProjectsPage.module.css";

// List of shown categories
const categoryList = ["All", "Client", "Personal", "Open Source", "Hackathon", "Other"];

// Helper: robust image path handling
const API_BASE = "http://localhost:5000";
function getImageSrc(img) {
  if (!img) return null; // Let the fallback handle it
  if (img.startsWith("storage/projects")) return `${API_BASE}/${img}`;
  if (img.startsWith("/storage/projects")) return `${API_BASE}${img}`;
  if (/^https?:\/\//.test(img)) return img;
  return `${API_BASE}/storage/projects/${img}`; // Default assumption
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  
  // Track broken images per project ID
  const [imgErrorMap, setImgErrorMap] = useState({});

  useEffect(() => {
    setLoading(true);
    getProjects(category === "All" ? {} : { category })
      .then(res => {
        const data = Array.isArray(res) ? res : res?.data || [];
        setProjects(data);
      })
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, [category]);

  // Mark specific project image as broken
  function handleImgError(id) {
    setImgErrorMap(prev => ({ ...prev, [id]: true }));
  }

  return (
    <section className={styles.container}>
      {/* HEADER */}
      <div className={styles.header}>
        <h1 className={styles.title}>
          DE<strong>PLOYED</strong> <span>OPERATIONS</span>
        </h1>
      </div>

      {/* FILTER BAR */}
      <div className={styles.filterBar}>
        {categoryList.map(cat => (
          <button
            key={cat}
            className={`${styles.filterBtn} ${category === cat ? styles.active : ""}`}
            onClick={() => setCategory(cat)}
          >
            {cat === "All" ? "[ ALL_SYSTEMS ]" : cat.toUpperCase()}
          </button>
        ))}
      </div>

      {/* MAIN GRID */}
      {loading ? (
        <div className={styles.loader}>SEARCHING ARCHIVES...</div>
      ) : !projects.length ? (
        <div className={styles.loader}>NO MATCHING PROJECTS FOUND.</div>
      ) : (
        <div className={styles.grid}>
          {projects
            .filter(p => p.visible !== false)
            .map(project => (
              <div className={styles.card} key={project.id}>
                
                {/* Image Area */}
                <div className={styles.imageContainer}>
                  {!imgErrorMap[project.id] && project.image ? (
                    <img
                      src={getImageSrc(project.image)}
                      alt={project.title}
                      className={styles.projectImg}
                      onError={() => handleImgError(project.id)}
                      loading="lazy"
                    />
                  ) : (
                    // Fallback Pattern if Error or No Image
                    <div className={styles.fallbackPattern}>
                      <span className={styles.fallbackIcon}>[ NO_SIGNAL ]</span>
                    </div>
                  )}
                  <span className={styles.categoryBadge}>{project.category}</span>
                </div>

                {/* Info Section */}
                <div className={styles.cardContent}>
                  <div className={styles.cardTitle}>{project.title}</div>
                  
                  {project.highlight && (
                    <div className={styles.highlight}>★ {project.highlight}</div>
                  )}

                  {/* --- NEW MISSION BRIEF (DESCRIPTION) --- */}
                  {project.description && (
                    <div className={styles.brief} title={project.description}>
                      {project.description}
                    </div>
                  )}

                  {/* Tech Stack */}
                  {!!(project.skills && project.skills.length) && (
                    <div className={styles.techStack}>
                      {project.skills.map((sk, i) => (
                        <span className={styles.techChip} key={i}>{sk}</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className={styles.cardFooter}>
                  {project.repo_link ? (
                    <a href={project.repo_link} target="_blank" rel="noopener noreferrer" className={`${styles.link} ${styles.repoLink}`}>
                      &lt;/&gt; SOURCE
                    </a>
                  ) : <span />}
                  
                  {project.demo_link && (
                    <a href={project.demo_link} target="_blank" rel="noopener noreferrer" className={`${styles.link} ${styles.demoLink}`}>
                      LIVE DEMO &rarr;
                    </a>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}
    </section>
  );
}