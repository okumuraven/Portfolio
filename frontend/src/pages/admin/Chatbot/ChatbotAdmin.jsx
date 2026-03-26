import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getChatbotConfig, updateChatbotConfig } from "../../../api/chatbot.api";
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

  if (isLoading) return <div className={styles.loader}>[ FETCHING_SYSTEM_DATA... ]</div>;
  if (error) return <div className={styles.error}>[ ERROR_FETCHING_DATA ]</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>AI_ESTIMATOR_CONTROL</h2>
      </div>

      <form onSubmit={handleSubmit} className={styles.formCard}>

        <div className={styles.infoBox}>
          <p>The chatbot pricing tiers and professional rules are now <strong>PERMANENTly</strong> linked to the system core. You can only control the online status from this terminal.</p>
        </div>

        {/* ONLINE/OFFLINE TOGGLE */}
        <div className={styles.statusContainer}>
          <span className={`${styles.statusLabel} ${form.is_active ? styles.online : styles.offline}`}>
            {form.is_active ? ">> BOT IS ONLINE" : ">> BOT IS OFFLINE"}
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
          {mutation.isPending ? "UPDATING..." : "SAVE STATUS"}
        </button>

      </form>
    </div>
  );
}