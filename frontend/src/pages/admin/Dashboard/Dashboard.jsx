import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useProjects } from "../../../features/projects/useProjects";
import { useSkills } from "../../../features/skills/useSkills";
import { usePersonas } from "../../../features/personas/usePersonas";
import { useAdminContactProfile } from "../../../features/contact/useAdminContactProfile";
import { fetchTimeline } from "../../../api/timeline.api";
import "../../../styles/dossier.css";
import styles from "./Dashboard.module.css";

const getTimelineItems = (data) =>
  Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];

const TILES = [
  { key: "projects", label: "Cases Filed", to: "/admin/projects", tag: "PROJECTS" },
  { key: "skills", label: "Weapons Logged", to: "/admin/skills", tag: "SKILL_MATRIX" },
  { key: "personas", label: "Personas On File", to: "/admin/personas", tag: "PERSONAS" },
  { key: "timeline", label: "Chronology Entries", to: "/admin/timeline", tag: "TIMELINE" },
  { key: "contact", label: "Dossier Fields", to: "/admin/contact", tag: "CONTACT_PROFILE" },
];

const OPERATIONS = [
  { to: "/admin/chatbot", label: "AI_Estimator_Config", desc: "Tune the case consultant uplink." },
  { to: "/admin/recovery", label: "Recovery_System", desc: "Backup codes & account recovery." },
  { to: "/admin/security", label: "Security_Settings", desc: "2FA, sessions & access control." },
  { to: "/admin/activity", label: "System_Logs", desc: "Access & change history." },
];

export default function Dashboard() {
  const { projects, loading: projectsLoading } = useProjects();
  const { data: skills = [], isLoading: skillsLoading } = useSkills();
  const { personas = [], isLoading: personasLoading } = usePersonas({ isAdmin: true });
  const { fields: contactFields, isLoading: contactLoading } = useAdminContactProfile();
  const { data: timelineRaw, isLoading: timelineLoading } = useQuery({
    queryKey: ["dashboard-timeline"],
    queryFn: () => fetchTimeline(),
    staleTime: 60000,
  });

  const counts = {
    projects: projectsLoading ? null : (projects?.length ?? 0),
    skills: skillsLoading ? null : skills.length,
    personas: personasLoading ? null : personas.length,
    timeline: timelineLoading ? null : getTimelineItems(timelineRaw).length,
    contact: contactLoading ? null : (contactFields?.length ?? 0),
  };

  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <p className={`${styles.eyebrow} ink`}>{"// CASE OVERVIEW"}</p>
        <h1 className={`${styles.title} display`}>Command Desk</h1>
        <p className={`${styles.subtitle} bodyCopy`}>
          A live tally pulled from every file in the cabinet. Pick a drawer to open the record.
        </p>
      </header>

      <div className={styles.tileGrid}>
        {TILES.map((tile) => (
          <Link to={tile.to} key={tile.key} className={styles.tile}>
            <span className={`${styles.tileTag} ink`}>{tile.tag}</span>
            <span className={`${styles.tileCount} display`}>
              {counts[tile.key] === null ? "…" : String(counts[tile.key]).padStart(2, "0")}
            </span>
            <span className={styles.tileLabel}>{tile.label}</span>
            <span className={styles.tileLink}>OPEN FILE &rarr;</span>
          </Link>
        ))}
      </div>

      <section className={styles.opsSection}>
        <h2 className={`${styles.opsTitle} ink`}>{"// SYSTEM OPERATIONS"}</h2>
        <div className={styles.opsGrid}>
          {OPERATIONS.map((op) => (
            <Link to={op.to} key={op.to} className={styles.opsCard}>
              <span className={styles.opsLabel}>{op.label}</span>
              <span className={`${styles.opsDesc} bodyCopy`}>{op.desc}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
