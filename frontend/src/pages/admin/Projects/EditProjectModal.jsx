import React, { useState, useEffect } from "react";
import Modal from "../../../components/feedback/Modal";
import { createProject, updateProject } from "../../../api/projects.api";
import { getSkills } from "../../../api/skills.api";
import { getPersonas } from "../../../api/personas.api";
import styles from "./EditProjectModal.module.css";

export default function EditProjectModal({ open, onClose, project, onSave }) {
  const isEdit = !!project;

  // --- STATE MANAGEMENT ---
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Client",
    skills: [],
    persona_ids: [],
    date_start: "",
    date_end: "",
    demo_link: "",
    repo_link: "",
    highlight: "",
    visible: true,
    order: "",
    collaborators: [],
    image: null,
  });

  const [skills, setSkills] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // --- DATA LOADING ---
  useEffect(() => {
    getSkills().then(res => setSkills(res.data || [])).catch(() => setSkills([]));
    getPersonas()
      .then(res => setPersonas(Array.isArray(res) ? res : []))  // <-- FIXED: use array directly!
      .catch(() => setPersonas([]));
  }, []);

  // --- FORM INITIALIZATION ---
  useEffect(() => {
    if (open) {
      setError("");
      if (project) {
        setForm({
          ...project,
          skills: Array.isArray(project.skills) ? project.skills.map(Number) : [],
          persona_ids: Array.isArray(project.persona_ids) ? project.persona_ids.map(Number) : [],
          collaborators: Array.isArray(project.collaborators) ? project.collaborators : [],
          image: null,
          highlight: project.highlight || "",
        });
      } else {
        setForm({
          title: "",
          description: "",
          category: "Client",
          skills: [],
          persona_ids: [],
          date_start: "",
          date_end: "",
          demo_link: "",
          repo_link: "",
          highlight: "",
          visible: true,
          order: "",
          collaborators: [],
          image: null,
        });
      }
    }
  }, [open, project]);

  function handleChange(e) {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setForm(f => ({ ...f, [name]: checked }));
    } else if (type === "file") {
      setForm(f => ({ ...f, image: files[0] }));
    } else if (type === "url" || type === "text") {
      setForm(f => ({ ...f, [name]: value.trim() }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  }

  function handleMultiChange(name, vals) {
    setForm(f => ({
      ...f,
      [name]: vals.map(Number)
    }));
  }

  function handleCollaboratorsChange(idx, field, value) {
    setForm(f => {
      const next = [...f.collaborators];
      next[idx] = { ...next[idx], [field]: value.trim() };
      return { ...f, collaborators: next };
    });
  }

  function addCollaborator() {
    setForm(f => ({
      ...f,
      collaborators: [...f.collaborators, { name: "", role: "", profile_link: "", avatarUrl: "" }],
    }));
  }

  function removeCollaborator(idx) {
    setForm(f => ({ ...f, collaborators: f.collaborators.filter((_, i) => i !== idx) }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const fd = new FormData();
      const standardFields = [
        "title", "description", "category", "date_start", "date_end",
        "demo_link", "repo_link", "highlight", "order"
      ];
      standardFields.forEach(k => {
        if (form[k] !== undefined && form[k] !== null) fd.append(k, form[k]);
      });
      fd.append("visible", form.visible);

      fd.append("skills", JSON.stringify(form.skills.map(Number)));
      fd.append("persona_ids", JSON.stringify(form.persona_ids.map(Number)));
      fd.append("collaborators", JSON.stringify(form.collaborators));
      if (form.image) fd.append("image", form.image);

      let saved;
      if (isEdit) {
        saved = await updateProject(project.id, fd);
      } else {
        saved = await createProject(fd);
      }
      onSave(saved);
      onClose();
    } catch (err) {
      setError(
        err?.response?.data?.error ||
        err?.message ||
        "Error executing save protocol."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? "MODIFY_PROJECT_CONFIG" : "INITIALIZE_NEW_PROJECT"}>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        {/* --- SECTION 1: IDENTITY --- */}
        <div className={styles.sectionHeader}>PROJECT_IDENTITY</div>
        <div className={styles.formGrid}>
          <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
            <label className={styles.label}>Title / Codename *</label>
            <input name="title" className={styles.input} value={form.title} onChange={handleChange} required minLength={2} placeholder="e.g. Project Alpha" />
          </div>
          <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
            <label className={styles.label}>Mission Brief (Description) *</label>
            <textarea name="description" className={styles.textarea} value={form.description} onChange={handleChange} required minLength={10} placeholder="Project details..." />
          </div>
          <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
            <label className={styles.label}>Highlight *</label>
            <input
              name="highlight"
              className={styles.input}
              value={form.highlight}
              onChange={handleChange}
              required
              minLength={2}
              placeholder="Short project summary or highlight"
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Category</label>
            <select name="category" className={styles.select} value={form.category} onChange={handleChange} required>
              <option>Client</option>
              <option>Personal</option>
              <option>Open Source</option>
              <option>Hackathon</option>
              <option>Other</option>
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Sort Order</label>
            <input name="order" type="number" className={styles.input} value={form.order || ""} onChange={handleChange} placeholder="1" />
          </div>
        </div>

        {/* --- SECTION 2: TIMELINE & ASSETS --- */}
        <div className={styles.sectionHeader}>TIMELINE_AND_LINKS</div>
        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Start Date</label>
            <input type="date" name="date_start" className={styles.input} value={form.date_start || ""} onChange={handleChange} />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>End Date</label>
            <input type="date" name="date_end" className={styles.input} value={form.date_end || ""} onChange={handleChange} />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Live Demo URL</label>
            <input name="demo_link" type="url" className={styles.input} value={form.demo_link || ""} onChange={handleChange} placeholder="https://" />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Repository URL</label>
            <input name="repo_link" type="url" className={styles.input} value={form.repo_link || ""} onChange={handleChange} placeholder="https://github.com/..." />
          </div>
          <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
            <label className={styles.label}>Cover Image</label>
            <div className={styles.fileInputWrapper}>
              <input name="image" type="file" accept="image/*" className={styles.fileInput} onChange={handleChange} />
            </div>
            {isEdit && <span style={{fontSize:'0.7rem', color:'#666', marginTop:'4px'}}>* Leaving blank keeps current image</span>}
          </div>
        </div>

        {/* --- SECTION 3: TECH STACK --- */}
        <div className={styles.sectionHeader}>TECH_STACK_CONFIGURATION</div>
        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Associated Skills</label>
            <select
              multiple
              className={styles.select}
              value={form.skills.map(String)}
              onChange={e => handleMultiChange("skills", Array.from(e.target.selectedOptions, o => o.value))}
            >
              {skills.map(s => <option value={String(s.id)} key={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Related Personas</label>
            <select
              multiple
              className={styles.select}
              value={form.persona_ids.map(String)}
              onChange={e => handleMultiChange("persona_ids", Array.from(e.target.selectedOptions, o => o.value))}
            >
              {personas.map(p => (
                <option value={String(p.id)} key={p.id}>
                  {p.title}{p.type ? ` (${p.type})` : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* --- SECTION 4: SQUAD --- */}
        <div className={styles.sectionHeader}>TEAM_ROSTER</div>
        <div className={styles.collabList}>
          {form.collaborators.map((col, idx) => (
            <div key={idx} className={styles.collabRow}>
              <input className={styles.collabInput} placeholder="Name" value={col.name} onChange={e => handleCollaboratorsChange(idx, "name", e.target.value)} required />
              <input className={styles.collabInput} placeholder="Role" value={col.role || ""} onChange={e => handleCollaboratorsChange(idx, "role", e.target.value)} />
              <input className={styles.collabInput} placeholder="Profile URL" value={col.profile_link || ""} onChange={e => handleCollaboratorsChange(idx, "profile_link", e.target.value)} />
              <input className={styles.collabInput} placeholder="Avatar URL" value={col.avatarUrl || ""} onChange={e => handleCollaboratorsChange(idx, "avatarUrl", e.target.value)} />
              <button type="button" className={styles.removeBtn} onClick={() => removeCollaborator(idx)}>X</button>
            </div>
          ))}
          <button type="button" className={styles.addCollabBtn} onClick={addCollaborator}>
             + ADD_OPERATIVE
          </button>
        </div>

        {/* --- SETTINGS & ACTIONS --- */}
        <div className={styles.inputGroup} style={{marginTop: '2rem'}}>
          <label className={styles.checkboxLabel}>
            <input name="visible" type="checkbox" className={styles.checkboxInput} checked={!!form.visible} onChange={handleChange} />
            <span>PROJECT_IS_PUBLICLY_VISIBLE</span>
          </label>
        </div>

        {error && <div style={{color: '#ff4444', marginTop: '1rem', fontFamily: 'Courier New'}}>[ERROR]: {error}</div>}

        <div className={styles.actions}>
          <button type="button" className={styles.btn} style={{border:'1px solid #333', color: '#888'}} onClick={onClose}>CANCEL</button>
          <button type="submit" className={`${styles.btn} ${styles.saveBtn}`} disabled={saving}>
            {saving ? "PROCESSING..." : isEdit ? "UPDATE_SYSTEM" : "DEPLOY_PROJECT"}
          </button>
        </div>
      </form>
    </Modal>
  );
}