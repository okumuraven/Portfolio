import React from "react";
import styles from "./Hero.module.css";
import { usePersonas } from "../../../../features/personas/usePersonas";

export default function Hero() {
  const { personas, activePersonaId, setActivePersonaId } = usePersonas();
  
  // Static Core Identity (Guarantees Instant Load & Perfect UX)
  const coreProfile = {
    name: "OKUMU JOSEPH",
    handle: "OKUMU RAVEN",
    title: "FULL-STACK ARCHITECT & SECURITY RESEARCHER",
    summary: "Building secure, high-performance digital infrastructure.",
    description: "Specializing in cutting-edge frontend interfaces, highly concurrent backend systems, and offensive security. I engineer solutions that scale and withstand modern cyber threats.",
    accentColor: "#ffd700", // Gold (Matches Skill Matrix)
    systemColor: "#ff5500", // Orange (Matches Admin)
  };

  // If we have loaded data and a selected persona, use it. Otherwise, fallback to static.
  const activePersona = personas?.find(p => String(p.id) === String(activePersonaId)) || null;

  const displayData = {
    title: activePersona?.title || coreProfile.title,
    summary: activePersona?.summary || coreProfile.summary,
    description: activePersona?.description || coreProfile.description,
    accentColor: activePersona?.accent_color || coreProfile.accentColor,
    systemColor: coreProfile.systemColor,
    type: activePersona?.type || "LEAD ARCHITECT",
  };

  return (
    <section className={styles.hero} style={{ "--accent-color": displayData.accentColor, "--system-color": displayData.systemColor }}>
      
      {/* BACKGROUND EFFECTS */}
      <div className={styles.scanline}></div>
      <div className={styles.glowOrb}></div>

      <div className={styles.heroContent}>
        
        {/* LEFT COLUMN: IDENTITY & TITLE */}
        <div className={styles.identityCol}>
          <div className={styles.systemStatus}>
            <span className={styles.ping}></span>
            <span className={styles.statusText}>SYSTEM_ONLINE // {displayData.type.toUpperCase()}</span>
          </div>

          <h1 className={styles.mainTitle}>
            <span className={styles.nameBlock}>{coreProfile.name}</span>
            <span className={styles.handleBlock}>({coreProfile.handle})</span>
          </h1>

          <h2 className={styles.roleHighlight}>
            &gt; {displayData.title.toUpperCase()}
          </h2>

          <p className={styles.heroDescription}>
            {displayData.description}
          </p>

          <div className={styles.actionRow}>
            <a href="/projects" className={styles.primaryBtn}>[ VIEW_OPERATIONS ]</a>
            <a href="/contact" className={styles.secondaryBtn}>INITIATE_CONTACT</a>
          </div>

          {/* PERSONA OVERRIDE (Only shows if DB loaded and has multiple) */}
          {personas && personas.length > 1 && (
             <div className={styles.overrideModule}>
               <span className={styles.overrideLabel}>SYS_OVERRIDE:</span>
               <select
                 value={activePersonaId || activePersona?.id || ""}
                 onChange={(e) => setActivePersonaId(e.target.value)}
                 className={styles.overrideSelect}
               >
                 <option value="" disabled>SELECT_PROFILE</option>
                 {personas.map((role) => (
                   <option key={role.id} value={role.id}>
                     {role.title.toUpperCase()}
                   </option>
                 ))}
               </select>
             </div>
          )}
        </div>

        {/* RIGHT COLUMN: TACTICAL TERMINAL */}
        <div className={styles.terminalCol}>
          <div className={styles.terminalWindow}>
            <div className={styles.terminalHeader}>
              <div className={styles.termDots}>
                <span></span><span></span><span></span>
              </div>
              <div className={styles.termTitle}>core_competencies.sh</div>
            </div>
            <div className={styles.terminalBody}>
              <div className={styles.termLine}>
                <span className={styles.prompt}>~/okumuraven/skills$</span> ./analyze --target
              </div>
              <div className={styles.termOutput}>
                <span className={styles.tag}>[FRONTEND]</span> React 19, Next.js, Tailwind v4, Framer Motion<br/><br/>
                <span className={styles.tag}>[BACKEND]</span> Node.js, Fastify, Express, Elixir, Phoenix<br/><br/>
                <span className={styles.tag}>[DATABASE]</span> PostgreSQL, Prisma ORM, Neon.tech, Redis<br/><br/>
                <span className={styles.tag}>[SECURITY]</span> SIEM, Kali Linux, Telemetry, OWASP Top 10<br/><br/>
                <span className={styles.tag}>[DEVOPS]</span> Docker, Fly.io, Tailscale, Linux, n8n
              </div>
              <div className={styles.termLine}>
                <span className={styles.prompt}>~/okumuraven/skills$</span> <span className={styles.cursor}>_</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
