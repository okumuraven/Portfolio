import React, { useState, useEffect, useMemo } from "react";
import styles from "./Hero.module.css";
import { usePersonas } from "../../../../features/personas/usePersonas";
import { useSkills } from "../../../../features/skills/useSkills";
import { groupSkillsByCategory } from "../../../../features/skills/skillUtils";

/**
 * Animated Terminal Component that fetches real skill data
 */
function TacticalTerminal() {
  const { data: rawSkills = [], isLoading } = useSkills();
  const [visibleLines, setVisibleLines] = useState(0);
  const [isDone, setIsDone] = useState(false);

  // Process skills into tactical categories
  const terminalData = useMemo(() => {
    if (!rawSkills.length) return [];
    const grouped = groupSkillsByCategory(rawSkills);
    
    const mapping = [
      { search: "front", label: "FRONTEND" },
      { search: "back", label: "BACKEND" },
      { search: "data", label: "DATABASE" },
      { search: "sec", label: "SECURITY" },
      { search: "dev", label: "DEVOPS" }
    ];

    return mapping.map(m => {
      // Find matches using partial string matching
      const categoryKey = Object.keys(grouped).find(k => 
        k.toLowerCase().includes(m.search.toLowerCase())
      );
      const list = categoryKey ? grouped[categoryKey].slice(0, 4).map(s => s.name).join(", ") : "Pending verification...";
      return { label: m.label, value: list };
    });
  }, [rawSkills]);

  // Terminal Line Animation
  useEffect(() => {
    if (isLoading) return;
    
    const totalLines = terminalData.length + 3; // Commands + Scanning + Categories
    if (visibleLines < totalLines) {
      const timer = setTimeout(() => {
        setVisibleLines(prev => prev + 1);
      }, visibleLines === 0 ? 500 : visibleLines === 1 ? 1000 : 400);
      return () => clearTimeout(timer);
    } else {
      setIsDone(true);
    }
  }, [visibleLines, isLoading, terminalData.length]);

  return (
    <div className={styles.terminalWindow}>
      <div className={styles.terminalHeader}>
        <div className={styles.termDots}>
          <span></span><span></span><span></span>
        </div>
        <div className={styles.termTitle}>core_competencies.sh</div>
      </div>
      <div className={styles.terminalBody}>
        {/* Command 1 */}
        {visibleLines >= 1 && (
          <div className={styles.termLine}>
            <span className={styles.prompt}>~/okumuraven/skills$</span> ./analyze --target
          </div>
        )}

        {/* Loading/Scanning Line */}
        {visibleLines >= 2 && (
          <div className={styles.termLine} style={{ color: '#888' }}>
            {visibleLines === 2 ? (
              <span className={styles.loadingText}>[SCANNING_SYSTEM_RESOURCES...]</span>
            ) : (
              <span style={{ color: 'var(--accent-color)' }}>[SYSTEM_SCAN_COMPLETE] // 100% SUCCESS</span>
            )}
          </div>
        )}

        {/* Skill Lines */}
        <div className={styles.termOutput}>
          {terminalData.map((item, idx) => (
            visibleLines >= (idx + 3) && (
              <div key={idx} className={styles.skillOutputLine} style={{ marginBottom: '8px' }}>
                <span className={styles.tag}>[{item.label}]</span> {item.value}
              </div>
            )
          ))}
        </div>

        {/* Final Prompt */}
        {isDone && (
          <div className={styles.termLine}>
            <span className={styles.prompt}>~/okumuraven/skills$</span> <span className={styles.cursor}>_</span>
          </div>
        )}
        
        {/* Pre-load cursor if nothing shown yet */}
        {!isDone && visibleLines === 0 && (
          <div className={styles.termLine}>
             <span className={styles.prompt}>~/okumuraven/skills$</span> <span className={styles.cursor}>_</span>
          </div>
        )}
      </div>
    </div>
  );
}

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
          <TacticalTerminal />
        </div>

      </div>
    </section>
  );
}
