import React from "react";
import { useQuery } from "react-query";
import styles from "../Home.module.css";
import http from "../../api/http";

// Fetch backend stats (adjust endpoint as needed)
function fetchStats() {
  return http.get('/stats').then(res => res.data);
}

const ICONS = {
  projects: "💼",
  yearsExp: "⌛",
  certs: "🏅",
  clients: "🤝",
  clientSatisfaction: "⭐"
};

export default function HighlightStats() {
  const { data, isLoading, error } = useQuery('stats', fetchStats);

  if (isLoading) return <section className={styles.highlights}>Loading...</section>;
  if (error) return <section className={styles.highlights}>Failed to load stats.</section>;

  const highlights = [
    { label: "Projects", value: data?.projects ?? "-", emoji: ICONS.projects },
    { label: "Years Exp.", value: data?.yearsExp ?? "-", emoji: ICONS.yearsExp },
    { label: "Certifications", value: data?.certs ?? "-", emoji: ICONS.certs },
    { label: "Clients", value: data?.clients ?? "-", emoji: ICONS.clients },
    { label: "Client Satisfaction", value: data?.clientSatisfaction ?? "-", emoji: ICONS.clientSatisfaction },
  ];

  return (
    <section className={styles.highlights}>
      {highlights.map((h) => (
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