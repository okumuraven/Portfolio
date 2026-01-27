import React from "react";
import styles from "./Home.module.css";
// Import your section components (create them if you haven't yet)
import Hero from "./sections/Hero";
import HighlightStats from "./sections/HighlightStats";
import TimelinePreview from "./sections/TimelinePreview";
import ContactCTA from "./sections/ContactCTA";

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

      {/* ==== HIGHLIGHTS/STATS ==== */}
      <HighlightStats />

      {/* ==== RECENT ACHIEVEMENTS/TIMELINE ==== */}
      <TimelinePreview />

      {/* ==== CONTACT/CALL-TO-ACTION ==== */}
      <ContactCTA />
    </main>
  );
}