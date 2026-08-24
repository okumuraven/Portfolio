import React from "react";
import "../../../styles/dossier.css";
import styles from "./Home.module.css";
// Import your section components (create them if you haven't yet)
import Hero from "./sections/Hero";
import PersonaOperations from "./sections/PersonaOperations";
import OperationsLog from "./sections/OperationsLog";
import SecurityCaseFile from "./sections/SecurityCaseFile";
import TimelinePreview from "./sections/TimelinePreview";
import SecureComms from "./sections/SecureComms";

/**
 * Home (Landing) Page
 * - This is the first page users/clients see.
 * - Composed of modular sections for easy maintainability.
 * - Visual impression and clear value prop are the focus!
 */
export default function Home() {
  return (
    <main className={styles.root}>
      {/* ==== HERO SECTION ==== */}
      <Hero />

      {/* ==== FOUR OPERATIONAL UNITS (Persona Cards) ==== */}
      <PersonaOperations />

      {/* ==== OPERATIONS LOG + STACK MODULES ==== */}
      <OperationsLog />

      {/* ==== SECURITY RESEARCHER CASE FILE (Evidence Board) ==== */}
      <SecurityCaseFile />

      {/* ==== RECENT ACHIEVEMENTS/TIMELINE ==== */}
      <TimelinePreview />

      {/* ==== SECURE COMMUNICATIONS HUB ==== */}
      <SecureComms />
    </main>
  );
}
