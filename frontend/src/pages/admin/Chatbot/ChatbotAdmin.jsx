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
    is_active: false,
    base_website_price: "",
    hourly_rate: "",
    system_prompt: ""
  });

  useEffect(() => {
    if (data) {
      setForm({
        is_active: Boolean(data.is_active),
        base_website_price: data.base_website_price || "",
        hourly_rate: data.hourly_rate || "",
        system_prompt: data.system_prompt || ""
      });
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: updateChatbotConfig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chatbot-config"] });
      alert(">> CONFIGURATION SAVED TO SECURE STORAGE.");
    }
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
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
        <h2 className={styles.title}>AI_ESTIMATOR_CONFIG</h2>
      </div>

      <form onSubmit={handleSubmit} className={styles.formCard}>

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

        <div className={styles.inputGroup}>
          <label className={styles.label}>BASE WEBSITE PRICE ($)</label>
          <input
            type="number"
            name="base_website_price"
            value={form.base_website_price}
            onChange={handleChange}
            className={styles.input}
            placeholder="e.g. 500"
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>HOURLY RATE ($)</label>
          <input
            type="number"
            name="hourly_rate"
            value={form.hourly_rate}
            onChange={handleChange}
            className={styles.input}
            placeholder="e.g. 45"
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>SYSTEM PROMPT (AI BRAIN INSTRUCTIONS)</label>
          <textarea
            name="system_prompt"
            value={form.system_prompt}
            onChange={handleChange}
            className={styles.textarea}
            placeholder="Instructions for the AI..."
          />
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className={styles.submitBtn}
        >
          {mutation.isPending ? "UPDATING..." : "SAVE CONFIGURATION"}
        </button>

      </form>
    </div>
  );
}