import React from "react";
import styles from "./PersonaOperations.module.css";
import { CasePin } from "../../../../components/caseboard/CaseBoard";
import RedactedLink from "../../../../components/caseboard/RedactedLink";

const ICONS = {
  code: (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2.4">
      <path d="M13 12 L6 20 L13 28" />
      <path d="M27 12 L34 20 L27 28" />
      <path d="M23 8 L17 32" />
    </svg>
  ),
  globe: (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2.4">
      <circle cx="20" cy="20" r="14" />
      <ellipse cx="20" cy="20" rx="6" ry="14" />
      <path d="M6 20 L34 20 M8 13 L32 13 M8 27 L32 27" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2.4">
      <path d="M20 5 L33 11 L33 21 Q33 32 20 36 Q7 32 7 21 L7 11 Z" />
      <path d="M14 20 L19 25 L27 15" />
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2.4">
      <rect x="11" y="4" width="18" height="32" rx="3" />
      <line x1="17" y1="10" x2="23" y2="10" />
      <circle cx="20" cy="31" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  ),
};

/**
 * EvidenceBadge — a taped, pinned dossier card for one professional hat.
 */
function EvidenceBadge({ data }) {
  return (
    <div className={styles.card} style={{ "--card-accent": data.accentColor }}>
      <CasePin id={`persona-${data.code}`} order={10 + Number(data.code)} className={styles.pin} />

      <div className={styles.cardHeader}>
        <div className={styles.iconBox}>{ICONS[data.icon]}</div>
        <div>
          <span className={`${styles.statusTag} ink`}>OPERATIONAL_UNIT // {data.code}</span>
          <h3 className={`${styles.cardTitle} ink`}>{data.title.toUpperCase()}</h3>
        </div>
      </div>

      <p className={`${styles.summary} bodyCopy`}>{data.description}</p>

      <div className={styles.subSection}>
        <h4 className={`${styles.subTitle} ink`}>CORE_SPECIALIZATIONS //</h4>
        <div className={styles.tagGrid}>
          {data.specializations.map((s, idx) => (
            <span key={idx} className={`${styles.skillTag} ink`}>{s}</span>
          ))}
        </div>
        <RedactedLink href="/skill-matrix" stamp="CLASSIFIED">ACCESS_SKILL_MATRIX</RedactedLink>
      </div>

      <div className={styles.subSection}>
        <h4 className={`${styles.subTitle} ink`}>OPERATIONAL_CAPABILITIES //</h4>
        <ul className={styles.capabilityList}>
          {data.capabilities.map((c, idx) => (
            <li key={idx} className={`${styles.capabilityItem} bodyCopy`}>
              <span className={styles.capPrefix}>&gt;</span> {c}
            </li>
          ))}
        </ul>
        <RedactedLink href="/projects" stamp="TOP SECRET">VIEW_OPERATIONAL_FEED</RedactedLink>
      </div>

      <div className={styles.footer}>
        <span className={`${styles.availability} ink`}>
          DEPLOYMENT_STATE: <span className={styles.availValue}>READY</span>
        </span>
      </div>
    </div>
  );
}

export default function PersonaOperations() {
  // Static Core Professional Units — the four hats, worn daily.
  const professionalUnits = [
    {
      code: "01",
      title: "Software Engineer",
      icon: "code",
      accentColor: "#efd968",
      description:
        "Architecting high-performance systems end-to-end — concurrent Node.js/Fastify services wired to resilient data layers that don't fall over under load.",
      specializations: ["Node.js", "Fastify", "PostgreSQL", "System Design"],
      capabilities: [
        "Distributed System Architecture",
        "API Performance Optimization",
        "Database Schema Design",
      ],
    },
    {
      code: "02",
      title: "Web Developer",
      icon: "globe",
      accentColor: "#7fb5ff",
      description:
        "Building interfaces that feel instant and hold up under real traffic — React and Next.js front-ends wired to production APIs, not just prototypes.",
      specializations: ["React 19", "Next.js", "Zustand", "WebSockets"],
      capabilities: [
        "Real-Time UI Architecture",
        "Anonymous Messaging Protocols",
        "Responsive Interface Engineering",
      ],
    },
    {
      code: "03",
      title: "Cyber Security",
      icon: "shield",
      accentColor: "#c23b2c",
      description:
        "Approaching every build with an offensive security mindset — penetration testing, auditing, and hardening systems against real-world threat models.",
      specializations: ["Kali Linux", "Burp Suite", "OWASP Top 10", "SOC Level 1"],
      capabilities: [
        "Network Telemetry Analysis",
        "Endpoint Hardening & Auditing",
        "Cryptographic Implementation",
      ],
    },
    {
      code: "04",
      title: "App Developer",
      icon: "phone",
      accentColor: "#8fdca0",
      description:
        "Extending the same backend and security discipline into cross-platform app experiences — mobile-first interfaces backed by the same secure APIs.",
      specializations: ["Cross-Platform UI", "REST/API Integration", "Offline-First", "Docker"],
      capabilities: [
        "Mobile-First Architecture",
        "API Integration Layers",
        "Deployment Pipelines",
      ],
    },
  ];

  return (
    <section className={`${styles.section} deskBg`}>
      <div className={`${styles.header} paperShadow`}>
        <h2 className={`${styles.mainTitle} display`}>FOUR OPERATIONAL UNITS</h2>
        <p className={`${styles.headerSubtitle} bodyCopy`}>
          Clearance roster — the four hats worn daily. Verified operational capacity for Q3 2026.
        </p>
      </div>

      <div className={styles.grid}>
        {professionalUnits.map((unit) => (
          <EvidenceBadge key={unit.code} data={unit} />
        ))}
      </div>
    </section>
  );
}
