import React from "react";
import styles from "../Home.module.css";

/**
 * HighlightStats Section
 * - Show off best stats or milestones.
 * - Can fetch live data in future, currently hard-coded for demo.
 */
const HIGHLIGHTS = [
  { label: "Projects", value: "12+", emoji: "💼" },
  { label: "Years Exp.", value: "5", emoji: "⌛" },
  { label: "Certifications", value: "8", emoji: "🏅" },
  { label: "Clients", value: "10+", emoji: "🤝" }
];

export default function HighlightStats() {
  return (
    <section className={styles.highlights}>
      {HIGHLIGHTS.map((item) => (
        <div key={item.label} className={styles.highlightCard}>
          <span className={styles.emoji}>{item.emoji}</span>
          <div>
            <span className={styles.highlightValue}>{item.value}</span>
            <div className={styles.label}>{item.label}</div>
          </div>
        </div>
      ))}
    </section>
  );
}