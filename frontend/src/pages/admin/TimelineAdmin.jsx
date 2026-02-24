import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchTimeline,
  createTimelineEvent,
  updateTimelineEvent,
  deleteTimelineEvent,
} from "../../api/timeline.api";
import TimelineAdminTable from "../../components/timeline/TimelineAdminTable";
import TimelineForm from "../../components/timeline/TimelineForm";
import { useAuth } from "../../hooks/useAuth";
import styles from "./TimelineAdmin.module.css";

const getTimelineItems = (data) =>
  Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];

const TimelineAdmin = () => {
  const queryClient = useQueryClient();
  const { loading } = useAuth(); // Show system loading if user context is loading

  // Query for timeline events
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-timeline"],
    queryFn: fetchTimeline,
  });

  // Mutations for create, edit, delete
  const addMutation = useMutation({
    mutationFn: createTimelineEvent,
    onSuccess: () => {
      console.log('[DEBUG] addMutation onSuccess - invalidating timeline');
      queryClient.invalidateQueries({ queryKey: ["admin-timeline"] });
    },
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, ...updates }) => updateTimelineEvent(id, updates),
    onSuccess: () => {
      console.log('[DEBUG] updateMutation onSuccess - invalidating timeline');
      queryClient.invalidateQueries({ queryKey: ["admin-timeline"] });
    },
  });
  const deleteMutation = useMutation({
    mutationFn: deleteTimelineEvent,
    onSuccess: () => {
      console.log('[DEBUG] deleteMutation onSuccess - invalidating timeline');
      queryClient.invalidateQueries({ queryKey: ["admin-timeline"] });
    },
  });

  if (loading || isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loader}>INITIALIZING TIMELINE LOGS...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          [ SYSTEM ERROR: UNABLE TO RETRIEVE TIMELINE LOGS ]<br /><br />
          <span style={{ fontSize: '0.75rem', color: '#aaa' }}>{error.message}</span>
        </div>
      </div>
    );
  }

  return (
    <section className={styles.container}>
      {/* HEADER */}
      <div className={styles.header}>
        <h2 className={styles.title}>TIMELINE_EVENT_RECORDS</h2>
      </div>

      {/* FORM AREA */}
      <div className={styles.formWrapper}>
        <TimelineForm
          mode="create"
          onSubmit={addMutation.mutate} // ✅ Mutation function directly, not object!
          isLoading={addMutation.isLoading}
        />
      </div>

      {/* TABLE AREA */}
      <div className={styles.tableWrapper}>
        <TimelineAdminTable
          items={getTimelineItems(data)}
          onEdit={updateMutation.mutate}
          onDelete={deleteMutation.mutate}
          loadingIds={{
            updating: updateMutation.isLoading,
            deleting: deleteMutation.isLoading,
          }}
        />
      </div>

    </section>
  );
};

export default TimelineAdmin;