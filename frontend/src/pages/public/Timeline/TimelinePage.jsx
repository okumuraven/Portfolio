// src/pages/public/Timeline/TimelinePage.jsx
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTimeline } from "../../../api/timeline.api";
import TimelineList from "../../../components/timeline/TimelineList";
import styles from "./TimelinePage.module.css"; // Import the CSS

const TimelinePage = ({ maxItems = null }) => {
  // Params for visible events, sorted by start date descending
  const params = { visible: true, order: "date_start_desc" };

  const { data, isLoading, error } = useQuery({
    queryKey: ["timeline", params],
    queryFn: () => fetchTimeline(params),
  });

  const timelineItems =
    maxItems != null
      ? (data?.data || []).slice(0, maxItems)
      : data?.data || [];

  return (
    <section aria-labelledby="timeline-heading" className={styles.container}>
      
      {/* HEADER */}
      <div className={styles.header}>
        <h1 id="timeline-heading" className={styles.title}>
          OPERATIONAL <span>TIMELINE</span>
        </h1>
          <p className={styles.subtitle}>{"// CHRONOLOGICAL_EVENT_LOG"}</p>
      </div>

      {/* SYSTEM STATES & CONTENT */}
      {isLoading ? (
        <div className={styles.loader}>[ INITIALIZING_TIMELINE_DATA... ]</div>
      ) : error ? (
        <div className={styles.error}>
          [ SYSTEM_ERROR: TIMELINE_FETCH_FAILED ]
          {error.message && <span className={styles.errorMsg}>{error.message}</span>}
        </div>
      ) : timelineItems.length === 0 ? (
        <div className={styles.empty}>
          [ NO_TIMELINE_RECORDS_FOUND ]
        </div>
      ) : (
        // Renders the list component (We will style this next!)
        <TimelineList items={timelineItems} />
      )}
      
    </section>
  );
};

export default TimelinePage;