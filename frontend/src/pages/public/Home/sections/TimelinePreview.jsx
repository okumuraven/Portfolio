import React from "react";
import styles from "../Home.module.css";

/**
 * TimelinePreview Section
 * - Shows a quick, recent snapshot of achievements or career milestones.
 * - Later, fetch achievements dynamically.
 */
const DEMO_TIMELINE = [
  { title: "AWS Certified", date: "2024-08", detail: "Amazon Web Services Solutions Architect." },
  { title: "Launched EdTech App", date: "2025-03", detail: "Built and shipped a mobile learning platform." },
  { title: "Lead Dev – Cyber Analytics", date: "2025-10", detail: "Developed analytics dashboard for SIEM data." }
];

export default function TimelinePreview() {
  return (
    <section className={styles.timelinePreview}>
      <h2>Latest Milestones</h2>
      <ul>
        {DEMO_TIMELINE.map((item, idx) => (
          <li key={idx}>
            <strong>{item.title}</strong> <span>({item.date})</span>
            <br />
            <span className={styles.timelineDetail}>{item.detail}</span>
          </li>
        ))}
      </ul>
      {/* Optionally, add a 'See full timeline' button here */}
    </section>
  );
}