import React, { useState, useEffect } from 'react';
import styles from './TimelineEventForm.module.css'; // Import exact styles

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
  submitText = 'DEPLOY_EVENT', // Default to technical styling
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
      order: form.order !== null && form.order !== '' && !isNaN(form.order) ? Number(form.order) : null,
      source: form.source || 'internal',
    };

    if (payload.order === null) delete payload.order;

    console.log('[DEBUG] handleSubmit payload sent to backend:', payload);

    if (typeof onSubmit === 'function') {
      onSubmit(payload);
    } else {
      console.warn('onSubmit prop not wired!');
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} autoComplete="off">
      
      {/* Error Output */}
      {error && <div className={styles.errorBox}>{error}</div>}

      {/* Grid Layout for Inputs */}
      <div className={styles.formGrid}>
        
        {/* ROW 1 */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>Event Title *</label>
          <input
            className={styles.input}
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            disabled={loading}
            maxLength={256}
            placeholder="e.g. Certified Ethical Hacker"
            autoFocus
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Event Type</label>
          <input
            className={styles.input}
            name="type"
            value={form.type}
            onChange={handleChange}
            disabled={loading}
            maxLength={32}
            placeholder="e.g. Certification, Role, Milestone"
          />
        </div>

        {/* ROW 2 */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>Init Date (Start) *</label>
          <input
            className={styles.input}
            type="date"
            name="date_start"
            value={form.date_start}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Term Date (End)</label>
          <input
            className={styles.input}
            type="date"
            name="date_end"
            value={form.date_end}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        {/* ROW 3: Full Width Description */}
        <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
          <label className={styles.label}>Event Log (Description)</label>
          <textarea
            className={styles.textarea}
            name="description"
            value={form.description}
            onChange={handleChange}
            disabled={loading}
            maxLength={1024}
            rows={3}
            placeholder="Detail the milestone, responsibilities, or outcome..."
          />
        </div>

        {/* ROW 4 */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>Icon Asset (URL)</label>
          <input
            className={styles.input}
            name="icon"
            value={form.icon}
            onChange={handleChange}
            disabled={loading}
            maxLength={255}
            placeholder="https://..."
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Verification Link</label>
          <input
            className={styles.input}
            name="proof_link"
            value={form.proof_link}
            onChange={handleChange}
            disabled={loading}
            maxLength={1024}
            placeholder="Link to Certificate, Repo, etc."
          />
        </div>
        
      </div> {/* End Form Grid */}

      {/* ROW 5: Switches / System Flags */}
      <div className={styles.optionsRow}>
        <label className={styles.checkboxLabel}>
          <input
            className={styles.checkboxInput}
            type="checkbox"
            name="visible"
            checked={!!form.visible}
            onChange={handleChange}
            disabled={loading}
          />
          <span style={{color: form.visible ? '#00ff88' : 'inherit'}}>STATUS: VISIBLE</span>
        </label>

        <label className={styles.checkboxLabel}>
          <input
            className={styles.checkboxInput}
            type="checkbox"
            name="reviewed"
            checked={!!form.reviewed}
            onChange={handleChange}
            disabled={loading}
          />
          <span style={{color: form.reviewed ? '#ff5500' : 'inherit'}}>FLAG: REVIEWED</span>
        </label>

        <label className={styles.checkboxLabel}>
          <input
            className={styles.checkboxInput}
            type="checkbox"
            name="automated"
            checked={!!form.automated}
            onChange={handleChange}
            disabled={loading}
          />
          <span style={{color: form.automated ? '#00e5ff' : 'inherit'}}>TYPE: AUTOMATED</span>
        </label>
      </div>

      {/* Extra Fields Extensibility */}
      {extraFields && (
        <div className={`${styles.inputGroup} ${styles.fullWidth}`} style={{marginTop: '1rem'}}>
          {typeof extraFields === 'function' ? extraFields(form, handleChange) : extraFields}
        </div>
      )}

      {/* Actions */}
      <div className={styles.actionRow}>
        {onCancel && (
          <button 
            className={`${styles.btn} ${styles.cancelBtn}`} 
            type="button" 
            onClick={onCancel}
            disabled={loading}
          >
            CANCEL_OP
          </button>
        )}
        <button 
          className={`${styles.btn} ${styles.saveBtn}`} 
          type="submit" 
          disabled={loading}
        >
          {loading ? 'PROCESSING...' : submitText}
        </button>
      </div>

    </form>
  );
};

export default TimelineEventForm;