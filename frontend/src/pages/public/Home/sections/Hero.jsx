// src/pages/public/Home/sections/Hero.jsx
import React from "react";
import styles from "./Hero.module.css";
import { usePersonas } from "../../../../features/personas/usePersonas";

/**
 * Helper: Formats the "Type" string for the hollow text
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
 * Helper: Cleans up text and removes accidental copy-paste errors
 */
function cleanString(str, fallback = "—") {
  if (!str) return fallback;
  return String(str)
    .replace(/typical causes:.*authorization problems.*endpoint\)/i, "") // Remove DB error text
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

  if (isLoading) return <section className={styles.hero}><div className={styles.loader}>INITIALIZING SYSTEM...</div></section>;
  if (isError) return <section className={styles.hero}><div className={styles.error}>ERR: {error?.message}</div></section>;
  if (!activePersona) return <section className={styles.hero}><div className={styles.error}>NO PERSONA DATA FOUND</div></section>;

  // Fallback to Green if no accent color is set
  const accentColor = activePersona.accent_color || "#00ff88";

  return (
    <section
      className={styles.hero}
      // INJECT DYNAMIC COLOR HERE:
      style={{ "--accent-color": accentColor }}
    >
      {/* 1. Technical Intro */}
      <div className={styles.introTag}>
        SYSTEM_ONLINE // STATUS: {displayPersonaType(activePersona.type)}
      </div>

      {/* 2. Dynamic Name & Type */}
      <h1>
        {cleanString(activePersona.title, "NO TITLE")} 
        <br />
        <span className={styles.highlight}>
          {displayPersonaType(activePersona.type)}
        </span>
      </h1>

      {/* 3. Description Block */}
      <div className={styles.roleContainer}>
        {/* Dynamic Summary Line */}
        <span className={styles.roleSwitch}>
          SUMMARY: {cleanString(activePersona.summary, "—")}
        </span>

        {/* Full Description */}
        <p className={styles.subtitle}>
          {cleanString(activePersona.description, "Building resilient digital architecture and securing the modern web.")}
        </p>

        {/* 4. Persona Switcher (Only shows if you have multiple personas) */}
        {personas.length > 1 && (
          <div className={styles.switcher}>
            <span className={styles.switcherLabel}>OVERRIDE_MODE:</span>
            <select
              value={activePersonaId || activePersona.id}
              onChange={(e) => setActivePersonaId(e.target.value)}
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

      {/* 5. Visual Flourish */}
      <div className={styles.decorLine}>
        {cleanString(activePersona.cta, "SCROLL_TO_INITIALIZE")}{" "}
        <span style={{ fontWeight: "bold" }}>&rarr;</span>
      </div>
    </section>
  );
}