import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTimeline } from "../../../api/timeline.api";
import TimelineList from "../../../components/timeline/TimelineList";

const TimelinePage = ({ maxItems = null }) => {
  // Params for visible events, sorted by start date descending
  const params = { visible: true, order: "date_start_desc" };

  // React Query v5+: useQuery({queryKey, queryFn})
  const { data, isLoading, error } = useQuery({
    queryKey: ["timeline", params],
    queryFn: () => fetchTimeline(params),
  });

  const timelineItems =
    maxItems != null
      ? (data?.data || []).slice(0, maxItems)
      : data?.data || [];

  if (isLoading) return <div>Loading timeline…</div>;
  if (error)
    return (
      <div style={{ color: "red" }}>
        Failed to load timeline.<br />
        {error.message && <span>{error.message}</span>}
      </div>
    );

  return (
    <section aria-labelledby="timeline-heading" className="timeline-section">
      <h2 id="timeline-heading">Professional Timeline</h2>
      <TimelineList items={timelineItems} />
      {timelineItems.length === 0 && (
        <div style={{ color: "gray", marginTop: 16 }}>
          No milestones found. Check back soon!
        </div>
      )}
    </section>
  );
};

export default TimelinePage;