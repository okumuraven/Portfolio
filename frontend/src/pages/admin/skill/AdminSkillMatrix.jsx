import React, { useState } from 'react';
import { useSkills } from '../../../features/skills/useSkills';
import { useCreateSkill, useUpdateSkill, useDeleteSkill } from '../../../features/skills/useSkillMutations';
import { sortSkills } from '../../../features/skills/skillUtils';
import styles from './AdminSkillMatrix.module.css';

const CATEGORY_OPTIONS = [
  'Frontend', 'Backend', 'Security', 'Cloud', 'DevOps', 'Database', 'Soft Skill', 'Other'
];

const LEVEL_OPTIONS = [
  'Expert', 'Proficient', 'Intermediate', 'Learning', 'Interested'
];

function SkillForm({ initial = {}, onSubmit, submitLabel, onCancel, isLoading }) {
  const [form, setForm] = useState({
    name: initial.name || '',
    category: initial.category || '',
    level: initial.level || '',
    years: initial.years || '',
    active: initial.active ?? true,
    superpower: initial.superpower ?? false,
    order: initial.order ?? '',
    persona_ids: initial.persona_ids || [],
    icon: initial.icon || '',
    cert_link: initial.cert_link || '',
    project_links: initial.project_links || [],
  });

  React.useEffect(() => {
    if (!isLoading && !initial.id) {
      setForm({
        name: '',
        category: '',
        level: '',
        years: '',
        active: true,
        superpower: false,
        order: '',
        persona_ids: [],
        icon: '',
        cert_link: '',
        project_links: [],
      });
    }
    // eslint-disable-next-line
  }, [isLoading]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setForm(f => ({
        ...f,
        [name]: checked,
      }));
    } else if (name === 'project_links') {
      setForm(f => ({
        ...f,
        project_links: value.split(',').map(s => s.trim()).filter(Boolean)  // CSV to array
      }));
    } else if (name === 'persona_ids') {
      setForm(f => ({
        ...f,
        persona_ids: value.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n))
      }));
    } else {
      setForm(f => ({
        ...f,
        [name]: value,
      }));
    }
  };

  function handleSubmit(e) {
    e.preventDefault();
    // Prepare clean data for backend
    const cleanedForm = {
      ...form,
      years: form.years === '' ? 0 : Number(form.years),
      order: form.order === '' ? 0 : Number(form.order),
      persona_ids: Array.isArray(form.persona_ids) ? form.persona_ids : [],
      icon: form.icon === '' ? null : form.icon,
      cert_link: form.cert_link === '' ? null : form.cert_link,
      project_links: Array.isArray(form.project_links) ? form.project_links : [],
    };
    onSubmit(cleanedForm);
  }

  return (
    <form className={styles.formCard} onSubmit={handleSubmit}>
      <div className={styles.formGrid}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Skill Name</label>
          <input className={styles.input} name="name" value={form.name} onChange={handleChange} placeholder="e.g. React.js" required />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Category</label>
          <select
            className={styles.input}
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            {CATEGORY_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Proficiency Level</label>
          <select
            className={styles.input}
            name="level"
            value={form.level}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            {LEVEL_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Years Exp.</label>
          <input className={styles.input} name="years" type="number" value={form.years} onChange={handleChange} placeholder="0" min="0" />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Sort Order</label>
          <input className={styles.input} name="order" type="number" value={form.order} onChange={handleChange} placeholder="1" />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Persona IDs (CSV)</label>
          <input className={styles.input} name="persona_ids" value={form.persona_ids.join(',')} onChange={handleChange} placeholder="e.g. 1,2,3" />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Projects (CSV Links)</label>
          <input className={styles.input} name="project_links" value={form.project_links.join(',')} onChange={handleChange} placeholder="comma-separated links" />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Icon URL</label>
          <input className={styles.input} name="icon" value={form.icon || ''} onChange={handleChange} placeholder="Optional icon url" />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Certificate Link</label>
          <input className={styles.input} name="cert_link" value={form.cert_link || ''} onChange={handleChange} placeholder="Optional cert link" />
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div className={styles.checkboxGroup}>
          <label className={styles.checkboxLabel}>
            <input name="active" type="checkbox" checked={form.active} onChange={handleChange} />
            <span>ACTIVE STATUS</span>
          </label>
          <label className={styles.checkboxLabel}>
            <input name="superpower" type="checkbox" checked={form.superpower} onChange={handleChange} />
            <span style={{ color: form.superpower ? '#ffd700' : 'inherit' }}>IS SUPERPOWER?</span>
          </label>
        </div>
        <div style={{ display: 'flex', gap: '10px', width: 'auto' }}>
          <button type="submit" className={styles.submitBtn} disabled={isLoading}>{submitLabel}</button>
          {onCancel && (
            <button type="button" className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={onCancel} style={{ padding: '12px 24px' }}>
              CANCEL
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

export default function AdminSkillMatrix() {
  const { data: skills = [], isLoading, isError } = useSkills();
  const {
    mutate: createSkill,
    isLoading: creating,
    isSuccess: createSuccess,
    error: createError,
    reset: resetCreate
  } = useCreateSkill();
  const { mutate: updateSkill, isLoading: updating, error: updateError } = useUpdateSkill();
  const { mutate: deleteSkill, isLoading: deleting, error: deleteError } = useDeleteSkill();

  const [editingSkill, setEditingSkill] = useState(null);

  React.useEffect(() => {
    if (createSuccess) {
      const timer = setTimeout(() => resetCreate(), 2000);
      return () => clearTimeout(timer);
    }
  }, [createSuccess, resetCreate]);

  if (isLoading) return <div className={styles.container}><div style={{ padding: '2rem' }}>INITIALIZING MATRIX...</div></div>;
  if (isError) return <div className={styles.container}><div style={{ color: 'red', padding: '2rem' }}>SYSTEM ERROR: Failed to load data.</div></div>;

  const sortedSkills = sortSkills(skills);

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>SKILL_MATRIX_PROTOCOL</div>
        <div style={{ fontSize: '0.8rem', color: '#666', fontFamily: 'Courier New' }}>
          TOTAL_NODES: {skills.length}
        </div>
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Skill / Tech</th>
              <th>Category</th>
              <th>Level</th>
              <th>Years</th>
              <th>Superpower</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedSkills.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign: "center", padding: "2rem" }}>REGISTRY EMPTY</td></tr>
            )}
            {sortedSkills.map(skill => (
              <tr key={skill.id}>
                <td style={{ fontWeight: 'bold', color: '#fff' }}>{skill.name}</td>
                <td><span className={styles.categoryBadge}>{skill.category}</span></td>
                <td>{skill.level}</td>
                <td>{skill.years}y</td>
                <td style={{ textAlign: 'center' }}>
                  {skill.superpower && <span className={styles.superpower}>★</span>}
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span className={`${styles.activeDot} ${skill.active ? styles.on : ''}`}></span>
                </td>
                <td>
                  <button className={`${styles.actionBtn} ${styles.editBtn}`} onClick={() => setEditingSkill(skill)}>
                    [ EDIT ]
                  </button>
                  <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => {
                    if (window.confirm("WARNING: Purge this skill from registry?")) deleteSkill(skill.id);
                  }} disabled={deleting}>
                    [ X ]
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {deleteError && <div className={styles.error}>Error deleting skill: {deleteError.message}</div>}
      </div>
      <h3 className={styles.title} style={{ fontSize: '1rem', borderLeft: 'none', marginBottom: '1rem' }}>
        {">>"} INITIALIZE_NEW_SKILL_NODE
      </h3>
      <SkillForm
        submitLabel={creating ? "PROCESSING..." : createSuccess ? "DEPLOYED!" : "DEPLOY SKILL"}
        onSubmit={data => createSkill(data)}
        isLoading={creating}
      />
      {createError && <div className={styles.error}>Failed to deploy skill: {createError.message || "Unknown error"}</div>}
      {createSuccess && <div className={styles.success}>Skill successfully deployed!</div>}
      {editingSkill && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3 className={styles.title} style={{ marginBottom: '1rem' }}>MODIFY_SKILL_CONFIG</h3>
            <SkillForm
              initial={editingSkill}
              submitLabel={updating ? "UPDATING..." : "SAVE CONFIG"}
              onSubmit={data => {
                updateSkill({
                  id: editingSkill.id,
                  data,
                }, { onSuccess: () => setEditingSkill(null) });
              }}
              onCancel={() => setEditingSkill(null)}
              isLoading={updating}
            />
            {updateError && <div className={styles.error}>Failed to update skill: {updateError.message}</div>}
          </div>
        </div>
      )}
    </section>
  );
}