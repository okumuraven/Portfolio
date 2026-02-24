import React from 'react';

// Helper: formats year/month or full date
function formatDate(date) {
  if (!date) return '';
  const options = { year: 'numeric', month: 'short' };
  return new Date(date).toLocaleDateString(undefined, options);
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
    // Add other fields as needed (skills, personas, etc)
  } = event;

  return (
    <li className={`timeline-item ${compact ? 'compact' : ''}`}>
      <div className="timeline-title">
        {icon && <img src={icon} alt="" className="timeline-icon" />}
        <strong>{title}</strong>
        {type && <span className={`timeline-type ${type}`}>{type}</span>}
      </div>
      <div className="timeline-date">
        {formatDate(date_start)}
        {date_end ? ` — ${formatDate(date_end)}` : ''}
      </div>
      {!compact && description && (
        <div className="timeline-desc">{description}</div>
      )}
      {proof_link && (
        <a
          href={proof_link}
          target="_blank"
          rel="noopener noreferrer"
          className="timeline-proof"
        >
          View Proof
        </a>
      )}
    </li>
  );
};

export default TimelineItem;