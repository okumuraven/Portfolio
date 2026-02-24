import React from 'react';
import { useQuery } from 'react-query';
import { fetchLatestMilestones } from '../../api/timeline.api';
import TimelineItem from './TimelineItem';

const TimelinePreview = ({ count = 3 }) => {
  const { data, isLoading, error } = useQuery(['milestones', count], () =>
    fetchLatestMilestones(count)
  );

  return (
    <section>
      <h2 className="milestone-header">LATEST MILESTONES</h2>
      {isLoading && <div>Loading milestones...</div>}
      {error && <div style={{ color: 'red' }}>Failed to load milestones.</div>}
      {(!isLoading && !error) && (
        <ul className="timeline-preview-list">
          {data?.data && data.data.length > 0 ? (
            data.data.map(ev => (
              <TimelineItem key={ev.id} event={ev} compact />
            ))
          ) : (
            <li>No milestones yet.</li>
          )}
        </ul>
      )}
    </section>
  );
};

export default TimelinePreview;