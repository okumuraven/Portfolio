import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTimeline } from "../../../../api/timeline.api";// update path if needed
import styles from "../Home.module.css";

export default function TimelinePreview() {
  // Fetch latest timeline events (visible, sorted by most recent date_start)
  const { data, isLoading, error } = useQuery({
    queryKey: ["timeline-preview"],
    queryFn: () => fetchTimeline({ order: "date_start_desc", visible: true, limit: 5 }),
  });
  const milestones = data?.data || [];

  return (
    <section className={styles.timelinePreview}>
      <h2>Latest Milestones</h2>
      <ul>
        {isLoading ? (
          <li>Loading...</li>
        ) : error ? (
          <li>[Could not fetch milestones]</li>
        ) : (
          milestones.map((item, idx) => (
            <li key={item.id || idx}>
              <strong>{item.title}</strong>{" "}
              {item.date_start && <span>({item.date_start.slice(0, 7)})</span>}
              <br />
              <span className={styles.timelineDetail}>
                {item.description || item.detail}
              </span>
            </li>
          ))
        )}
      </ul>
      {/* Optionally, add a 'See full timeline' button here */}
    </section>
  );
}