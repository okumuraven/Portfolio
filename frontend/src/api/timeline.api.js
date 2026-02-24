import http from './http';

// Fetch all timeline events, with optional query/filter params
export const fetchTimeline = (params = {}) =>
  http.get('/timeline', { params })
    .then(res => res.data);

// Fetch a single timeline event by ID
export const fetchTimelineById = (id) =>
  http.get(`/timeline/${id}`)
    .then(res => res.data);

// Fetch by provider/event_id (for external integrations)
export const fetchTimelineByProvider = (provider, provider_event_id) =>
  http.get('/timeline/by-provider/event', {
    params: { provider, provider_event_id }
  }).then(res => res.data);

// Create a timeline event (admin only)
export const createTimelineEvent = (payload) =>
  http.post('/timeline', payload)
    .then(res => res.data);

// Update a timeline event (admin only)
export const updateTimelineEvent = (id, payload) =>
  http.patch(`/timeline/${id}`, payload)
    .then(res => res.data);

// Delete a timeline event (admin only)
export const deleteTimelineEvent = (id) =>
  http.delete(`/timeline/${id}`)
    .then(res => res.data);

// --- Optionally, utility for getting top/latest milestones for Home ---
/**
 * Fetch just the N latest visible timeline events (for home/preview)
 */
export const fetchLatestMilestones = (count = 3, extraParams = {}) =>
  fetchTimeline({ visible: true, ...extraParams })
    .then(data => {
      // Assuming backend returns sorted, but slice in case
      return { ...data, data: (data.data || []).slice(0, count) };
    });
