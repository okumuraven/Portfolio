import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  fetchTimeline,
  fetchTimelineById,
  fetchLatestMilestones,
  createTimelineEvent,
  updateTimelineEvent,
  deleteTimelineEvent,
} from "../../api/timeline.api";

/**
 * Public: Load timeline events (supports filters)
 */
export function useTimeline(params = {}) {
  return useQuery(["timeline", params], () => fetchTimeline(params), {
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Public: Load single timeline event by id
 */
export function useTimelineEvent(id) {
  return useQuery(["timeline-event", id], () => fetchTimelineById(id), {
    enabled: !!id,
  });
}

/**
 * Home: Load top N milestones for preview
 */
export function useTimelineMilestones(count = 3) {
  return useQuery(["timeline-milestones", count], () => fetchLatestMilestones(count), {
    staleTime: 1000 * 60 * 10,
  });
}

/**
 * Admin: CRUD Mutations
 */
export function useTimelineAdmin() {
  const queryClient = useQueryClient();

  // Create event
  const createMutation = useMutation(createTimelineEvent, {
    onSuccess: () => queryClient.invalidateQueries("timeline"),
  });
  // Update event
  const updateMutation = useMutation(
    ({ id, ...data }) => updateTimelineEvent(id, data),
    { onSuccess: () => queryClient.invalidateQueries("timeline") }
  );
  // Delete event
  const deleteMutation = useMutation(deleteTimelineEvent, {
    onSuccess: () => queryClient.invalidateQueries("timeline"),
  });

  return {
    createTimeline: createMutation,
    updateTimeline: updateMutation,
    deleteTimeline: deleteMutation,
  };
}
