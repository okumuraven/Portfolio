// src/components/timeline/TimelineItem.jsx
import React from 'react';
import styles from './TimelineItem.module.css'; // Import the CSS

// Helper: Formats date cleanly (e.g., "Oct 2023")
function formatLogDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'UNKNOWN';
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
}

const TimelineItem = ({ event, compact = false }) => {
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

  return (
    <li className={`${styles.item} ${compact ? styles.itemCompact : ''}`}>
      
      {/* The Glowing Timeline Node */}
      <div className={styles.node}></div>
      
      {/* The Data Card */}
      <div className={styles.card}>

        {/* Header: Icon, Title, Type */}
        <div className={styles.header}>
          {icon && (
            <img
              src={icon}
              alt="Event Asset"
              className={styles.icon}
              onError={(e) => (e.target.style.display = 'none')}
            />
          )}
          <h3 className={styles.title}>{title || 'UNKNOWN_EVENT'}</h3>
          {type && <span className={styles.typeBadge}>{type}</span>}
        </div>

        {/* Timeline Dates */}
        <div className={styles.dateRow}>
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
          <div className={styles.description}>{description}</div>
        )}

        {/* Proof / Verification Action */}
        {proof_link && (
          <a
            href={proof_link}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.proofLink}
          >
            [ VERIFY_ASSET ] &rarr;
          </a>
        )}

        {/* Source Attribution (Telemetry) */}
        {source_name && (
          <div className={styles.sourceRow}>
            <span className={styles.sourceLabel}>
              ORIGIN_NODE // <span className={styles.sourceValue}>{source_name}</span>
            </span>
            
            {source_url && (
              <a
                href={source_url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.sourceLink}
              >
                [ ACCESS_SOURCE ] &rarr;
              </a>
            )}
          </div>
        )}

      </div>
    </li>
  );
};

export default TimelineItem;