import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTimeline } from "../../../../api/timeline.api";
import styles from "../Home.module.css";

export default function HighlightStats() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["timeline-stats"],
    queryFn: () => fetchTimeline({ visible: true, limit: 1000 }), // get enough for stats
  });

  const stats = useMemo(() => {
    const events = data?.data || [];
    // Projects
    const projects = events.filter(ev => ev.type === "project");
    // Earliest event for experience
    let yearsExp = 0;
    const experiences = events.filter(ev => ["persona", "skill", "project"].includes(ev.type) && ev.date_start);
    if (experiences.length) {
      const minDate = experiences
        .map(ev => new Date(ev.date_start))
        .reduce((min, d) => (d < min ? d : min), new Date());
      yearsExp = Math.max(1, Math.floor((Date.now() - minDate) / (1000 * 60 * 60 * 24 * 365)));
    }
    // Certifications: skills/releases/events with a cert pattern
    const certifications = events.filter(ev =>
      (ev.type === "skill" && /cert/i.test(ev.title + " " + ev.description)) ||
      (ev.type === "release" && /cert/i.test(ev.title + " " + ev.description))
    );
    // Clients: projects mentioning client, or with a client field
    const clients = projects.filter(ev =>
      /(client|customer|partner)/i.test(ev.description)
    );

    return {
      projects: projects.length,
      yearsExp,
      certifications: certifications.length,
      clients: clients.length,
    };
  }, [data]);

  const highlights = [
    { label: "Projects", value: `${stats.projects}+`, emoji: "💼" },
    { label: "Years Exp.", value: stats.yearsExp, emoji: "⌛" },
    { label: "Certifications", value: stats.certifications, emoji: "🏅" },
    { label: "Clients", value: `${stats.clients}+`, emoji: "🤝" }
  ];

  return (
    <section className={styles.highlights}>
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Unable to load stats</div>
      ) : (
        highlights.map(item => (
          <div key={item.label} className={styles.highlightCard}>
            <span className={styles.emoji}>{item.emoji}</span>
            <div>
              <span className={styles.highlightValue}>{item.value}</span>
              <div className={styles.label}>{item.label}</div>
            </div>
          </div>
        ))
      )}
    </section>
  );
}