import React from "react";
import styles from "../Home.module.css";

// Stand-in for now (later load achievements from backend)
const demoTimeline = [
  { title: "AWS Certified", date: "2024-08", detail: "Amazon AWS Solutions Architect" },
  { title: "Launched EdTech App", date: "2025-03", detail: "React Native, Node.js" },
  { title: "Lead Dev – Cyber Analytics", date: "2025-10", detail: "SIEM, ML" }
];

export default function TimelinePreview() {
  return (
    <section className={styles.timelinePreview}>
      <h2>Latest Milestones</h2>
      <ul>
        {demoTimeline.map((item, i) => (
          <li key={i}>
            <strong>{item.title}</strong> <span>({item.date})</span>
            <br />
            <span className={styles.timelineDetail}>{item.detail}</span>
          </li>
        ))}
      </ul>
      {/* Optional: Add a "See full timeline" link/button here */}
    </section>
  );
}