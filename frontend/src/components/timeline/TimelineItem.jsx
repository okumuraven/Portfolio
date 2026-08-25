// src/components/timeline/TimelineItem.jsx
import React from "react";
import { CasePin } from "../caseboard/CaseBoard";
import RedactedLink from "../caseboard/RedactedLink";
import styles from "./TimelineItem.module.css";

// Helper: Formats date cleanly (e.g., "Oct 2023")
function formatLogDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "UNKNOWN";
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short" });
}

// Each entry type gets its own evidence-tag color, echoing the arsenal's
// category colors — same visual language, different page.
const TYPE_COLORS = {
  skill: { bg: "#cdeecb", accent: "#1f9d55" },
  project: { bg: "#e4d1ef", accent: "#8b3fc9" },
  certificate: { bg: "#f7edad", accent: "#c9a400" },
  cert: { bg: "#f7edad", accent: "#c9a400" },
  milestone: { bg: "#f8ddb8", accent: "#d97a1f" },
};
const DEFAULT_TYPE_COLOR = { bg: "var(--dossier-manila)", accent: "#8a7a5c" };

function typeColor(type) {
  const key = (type || "").trim().toLowerCase();
  return TYPE_COLORS[key] || DEFAULT_TYPE_COLOR;
}

const TimelineItem = ({ event, index = 0, compact = false }) => {
  const {
    title,
    date_start,
    date_end,
    description,
    type,
    icon,
    proof_link,
    source_name,
    source_url,
  } = event;

  const color = typeColor(type);

  return (
    <li
      className={`${styles.item} ${compact ? styles.itemCompact : ""}`}
      style={{ "--note-bg": color.bg, "--note-accent": color.accent }}
    >
      <CasePin id={`chrono-${event.id ?? index}`} order={index + 1} className={styles.pin} />

      {/* The Data Card */}
      <div className={`${styles.card} paperShadow`}>
        {/* Header: Icon, Title, Type */}
        <div className={styles.header}>
          {icon && (
            <img
              src={icon}
              alt="Event Asset"
              className={styles.icon}
              onError={(e) => (e.target.style.display = "none")}
            />
          )}
          <h3 className={`${styles.title} ink`}>{title || "UNKNOWN_EVENT"}</h3>
          {type && <span className={`${styles.typeBadge} ink`}>{type}</span>}
        </div>

        {/* Timeline Dates */}
        <div className={`${styles.dateRow} ink`}>
          {date_start && (
            <span>
              INIT: <span className={styles.dateValue}>{formatLogDate(date_start)}</span>
            </span>
          )}

          {date_start && date_end && <span>{" // "}</span>}

          {date_end && (
            <span>
              END: <span className={styles.dateValue}>{formatLogDate(date_end)}</span>
            </span>
          )}

          {date_start && !date_end && (
            <>
              <span>{" // "}</span>
              <span className={styles.activeStatus}>STATUS: ONGOING</span>
            </>
          )}
        </div>

        {/* Description */}
        {!compact && description && (
          <div className={`${styles.description} bodyCopy`}>{description}</div>
        )}

        {/* Proof / Source links */}
        {(proof_link || source_url) && (
          <div className={styles.evidenceRow}>
            {proof_link && (
              <RedactedLink href={proof_link} target="_blank" rel="noopener noreferrer" stamp="VERIFIED">
                VERIFY_ASSET
              </RedactedLink>
            )}
            {source_url && (
              <RedactedLink href={source_url} target="_blank" rel="noopener noreferrer" stamp="SOURCE">
                {source_name ? `ORIGIN: ${source_name}` : "ACCESS_SOURCE"}
              </RedactedLink>
            )}
          </div>
        )}
      </div>
    </li>
  );
};

export default TimelineItem;
