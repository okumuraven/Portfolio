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
      <div className={styles.emptyState}>
        [ NO_TIMELINE_LOGS_AVAILABLE ]
      </div>
    );
  }

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <ul
        className={`${styles.list} ${compact ? styles.listCompact : ''}`}
        aria-label="Operational Timeline Events"
      >
        {items.map(ev => (
          <TimelineItem 
            key={ev.id} 
            event={ev} 
            compact={compact} 
          />
        ))}
      </ul>
    </div>
  );
};

export default TimelineList;