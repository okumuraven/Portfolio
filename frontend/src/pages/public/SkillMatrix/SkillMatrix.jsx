// src/pages/public/SkillMatrix/SkillMatrix.jsx
import React from 'react';
import styles from './SkillMatrix.module.css';
import { useSkills } from '../../../features/skills/useSkills';
import { groupSkillsByCategory, sortSkills, getSuperpowerSkills } from '../../../features/skills/skillUtils';
import SkillPieChart from '../../../components/skill/SkillPieChart';

function yearString(years) {
  return years > 1 ? `${years} YRS` : years === 1 ? '1 YR' : 'NEW';
}

export default function SkillMatrix() {
  const { data: skills = [], isLoading, isError } = useSkills();

  if (isLoading) return <div className={styles.loader}>INITIALIZING SKILL DATABASE...</div>;
  if (isError) return <div className={styles.error}>SYSTEM ERROR: UNABLE TO FETCH DATA.</div>;
  if (!skills.length) return <div className={styles.loader}>NO SKILL NODES FOUND.</div>;

  const sorted = sortSkills(skills);
  const grouped = groupSkillsByCategory(sorted);
  const superpowers = getSuperpowerSkills(skills);

  return (
    <section className={styles.container}>
      
      {/* PIE CHART OVERVIEW (Cleaned Up) */}
      <div className={styles.pieChartSection}>
        <SkillPieChart skills={skills} />
        {/* Removed the redundant div.pieChartLabel here */}
      </div>
      
      {/* 1. Header */}
      <h2 className={styles.sectionTitle}>
        Technical <span>Arsenal</span>
      </h2>

      {/* 2. Superpowers Section */}
      {superpowers.length > 0 && (
        <div className={styles.superpowerSection}>
          <span className={styles.superLabel}>{"// CORE_COMPETENCIES"}</span>
          <div className={styles.superGrid}>
            {superpowers.map(skill => (
              <div key={skill.id} className={styles.superCard}>
                {skill.icon && (
                  <img
                    src={skill.icon}
                    alt={skill.name + " icon"}
                    className={styles.superIconImg}
                    loading="lazy"
                  />
                )}
                <div className={styles.starIcon}>★</div>
                <span className={styles.superName}>{skill.name}</span>
                <div className={styles.superDetail}>
                  {skill.level} • {yearString(skill.years)}
                </div>
                {skill.cert_link && (
                  <div>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={skill.cert_link}
                      className={styles.certLink}
                    >[certificate]</a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Main Skill Grid */}
      <div className={styles.categoryGrid}>
        {Object.entries(grouped).map(([category, catSkills]) => (
          <div key={category} className={styles.categoryCard}>
            <h4 className={styles.catTitle}>
              {category || "GENERAL"} [{catSkills.length}]
            </h4>
            <ul className={styles.skillList}>
              {catSkills.map(skill => (
                <li key={skill.id} className={styles.skillItem}>
                  <div className={styles.skillLeft}>
                    <span className={styles.nodeDot}></span>
                    {skill.icon && (
                      <img
                        src={skill.icon}
                        alt=""
                        className={styles.iconImg}
                        loading="lazy"
                        style={{ marginRight: 8, verticalAlign: 'middle' }}
                      />
                    )}
                    <span className={styles.skillName}>
                      {skill.name}
                      {skill.active && <span className={styles.activeIndicator} title="Active Status"></span>}
                    </span>
                    {skill.superpower && <span className={styles.superpowerStar}>★</span>}
                  </div>
                  <div className={styles.skillRight}>
                    <span className={styles.skillLevel}>{skill.level}</span>
                    <span className={styles.skillMeta}>{yearString(skill.years)}</span>
                    {typeof skill.order === 'number' && (
                      <span className={styles.skillOrderTag}>
                        #{skill.order + 1}
                      </span>
                    )}
                  </div>
                  {(skill.project_links?.length > 0 || skill.cert_link || skill.persona_ids?.length > 0) && (
                    <div className={styles.skillInfoRow}>
                      {skill.project_links?.length > 0 && (
                        <span className={styles.skillProjectLinks}>
                          {skill.project_links.map((url, idx) =>
                            <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className={styles.skillProjectLink}>
                              {url.replace(/^https?:\/\//, '').slice(0, 40) + (url.length > 40 ? '...' : '')}
                            </a>
                          ).reduce((prev, curr) => [prev, ', ', curr])}
                        </span>
                      )}
                      {skill.cert_link && (
                        <a href={skill.cert_link} target="_blank" rel="noopener noreferrer" className={styles.certLink}>
                          cert
                        </a>
                      )}
                      {skill.persona_ids?.length > 0 && (
                        <span className={styles.skillPersonas}>
                          {skill.persona_ids.map(pid => (
                            <span key={pid} className={styles.personaChip}>P{pid}</span>
                          ))}
                        </span>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}