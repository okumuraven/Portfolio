import React, { useState } from "react";
import styles from "./ProfileFieldForm.module.css";

const ALLOWED_TYPES = [
  "string", "text", "social_link", "email", "image", "markdown", "phone"
];

export default function ProfileFieldForm({
  initialValues,
  onSubmit,
  onCancel,
  loading = false
}) {
  const [values, setValues] = useState({
    field: initialValues?.field || "",
    value: initialValues?.value || "",
    type: initialValues?.type || "string",
    sort_order: initialValues?.sort_order ?? 0,
    visible: typeof initialValues?.visible === "boolean" ? initialValues.visible : true,
  });

  const [errors, setErrors] = useState([]);

  const validate = () => {
    const errs = [];
    if (!values.field || values.field.length < 2) errs.push("Field is required (min 2 chars)");
    if (!/^[a-zA-Z0-9_-]+$/.test(values.field)) errs.push("Field: only letters, numbers, _ and -");
    if (!ALLOWED_TYPES.includes(values.type)) errs.push("Select a valid type");
    if (!values.value) errs.push("Value is required");
    if (values.type === "social_link" && values.value && !/^https?:\/\/\S+$/.test(values.value))
      errs.push("Social Link must be a valid URL");
    if (values.type === "email" && values.value && !/^[^@]+@[^@]+\.[^@]+$/.test(values.value))
      errs.push("Email must be valid");
    if (values.type === "phone" && values.value && !/^[\d+\-\s]{7,16}$/.test(values.value))
      errs.push("Phone must be a valid number");
    if (values.sort_order !== "" && !Number.isInteger(Number(values.sort_order)))
      errs.push("Sort order must be integer or blank");

    setErrors(errs);
    return errs.length === 0;
  };

  const handleChange = e => {
    const { name, value, type: inputType, checked } = e.target;
    setValues(v => ({
      ...v,
      [name]: inputType === "checkbox" ? checked : value
    }));
    if (errors.length) setErrors([]); // Clear errors on typing
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(values);
  };

  return (
    <div className={styles.formPanel}>
      <h3 className={styles.panelHeader}>
        {initialValues ? "MODIFY_PROFILE_RECORD" : "INITIALIZE_NEW_FIELD"}
      </h3>
      <form onSubmit={handleSubmit} autoComplete="off">
        {errors.length > 0 && (
          <div className={styles.errorBox}>
            <div style={{ marginBottom: "8px" }}>[ SYSTEM_ERR_DETECTED ]:</div>
            {errors.map((err, i) => (
              <div key={i} className={styles.errorItem}>{err}</div>
            ))}
          </div>
        )}
        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Field Key (DB Identity) *</label>
            <input
              className={styles.input}
              name="field"
              value={values.field}
              onChange={handleChange}
              disabled={!!initialValues}
              placeholder="e.g. linkedin, location"
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Data Type *</label>
            <select
              className={styles.select}
              name="type"
              value={values.type}
              onChange={handleChange}
            >
              {ALLOWED_TYPES.map(t => (
                <option key={t} value={t}>{t.toUpperCase()}</option>
              ))}
            </select>
          </div>
          <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
            <label className={styles.label}>Data Value *</label>
            <input
              className={styles.input}
              name="value"
              value={values.value}
              onChange={handleChange}
              placeholder="Enter the display text, URL, or email..."
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Sort Order</label>
            <input
              className={styles.input}
              name="sort_order"
              value={values.sort_order}
              onChange={handleChange}
              type="number"
              min="0"
              step="1"
            />
          </div>
        </div>
        <div className={styles.optionsRow}>
          <label className={styles.checkboxLabel}>
            <input
              className={styles.checkboxInput}
              name="visible"
              type="checkbox"
              checked={values.visible}
              onChange={handleChange}
            />
            <span style={{ color: values.visible ? "#00ff88" : "inherit" }}>STATUS: VISIBLE</span>
          </label>
        </div>
        <div className={styles.actionRow}>
          <button type="button" className={`${styles.btn} ${styles.cancelBtn}`} disabled={loading} onClick={onCancel}>
            CANCEL_OP
          </button>
          <button type="submit" className={`${styles.btn} ${styles.saveBtn}`} disabled={loading}>
            {loading ? "PROCESSING..." : (initialValues ? "UPDATE_RECORD" : "DEPLOY_FIELD")}
          </button>
        </div>
      </form>
    </div>
  );
}