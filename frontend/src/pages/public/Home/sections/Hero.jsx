// src/pages/public/Home/sections/Hero.jsx
import React, { useState } from "react";
import styles from "./Hero.module.css";
import { usePersonas } from "../../../../features/personas/usePersonas";

/**
 * Helper: Formats the persona "Type" string for display
 */
function displayPersonaType(type) {
  switch ((type || "").toLowerCase()) {
    case "current": return "CURRENT FOCUS";
    case "past": return "PREVIOUS ROLE";
    case "goal": return "ASPIRATION";
    default: return type ? type.toUpperCase() : "—";
  }
}

/**
 * Helper: Cleans up text
 */
function cleanString(str, fallback = "—") {
  if (!str) return fallback;
  return String(str)
    .replace(/typical causes:.*authorization problems.*endpoint\)/i, "")
    .trim() || fallback;
}

export default function Hero() {
  const {
    personas,
    activePersona,
    activePersonaId,
    setActivePersonaId,
    isLoading,
    isError,
    error
  } = usePersonas();

  // State to track if the custom icon link is broken
  const [iconBroken, setIconBroken] = useState(false);

  if (isLoading) return <section className={styles.hero}><div className={styles.loader}>INITIALIZING SYSTEM...</div></section>;
  if (isError) return <section className={styles.hero}><div className={styles.error}>ERR: {error?.message}</div></section>;
  if (!activePersona) return <section className={styles.hero}><div className={styles.error}>NO PERSONA DATA FOUND</div></section>;

  const accentColor = activePersona.accent_color || "#00ff88";

  // Icon Rendering Logic
  function renderIcon(icon) {
    if (!icon || iconBroken) return null; // Hide if missing or broken
    
    if (/^https?:\/\//.test(icon)) {
      return (
        <span className={styles.heroIconWrap}>
          <img 
            src={icon} 
            alt="Persona Icon" 
            className={styles.heroIconImg} 
            onError={() => setIconBroken(true)} // Hide on 404
          />
        </span>
      );
    }
    // Assume it's a font-awesome / library class
    return (
      <span className={styles.heroIconWrap}>
        <i className={`${icon} ${styles.heroIcon}`}></i>
      </span>
    );
  }

  return (
    <section className={styles.hero} style={{ "--accent-color": accentColor }}>
      
      {/* 1. TITLE & ICON ROW */}
      <div className={styles.heroTitleRow}>
        {renderIcon(activePersona.icon)}

        <div>
          <div className={styles.introTag}>
            SYSTEM_ONLINE // STATUS: {displayPersonaType(activePersona.type)}
          </div>
          <h1>
            {cleanString(activePersona.title, "NO TITLE")}
            <span className={styles.highlight}>
              {displayPersonaType(activePersona.type)}
            </span>
          </h1>
        </div>
      </div>

      {/* 2. DATA LOGS CONTAINER */}
      <div className={styles.roleContainer}>
        
        {/* Summary Block */}
        {activePersona.summary && (
          <div className={styles.dataBlock}>
            <span className={styles.dataLabel}>SUMMARY //</span>
            <span>{cleanString(activePersona.summary)}</span>
          </div>
        )}

        {/* Period Block */}
        {activePersona.period && (
          <div className={styles.dataBlock}>
            <span className={styles.dataLabel}>ACTIVE_PERIOD //</span>
            <span>{cleanString(activePersona.period)}</span>
          </div>
        )}

        {/* Motivation Block (Moved here for grouping) */}
        {activePersona.motivation && (
          <div className={styles.dataBlock}>
            <span className={styles.dataLabel}>MOTIVATION_DIRECTIVE //</span>
            <span>{cleanString(activePersona.motivation)}</span>
          </div>
        )}

        {/* Full Description (The large text block) */}
        <p className={styles.subtitle}>
          {cleanString(activePersona.description, "Building resilient digital architecture and securing the modern web.")}
        </p>

        {/* Persona Switcher */}
        {personas.length > 1 && (
          <div className={styles.switcher}>
            <span className={styles.switcherLabel}>OVERRIDE_MODE:</span>
            <select
              value={activePersonaId || activePersona.id}
              onChange={(e) => {
                setIconBroken(false); // Reset icon error state on switch
                setActivePersonaId(e.target.value);
              }}
              className={styles.switcherSelect}
            >
              {personas.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.title.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* 3. CTA DECOR (Desktop Only) */}
      <div className={styles.decorLine}>
        {cleanString(activePersona.cta, "SCROLL_TO_INITIALIZE")}{" "}
        <span style={{ fontWeight: "bold" }}>&rarr;</span>
      </div>

    </section>
  );
}