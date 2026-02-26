import React from 'react';
import styles from './TimelineItem.module.css';

// Helper: Formats the date cleanly (e.g., "Oct 2023")
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
    // profile_link // <-- uncomment if you add this on backend
  } = event;

  return (
    <li className={`${styles.item} ${compact ? styles.itemCompact : ''}`}>
      <div className={styles.node}></div>
      <div className={styles.card}>
        <div className={styles.header}>
          {icon && (
            <img
              src={icon}
              alt="Event Asset"
              className={styles.icon}
              onError={(e) => e.target.style.display = 'none'}
            />
          )}
          <h3 className={styles.title}>{title || 'UNKNOWN_EVENT'}</h3>
          {type && <span className={styles.typeBadge}>{type}</span>}
        </div>
        <div className={styles.dateRow}>
          {date_start && (
            <span>INIT: <span className={styles.dateValue}>{formatLogDate(date_start)}</span></span>
          )}
          {date_start && date_end && <span>{"//"}</span>}
          {date_end && (
            <span>END: <span className={styles.dateValue}>{formatLogDate(date_end)}</span></span>
          )}
          {date_start && !date_end && (
            <>
              <span>{"//"}</span>
              <span className={styles.activeStatus}>STATUS: ONGOING</span>
            </>
          )}
        </div>
        {/* Description (Hidden in compact mode) */}
        {!compact && description && (
          <div className={styles.description}>
            {description}
          </div>
        )}
        {/* Proof / Verification Action Button */}
        {proof_link && (
          <a
            href={proof_link}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.proofLink}
          >
            [ View Proof ] &rarr;
          </a>
        )}
        {/* Example for future: if you want a profile button
        {profile_link && (
          <a
            href={profile_link}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.profileLink}
          >
            [ View Profile ] &rarr;
          </a>
        )}
        */}
      </div>
    </li>
  );
};

export default TimelineItem;