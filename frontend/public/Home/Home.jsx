import React from "react";
import styles from "./Home.module.css";
import Hero from "./sections/Hero";
import HighlightStats from "./sections/HighlightStats";
import TimelinePreview from "./sections/TimelinePreview";
import ContactCTA from "./sections/ContactCTA";

export default function Home() {
  return (
    <main className={styles.root}>
      <Hero />
      <HighlightStats />
      <TimelinePreview />
      <ContactCTA />
    </main>
  );
}