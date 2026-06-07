import React from "react";
import styles from "./PersonaOperations.module.css";

/**
 * StaticProfessionalCard - High-fidelity tactical briefing for core roles
 */
function StaticProfessionalCard({ data }) {
  const accentColor = data.accentColor || "var(--accent-color)";
  
  return (
    <div className={styles.card} style={{ "--card-accent": accentColor }}>
      <div className={styles.cardHeader}>
        <div className={styles.iconBox}>
          <i className={`${data.icon} ${styles.icon}`}></i>
        </div>
        <div className={styles.titleArea}>
          <span className={styles.statusTag}>OPERATIONAL_UNIT // {data.code}</span>
          <h3 className={styles.cardTitle}>{data.title.toUpperCase()}</h3>
        </div>
      </div>

      <div className={styles.body}>
        <p className={styles.summary}>
          {data.description}
        </p>

        {/* CORE SPECIALIZATIONS */}
        <div className={styles.subSection}>
          <h4 className={styles.subTitle}>CORE_SPECIALIZATIONS //</h4>
          <div className={styles.tagGrid}>
            {data.specializations.map((s, idx) => (
              <span key={idx} className={styles.skillTag}>{s}</span>
            ))}
          </div>
          <a href="/skill-matrix" className={styles.inlineLink} data-text="[ ACCESS_SKILL_MATRIX ]">
            <span className={styles.pulseDot}></span>
            <i className="fas fa-terminal"></i>
            [ ACCESS_SKILL_MATRIX ]
          </a>
        </div>

        {/* KEY CAPABILITIES */}
        <div className={styles.subSection}>
          <h4 className={styles.subTitle}>OPERATIONAL_CAPABILITIES //</h4>
          <ul className={styles.projectList}>
            {data.capabilities.map((c, idx) => (
              <li key={idx} className={styles.projectItem}>
                 <span className={styles.projPrefix}>&gt;</span> {c}
              </li>
            ))}
          </ul>
          <a href="/projects" className={styles.inlineLink} data-text="[ VIEW_OPERATIONAL_FEED ]">
            <span className={styles.pulseDot}></span>
            <i className="fas fa-database"></i>
            [ VIEW_OPERATIONAL_FEED ]
          </a>
        </div>
      </div>

      <div className={styles.footer}>
        <span className={styles.availability}>
           DEPLOYMENT_STATE: <span className={styles.availValue}>READY</span>
        </span>
        <div className={styles.decoration} />
      </div>
    </div>
  );
}

export default function PersonaOperations() {
  // Static Core Professional Units (Guarantees Instant Load & Perfect UX)
  const professionalUnits = [
    {
      code: "01",
      title: "Full-Stack Architect",
      icon: "fas fa-layer-group",
      accentColor: "#ffd700", // Gold
      description: "Architecting high-performance web engines. Modernizing legacy Node.js backends into highly concurrent, scalable environments using Elixir and Phoenix.",
      specializations: ["React 19", "Next.js", "Node.js", "Fastify", "PostgreSQL"],
      capabilities: [
        "Distributed System Architecture",
        "Anonymous Messaging Protocols",
        "API Performance Optimization"
      ]
    },
    {
      code: "02",
      title: "Security Researcher",
      icon: "fas fa-user-shield",
      accentColor: "#ff5500", // Orange
      description: "Approaching infrastructure with an offensive security mindset. Specialized in penetration testing, password auditing, and resilient EDR logic design.",
      specializations: ["Kali Linux", "Burp Suite", "SOC Level 1", "OWASP Top 10"],
      capabilities: [
        "Network Telemetry Analysis",
        "Endpoint Hardening & Auditing",
        "Cryptographic Implementation"
      ]
    },
    {
      code: "03",
      title: "Cloud & Systems Architect",
      icon: "fas fa-server",
      accentColor: "#00e5ff", // Cyan
      description: "Commanding Linux environments and deployment pipelines. Automating complex workflows with n8n and architecting secure edge infrastructure.",
      specializations: ["Docker", "Linux (Ubuntu)", "Tailscale", "Redis", "BullMQ"],
      capabilities: [
        "Infrastructure as Code",
        "CI/CD Pipeline Automation",
        "Secure VPN Tunneling"
      ]
    },
    {
      code: "04",
      title: "Statistical Computist",
      icon: "fas fa-microchip",
      accentColor: "#00ff88", // Cyber Green
      description: "Applying rigorous logic and probability to complex data models. Engineering data-heavy applications that require high-frequency processing.",
      specializations: ["Data Modeling", "Predictive Analytics", "System Optimization"],
      capabilities: [
        "Complex Algorithm Design",
        "Performance Benchmarking",
        "Quantitative Risk Analysis"
      ]
    }
  ];

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.mainTitle}>OPERATIONS_BRIEFING</h2>
        <div className={styles.headerLine} />
        <p className={styles.headerSubtitle}>
          Detailed architectural breakdown of professional service units and active specializations. 
          Verified operational capacity for Q3 2026.
        </p>
      </div>

      <div className={styles.grid}>
        {professionalUnits.map(unit => (
          <StaticProfessionalCard 
            key={unit.code} 
            data={unit} 
          />
        ))}
      </div>
    </section>
  );
}
