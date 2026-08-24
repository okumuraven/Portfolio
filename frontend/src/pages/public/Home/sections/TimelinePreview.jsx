import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTimeline } from "../../../../api/timeline.api";
import styles from "./TimelinePreview.module.css";

export default function TimelinePreview() {
  // Fetch latest timeline events (visible, sorted by most recent date_start)
  const { data, isLoading, error } = useQuery({
    queryKey: ["timeline-preview"],
    queryFn: () => fetchTimeline({ order: "date_start_desc", visible: true, limit: 5 }),
  });
  const milestones = data?.data || [];

  return (
    <section className={`${styles.section} deskBg`}>
      <div className={`${styles.log} torn paperShadow`}>
        <div className={`${styles.logTitle} ink`}>LATEST_MILESTONES</div>
        <div className={styles.perforation} />

        {isLoading ? (
          <div className={`${styles.entry} ink`}>loading case log...</div>
        ) : error ? (
          <div className={`${styles.entry} ink`}>[could not fetch milestones]</div>
        ) : (
          milestones.map((item, idx) => (
            <div key={item.id || idx} className={styles.entry}>
              <span className={styles.entryDot} />
              <div>
                <div className={`${styles.entryTitle} ink`}>
                  {item.title}
                  {item.date_start && <span className={styles.entryDate}> ({item.date_start.slice(0, 7)})</span>}
                </div>
                {(item.description || item.detail) && (
                  <div className={`${styles.entryDetail} bodyCopy`}>{item.description || item.detail}</div>
                )}
              </div>
            </div>
          ))
        )}

        <div className={styles.barcode} />
      </div>
    </section>
  );
}
