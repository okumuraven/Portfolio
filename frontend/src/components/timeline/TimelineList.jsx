// src/components/timeline/TimelineList.jsx
import React from 'react';
import TimelineItem from './TimelineItem';
import styles from './TimelineList.module.css'; // Import the CSS

const TimelineList = ({
  items = [],
  compact = false, // Optional: for preview blocks
  className = '',
}) => {

  // Empty State Handling
  if (!items || items.length === 0) {
    return (
      <div className={`${styles.emptyState} ink`}>
        NO DATED ENTRIES ON FILE.
      </div>
    );
  }

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <ul
        className={`${styles.list} ${compact ? styles.listCompact : ''}`}
        aria-label="Case Chronology"
      >
        {items.map((ev, idx) => (
          <TimelineItem
            key={ev.id}
            event={ev}
            index={idx}
            compact={compact}
          />
        ))}
      </ul>
    </div>
  );
};

export default TimelineList;
