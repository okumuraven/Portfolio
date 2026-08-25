// src/pages/public/SkillMatrix/SkillMatrix.jsx
import React from "react";
import "../../../styles/dossier.css";
import styles from "./SkillMatrix.module.css";
import { useSkills } from "../../../features/skills/useSkills";
import { groupSkillsByCategory, sortSkills, getSuperpowerSkills } from "../../../features/skills/skillUtils";
import SkillPieChart from "../../../components/skill/SkillPieChart";
import { CaseBoardProvider, CasePin } from "../../../components/caseboard/CaseBoard";
import RedactedLink from "../../../components/caseboard/RedactedLink";

function yearString(years) {
  return years > 1 ? `${years} YRS WIELDED` : years === 1 ? "1 YR WIELDED" : "NEWLY ACQUIRED";
}

// Proficiency reframed as a threat-meter fill — how dangerous this weapon is
// in his hands.
const THREAT_FILL = {
  proficient: 92,
  advanced: 92,
  intermediate: 60,
  learning: 32,
  beginner: 32,
};

function threatFill(level) {
  const key = (level || "").trim().toLowerCase();
  return THREAT_FILL[key] ?? 50;
}

export default function SkillMatrix() {
  const { data: skills = [], isLoading, isError } = useSkills();

  if (isLoading) return <div className={`${styles.loader} ink`}>PULLING SUSPECT&rsquo;S ARSENAL RECORDS...</div>;
  if (isError) return <div className={`${styles.loader} ink`}>SYSTEM ERROR: UNABLE TO FETCH DATA.</div>;
  if (!skills.length) return <div className={`${styles.loader} ink`}>NO WEAPONS ON FILE.</div>;

  const sorted = sortSkills(skills);
  const grouped = groupSkillsByCategory(sorted);
  const superpowers = getSuperpowerSkills(skills);

  return (
    <div className={`${styles.page} deskBg`}>
      <CaseBoardProvider>
        <section className={styles.container}>
          {/* HEADER */}
          <div className={`${styles.header} torn paperShadow`}>
            <CasePin id="arsenal-header" order={0} className={styles.headerPin} />
            <div className={`${styles.headerKicker} ink`}>SUSPECT: OKUMU JOSEPH // MODUS OPERANDI</div>
            <h1 className={`${styles.title} display`}>THE ARSENAL</h1>
            <p className={`${styles.subtitle} bodyCopy`}>
              Every tool he&rsquo;s known to wield &mdash; and the case files where he&rsquo;s used it.
            </p>
          </div>

          {/* FORENSIC BREAKDOWN (pie chart) */}
          <div className={`${styles.chartPanel} torn paperShadow`}>
            <CasePin id="arsenal-chart" order={1} className={styles.chartPin} />
            <div className={`${styles.panelKicker} ink`}>FORENSIC BREAKDOWN // WEAPON CATEGORIES</div>
            <SkillPieChart skills={skills} />
          </div>

          {/* SIGNATURE WEAPONS (superpowers) */}
          {superpowers.length > 0 && (
            <div className={styles.signatureSection}>
              <div className={`${styles.sectionLabel} ink`}>SIGNATURE WEAPONS // GO-TO METHOD</div>
              <div className={styles.signatureGrid}>
                {superpowers.map((skill) => (
                  <div key={skill.id} className={`${styles.signatureCard} paperShadow`}>
                    <div className={styles.signatureStamp}>SIGNATURE</div>
                    {skill.icon && <img src={skill.icon} alt="" className={styles.signatureIcon} loading="lazy" />}
                    <span className={`${styles.signatureName} ink`}>{skill.name}</span>
                    <div className={`${styles.signatureDetail} bodyCopy`}>
                      {skill.level} &middot; {yearString(skill.years)}
                    </div>
                    {skill.cert_link && (
                      <RedactedLink href={skill.cert_link} target="_blank" rel="noopener noreferrer" stamp="VERIFIED">
                        PROOF_ON_FILE
                      </RedactedLink>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* WEAPONS CACHE, BY CATEGORY */}
          <div className={styles.cacheGrid}>
            {Object.entries(grouped).map(([category, catSkills], catIdx) => (
              <div key={category} className={`${styles.cacheCard} paperShadow`}>
                <CasePin id={`arsenal-cache-${catIdx}`} order={10 + catIdx} className={styles.cachePin} />
                <div className={`${styles.cacheTitle} ink`}>
                  {(category || "GENERAL").toUpperCase()} CACHE <span className={styles.cacheCount}>[{catSkills.length}]</span>
                </div>

                <ul className={styles.weaponList}>
                  {catSkills.map((skill) => (
                    <li key={skill.id} className={styles.weaponRow}>
                      <div className={styles.weaponHeader}>
                        {skill.icon && <img src={skill.icon} alt="" className={styles.weaponIcon} loading="lazy" />}
                        <span className={`${styles.weaponName} ink`}>{skill.name}</span>
                        {skill.superpower && <span className={styles.weaponStar} title="Signature weapon">&#9733;</span>}
                        {skill.active && <span className={styles.activeDot} title="Actively deployed" />}
                        <span className={`${styles.weaponMeta} ink`}>{yearString(skill.years)}</span>
                      </div>

                      <div className={styles.threatMeter}>
                        <div className={styles.threatFill} style={{ width: `${threatFill(skill.level)}%` }} />
                        <span className={styles.threatLabel}>{(skill.level || "").toUpperCase()}</span>
                      </div>

                      {(skill.project_links?.length > 0 || skill.cert_link) && (
                        <div className={styles.evidenceRow}>
                          {skill.project_links?.map((url, idx) => (
                            <RedactedLink key={idx} href={url} target="_blank" rel="noopener noreferrer" stamp="CASE FILE">
                              {"EVIDENCE_0" + (idx + 1)}
                            </RedactedLink>
                          ))}
                          {skill.cert_link && (
                            <RedactedLink href={skill.cert_link} target="_blank" rel="noopener noreferrer" stamp="VERIFIED">
                              PROOF_ON_FILE
                            </RedactedLink>
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
      </CaseBoardProvider>
    </div>
  );
}
