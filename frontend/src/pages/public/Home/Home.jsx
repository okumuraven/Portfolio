import React from "react";
import styles from "./Home.module.css";
// Import your section components (create them if you haven't yet)
import Hero from "./sections/Hero";
import PersonaOperations from "./sections/PersonaOperations";
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

      {/* ==== OPERATIONS BRIEFING (Persona Cards) ==== */}
      <PersonaOperations />

      {/* ==== RECENT ACHIEVEMENTS/TIMELINE ==== */}
      <TimelinePreview />

      {/* ==== SECURE COMMUNICATIONS HUB ==== */}
      <SecureComms />
    </main>
  );
}