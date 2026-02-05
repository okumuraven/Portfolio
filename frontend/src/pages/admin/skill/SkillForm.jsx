// src/features/skills/SkillForm.jsx
import React, { useState } from 'react';
import styles from './SkillForm.module.css';

export default function SkillForm({ 
  initial = {}, 
  onSubmit, 
  onCancel, 
  submitLabel = "Save Config" 
}) {
  // Initialize state with defaults or provided data
  const [form, setForm] = useState({
    name: '',
    category: '',
    level: '',
    years: '',
    active: true,
    superpower: false,
    order: '',
    ...initial // Override defaults if editing
  });

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form className={styles.formCard} onSubmit={handleSubmit}>
      
      {/* --- GRID INPUTS --- */}
      <div className={styles.formGrid}>
        
        {/* Name */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>Skill Identifier</label>
          <input 
            className={styles.input} 
            name="name" 
            value={form.name} 
            onChange={handleChange} 
            placeholder="e.g. React.js" 
            required 
          />
        </div>

        {/* Category */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>Category / Tag</label>
          <input 
            className={styles.input} 
            name="category" 
            value={form.category} 
            onChange={handleChange} 
            placeholder="e.g. Frontend" 
            required 
          />
        </div>

        {/* Level */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>Proficiency</label>
          <input 
            className={styles.input} 
            name="level" 
            value={form.level} 
            onChange={handleChange} 
            placeholder="e.g. Expert / 95%" 
            required 
          />
        </div>

        {/* Years */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>Experience (Yrs)</label>
          <input 
            className={styles.input} 
            type="number" 
            name="years" 
            value={form.years} 
            onChange={handleChange} 
            placeholder="0" 
            min="0" 
          />
        </div>

        {/* Order */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>Sort Priority</label>
          <input 
            className={styles.input} 
            type="number" 
            name="order" 
            value={form.order} 
            onChange={handleChange} 
            placeholder="1" 
          />
        </div>
      </div>

      {/* --- OPTIONS ROW --- */}
      <div className={styles.optionsRow}>
        <label className={styles.checkboxLabel}>
          <input 
            type="checkbox" 
            name="active" 
            checked={form.active} 
            onChange={handleChange} 
          />
          <span className={styles.activeText}>STATUS: ACTIVE</span>
        </label>

        <label className={styles.checkboxLabel}>
          <input 
            type="checkbox" 
            name="superpower" 
            checked={form.superpower} 
            onChange={handleChange} 
          />
          <span className={styles.superText}>IS SUPERPOWER?</span>
        </label>
      </div>

      {/* --- ACTIONS --- */}
      <div className={styles.actionRow}>
        <button type="submit" className={`${styles.btn} ${styles.submitBtn}`}>
          {submitLabel}
        </button>
        
        {onCancel && (
          <button 
            type="button" 
            onClick={onCancel} 
            className={`${styles.btn} ${styles.cancelBtn}`}
          >
            CANCEL
          </button>
        )}
      </div>
    </form>
  );
}