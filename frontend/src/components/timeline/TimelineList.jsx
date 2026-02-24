import React from 'react';
import TimelineItem from './TimelineItem';

const TimelineList = ({
  items = [],
  compact = false, // Optional: for preview blocks
  className = '',
}) => {
  if (!items || items.length === 0)
    return <div className="timeline-list-empty">No timeline events found.</div>;

  return (
    <ul
      className={`timeline-list ${compact ? 'timeline-list-compact' : ''} ${className}`}
      aria-label="Timeline events"
    >
      {items.map(ev => (
        <TimelineItem key={ev.id} event={ev} compact={compact} />
      ))}
    </ul>
  );
};

export default TimelineList;