import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getChatbotConfig, updateChatbotConfig } from "../../../api/chatbot.api";
import "../../../styles/dossier.css";
import styles from "./ChatAdmin.module.css";

export default function ChatbotAdmin() {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["chatbot-config"],
    queryFn: getChatbotConfig
  });

  const [form, setForm] = useState({
    is_active: false
  });

  useEffect(() => {
    if (data) {
      setForm({
        is_active: Boolean(data.is_active)
      });
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: updateChatbotConfig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chatbot-config"] });
      alert(">> STATUS UPDATED ON SECURE STORAGE.");
    }
  });

  const handleChange = (e) => {
    const { checked } = e.target;
    setForm({ is_active: checked });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  if (isLoading) return <div className={`${styles.loader} ink`}>{"// PULLING CONSULTANT BRIEFING..."}</div>;
  if (error) return <div className={`${styles.error} ink`}>[ BRIEFING FILE COULD NOT BE RETRIEVED ]</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <p className={`${styles.kicker} ink`}>{"// CASE CONSULTANT UPLINK"}</p>
          <h2 className={`${styles.title} display`}>AI Estimator Control</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.formCard}>

        <div className={`${styles.infoBox} bodyCopy`}>
          <p>
            The chatbot&rsquo;s pricing tiers and professional rules are permanently
            linked to the system core &mdash; this terminal only controls whether the
            consultant is reachable to visitors.
          </p>
        </div>

        {/* ONLINE/OFFLINE TOGGLE */}
        <div className={styles.statusContainer}>
          <span className={`${styles.statusLabel} ink ${form.is_active ? styles.online : styles.offline}`}>
            {form.is_active ? "CONSULTANT ONLINE" : "CONSULTANT OFFLINE"}
          </span>
          <label className={styles.switch}>
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
            />
            <span className={styles.slider}></span>
          </label>
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className={styles.submitBtn}
        >
          {mutation.isPending ? "UPDATING…" : "SAVE STATUS"}
        </button>

      </form>
    </div>
  );
}