import React from "react";
import styles from "./PersonaOperations.module.css";
import { usePersonas } from "../../../../features/personas/usePersonas";
import { useSkills } from "../../../../features/skills/useSkills";
import { useProjects } from "../../../../features/projects/useProjects";

/**
 * PersonaCard - Individual tactical briefing for a specific role
 */
function PersonaCard({ persona, skills, projects }) {
  const accentColor = persona.accent_color || "var(--accent-color)";
  
  // Filter top 4 skills and top 2 projects for this persona
  const relatedSkills = skills
    .filter(s => s.persona_ids?.includes(persona.id))
    .slice(0, 5);
    
  const relatedProjects = projects
    .filter(p => p.persona_ids?.includes(persona.id))
    .slice(0, 2);

  return (
    <div className={styles.card} style={{ "--card-accent": accentColor }}>
      <div className={styles.cardHeader}>
        <div className={styles.iconBox}>
          {persona.icon?.startsWith("http") ? (
             <img src={persona.icon} alt="" className={styles.iconImg} />
          ) : (
             <i className={`${persona.icon || "fas fa-user-shield"} ${styles.icon}`}></i>
          )}
        </div>
        <div className={styles.titleArea}>
          <span className={styles.statusTag}>OPERATIONAL_UNIT</span>
          <h3 className={styles.cardTitle}>{persona.title.toUpperCase()}</h3>
        </div>
      </div>

      <div className={styles.body}>
        <p className={styles.summary}>
          {persona.summary || persona.description?.slice(0, 150) + "..."}
        </p>

        {/* RELATED SKILLS SUB-SECTION */}
        {relatedSkills.length > 0 && (
          <div className={styles.subSection}>
            <h4 className={styles.subTitle}>CORE_STACK //</h4>
            <div className={styles.tagGrid}>
              {relatedSkills.map(s => (
                <span key={s.id} className={styles.skillTag}>{s.name}</span>
              ))}
            </div>
            <a href="/skill-matrix" className={styles.inlineLink}>[ CD_SKILLS ]</a>
          </div>
        )}

        {/* RELATED PROJECTS SUB-SECTION */}
        {relatedProjects.length > 0 && (
          <div className={styles.subSection}>
            <h4 className={styles.subTitle}>PROVEN_DEPLOYMENTS //</h4>
            <ul className={styles.projectList}>
              {relatedProjects.map(p => (
                <li key={p.id} className={styles.projectItem}>
                   <span className={styles.projPrefix}>&gt;</span> {p.title}
                </li>
              ))}
            </ul>
            <a href="/projects" className={styles.inlineLink}>[ CD_PROJECTS ]</a>
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <span className={styles.availability}>
           AVAILABILITY: <span className={styles.availValue}>{persona.availability?.toUpperCase() || "OPEN"}</span>
        </span>
        <div className={styles.decoration} />
      </div>
    </div>
  );
}

export default function PersonaOperations() {
  const { personas, isLoading: personasLoading } = usePersonas();
  const { data: skills = [], isLoading: skillsLoading } = useSkills();
  const { projects = [], isLoading: projectsLoading } = useProjects();

  const isLoading = personasLoading || skillsLoading || projectsLoading;

  if (isLoading) return null; // Let the Hero handle the first impression

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.mainTitle}>OPERATIONS_BRIEFING</h2>
        <div className={styles.headerLine} />
        <p className={styles.headerSubtitle}>
          Detailed architectural breakdown of professional service units and active specializations.
        </p>
      </div>

      <div className={styles.grid}>
        {personas.map(p => (
          <PersonaCard 
            key={p.id} 
            persona={p} 
            skills={skills} 
            projects={projects} 
          />
        ))}
      </div>
    </section>
  );
}
