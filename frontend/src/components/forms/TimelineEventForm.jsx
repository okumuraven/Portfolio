import React, { useState, useEffect } from 'react';
import styles from './TimelineEventForm.module.css';

const initialState = {
  title: '',
  date_start: '',
  date_end: '',
  description: '',
  type: '',
  icon: '',
  proof_link: '',
  visible: true,
  reviewed: false,
  automated: false,
  provider: null,
  provider_event_id: null,
  skill_ids: [],
  order: null,
  source: 'internal',
};

const TimelineEventForm = ({
  initialValues = initialState,
  onSubmit,
  loading = false,
  submitText = 'SUBMIT_DATA',
  onCancel,
  extraFields,
}) => {
  const [form, setForm] = useState({ ...initialState, ...initialValues });
  const [error, setError] = useState('');

  useEffect(() => {
    setForm({ ...initialState, ...initialValues });
    setError('');
  }, [initialValues]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    let val = value;
    if (type === 'checkbox') val = checked;
    // For number fields, parse as number unless blank
    if (type === 'number' && value !== '') val = Number(value);
    setForm(f => ({
      ...f,
      [name]: val,
    }));
    if (error) setError('');
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.title.trim() || !form.date_start) {
      setError('[ SYSTEM_ERR ]: Title and Start Date are strictly required.');
      return;
    }
    setError('');

    // Build payload ready for strict backend validation!
    const payload = {
      title: form.title,
      type: form.type,
      date_start: form.date_start,
      date_end: form.date_end || null,
      description: form.description || null,
      icon: form.icon || null,
      proof_link: form.proof_link || null,
      visible: !!form.visible,
      reviewed: !!form.reviewed,
      automated: !!form.automated,
      provider: form.provider || null,
      provider_event_id: form.provider_event_id || null,
      skill_ids: Array.isArray(form.skill_ids) ? form.skill_ids : [],
      order:
        form.order !== null &&
        form.order !== '' &&
        !isNaN(form.order)
          ? Number(form.order)
          : null,
      source: form.source || 'internal',
    };

    // Only include order if set
    if (payload.order === null) delete payload.order;

    // Debug: see what's being sent
    console.log('[DEBUG] handleSubmit payload sent to backend:', payload);

    if (typeof onSubmit === 'function') {
      onSubmit(payload);
    } else {
      console.warn('onSubmit prop not wired!');
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} autoComplete="off">
      <div className={styles.inputGroup}>
        <label className={styles.label}>Title *</label>
        <input
          className={styles.input}
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          placeholder="e.g. Event Title"
        />
      </div>
      <div className={styles.inputGroup}>
        <label className={styles.label}>Start Date *</label>
        <input
          className={styles.input}
          type="date"
          name="date_start"
          value={form.date_start}
          onChange={handleChange}
          required
        />
      </div>
      <div className={styles.inputGroup}>
        <label className={styles.label}>End Date</label>
        <input
          className={styles.input}
          type="date"
          name="date_end"
          value={form.date_end}
          onChange={handleChange}
        />
      </div>
      <div className={styles.inputGroup}>
        <label className={styles.label}>Description</label>
        <textarea
          className={styles.textarea}
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
        />
      </div>
      <div className={styles.inputGroup}>
        <label className={styles.label}>Type</label>
        <input
          className={styles.input}
          name="type"
          value={form.type}
          onChange={handleChange}
          placeholder="e.g. milestone, award, etc."
        />
      </div>
      <div className={styles.inputGroup}>
        <label className={styles.label}>Icon</label>
        <input
          className={styles.input}
          name="icon"
          value={form.icon}
          onChange={handleChange}
          placeholder="Optional icon url or name"
        />
      </div>
      <div className={styles.inputGroup}>
        <label className={styles.label}>Proof Link</label>
        <input
          className={styles.input}
          name="proof_link"
          value={form.proof_link}
          onChange={handleChange}
          placeholder="Optional proof url"
        />
      </div>
      {/* Checkboxes for booleans */}
      <div className={styles.checkboxGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            name="visible"
            checked={!!form.visible}
            onChange={handleChange}
          />
          Visible
        </label>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            name="reviewed"
            checked={!!form.reviewed}
            onChange={handleChange}
          />
          Reviewed
        </label>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            name="automated"
            checked={!!form.automated}
            onChange={handleChange}
          />
          Automated
        </label>
      </div>
      {extraFields}
      {error && <div className={styles.errorMsg}>{error}</div>}
      <div className={styles.actionsRow}>
        <button className={styles.submitBtn} type="submit" disabled={loading}>
          {loading ? 'Saving...' : submitText}
        </button>
        {onCancel && (
          <button className={styles.cancelBtn} type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TimelineEventForm;