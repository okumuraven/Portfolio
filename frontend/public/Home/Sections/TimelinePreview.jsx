import React from "react";
import { useQuery } from "react-query";
import styles from "../Home.module.css";
import { fetchLatestMilestones } from "../../api/timeline.api";

export default function TimelinePreview({ count = 3 }) {
  const { data, isLoading, error } = useQuery(['latest-milestones', count], () =>
    fetchLatestMilestones(count)
  );

  return (
    <section className={styles.timelinePreview}>
      <h2>Latest Milestones</h2>
      {isLoading ? (
        <ul><li>Loading milestones...</li></ul>
      ) : error ? (
        <ul><li>Failed to load milestones.</li></ul>
      ) : (
        <ul>
          {data?.data && data.data.length > 0 ? (
            data.data.map((item, i) => (
              <li key={item.id || i}>
                <strong>{item.title}</strong>{" "}
                <span>({item.date_start || item.date})</span>
                <br />
                {item.description && 
                  <span className={styles.timelineDetail}>{item.description}</span>
                }
              </li>
            ))
          ) : (
            <li>No milestones yet.</li>
          )}
        </ul>
      )}
      {/* Optional: Add a "See full timeline" link/button here */}
    </section>
  );
}