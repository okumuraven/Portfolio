import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTimeline } from "../../../../api/timeline.api";
import { getProjects } from "../../../../api/projects.api";
import styles from "../Home.module.css";

export default function HighlightStats() {
  const { data: timelineData, isLoading: timelineLoading, error: timelineError } = useQuery({
    queryKey: ["timeline-stats"],
    queryFn: () => fetchTimeline({ visible: true, limit: 1000 }), // get enough for stats
  });

  const { data: projectsData, isLoading: projectsLoading, error: projectsError } = useQuery({
    queryKey: ["projects-stats"],
    queryFn: () => getProjects({ visible: true }),
  });

  const isLoading = timelineLoading || projectsLoading;
  const error = timelineError || projectsError;

  const stats = useMemo(() => {
    const events = timelineData?.data || [];
    const realProjects = Array.isArray(projectsData) ? projectsData : [];
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
    // Certifications: smarter check across all event types
    const rawCertifications = events.filter(ev => {
      // 1. Explicitly a certificate or credential type
      const typeMatches = ["certificate", "certification", "credential"].includes(ev.type?.toLowerCase());
      if (typeMatches) return true;
      
      // 2. Contains clear certificate keywords in title/description
      const combinedText = (ev.title + " " + (ev.description || ""));
      const textMatches = /(certificat|credential|badge|coursera|udemy)/i.test(combinedText);
      if (textMatches) return true;
      
      // 3. Skills with a proof link (cert_link added through the skills form)
      if (ev.type === "skill" && ev.proof_link) return true;
      
      return false;
    });

    // Deduplicate certificates to handle cases where they were added to both Skill and Timeline forms
    const uniqueIdentifiers = new Set();
    const certifications = rawCertifications.filter(cert => {
      // Create a unique key using the proof_link or normalized title
      const key = cert.proof_link ? cert.proof_link.trim().toLowerCase() : cert.title.trim().toLowerCase();
      if (uniqueIdentifiers.has(key)) {
        return false; // Skip duplicate
      }
      uniqueIdentifiers.add(key);
      return true;
    });
    // Clients: Category check on fetched projects + fallback to timeline descriptions
    const uniqueClients = new Set();
    
    // 1. Projects categorized as "Client"
    realProjects.forEach(proj => {
      if (proj.category?.toLowerCase() === "client") {
        uniqueClients.add(proj.title ? proj.title.trim().toLowerCase() : "unknown-client");
      }
    });

    // 2. Fallback: Any projects from timeline mentioning client/customer/partner
    projects.forEach(ev => {
      if (/(client|customer|partner)/i.test(ev.description || "")) {
        uniqueClients.add(ev.title ? ev.title.trim().toLowerCase() : "unknown-client");
      }
    });

    return {
      projects: projects.length,
      yearsExp,
      certifications: certifications.length,
      clients: uniqueClients.size,
    };
  }, [timelineData, projectsData]);

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