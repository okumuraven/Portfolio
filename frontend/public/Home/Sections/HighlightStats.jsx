import React from "react";
import styles from "../Home.module.css";

const HIGHLIGHTS = [
  { label: "Projects", value: "12+", emoji: "💼" },
  { label: "Years Exp.", value: "5", emoji: "⌛" },
  { label: "Certs", value: "8", emoji: "🏅" },
  { label: "Client Satisfaction", value: "100%", emoji: "⭐" }
];

export default function HighlightStats() {
  return (
    <section className={styles.highlights}>
      {HIGHLIGHTS.map((h) => (
        <div key={h.label} className={styles.highlightCard}>
          <span className={styles.emoji}>{h.emoji}</span>
          <div>
            <strong>{h.value}</strong>
            <div className={styles.label}>{h.label}</div>
          </div>
        </div>
      ))}
    </section>
  );
}