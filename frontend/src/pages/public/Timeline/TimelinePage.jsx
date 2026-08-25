// src/pages/public/Timeline/TimelinePage.jsx
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTimeline } from "../../../api/timeline.api";
import "../../../styles/dossier.css";
import { CaseBoardProvider, CasePin } from "../../../components/caseboard/CaseBoard";
import TimelineList from "../../../components/timeline/TimelineList";
import Seo from "../../../components/seo/Seo";
import styles from "./TimelinePage.module.css";

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
    <>
      <Seo
        title="Career Timeline — Okumu Joseph (Okumu Raven) | Software Engineer, Kenya"
        description="Career and project chronology of Okumu Joseph (Okumu Raven / Musundi), a software engineer and security researcher based in Kenya."
        path="/timeline"
      />
      <div className={`${styles.page} deskBg`}>
        <CaseBoardProvider>
        <section aria-labelledby="timeline-heading" className={styles.container}>
          {/* HEADER */}
          <div className={`${styles.header} torn paperShadow`}>
            <CasePin id="chronology-header" order={0} className={styles.headerPin} />
            <div className={`${styles.headerKicker} ink`}>SUSPECT ACTIVITY LOG</div>
            <h1 id="timeline-heading" className={`${styles.title} display`}>CASE CHRONOLOGY</h1>
            <p className={`${styles.subtitle} bodyCopy`}>
              Every dated entry in the file, strung together in the order it happened.
            </p>
          </div>

          {/* SYSTEM STATES & CONTENT */}
          {isLoading ? (
            <div className={`${styles.loader} ink`}>PULLING DATED ENTRIES...</div>
          ) : error ? (
            <div className={`${styles.loader} ink`}>
              SYSTEM ERROR: CHRONOLOGY FETCH FAILED.
              {error.message && <span className={styles.errorMsg}>{error.message}</span>}
            </div>
          ) : timelineItems.length === 0 ? (
            <div className={`${styles.loader} ink`}>NO DATED ENTRIES ON FILE.</div>
          ) : (
            <TimelineList items={timelineItems} />
          )}
        </section>
        </CaseBoardProvider>
      </div>
    </>
  );
};

export default TimelinePage;
