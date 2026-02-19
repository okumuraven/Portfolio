import React, { useState } from "react";
import { usePersonas } from "../../features/personas/usePersonas";
import styles from "./Personas.module.css";

const initialFormState = {
  title: "",
  type: "current",
  period: "",
  summary: "",
  description: "",
  motivation: "",
  icon: "",
  accent_color: "#ff5500",
  cta: "",
  is_active: false,
  availability: "open",
  order: 1,
};

export default function PersonasAdminPage() {
  const {
    personas,
    isLoading,
    isError,
    error,
    createPersona,
    updatePersona,
    deletePersona,
    isCreating,
    isUpdating,
    isDeleting,
    refetch,
  } = usePersonas({ isAdmin: true });

  const [form, setForm] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  // Handle Input Change
  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" })); // Clear field errors on change
  };

  // Start Editing Existing
  const startEdit = (persona) => {
    setEditingId(persona.id);
    setForm({ ...persona });
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  // Cancel edit
  function cancelEdit() {
    setEditingId(null);
    setForm(initialFormState);
    setMessage("");
    setFieldErrors({});
  }

  // Validate form before submit
  function validateForm(form) {
    const errors = {};
    if (!form.title) errors.title = "Title is required.";
    if (!form.icon) errors.icon = "Icon is required (e.g. icon name or image url).";
    if (!form.cta) errors.cta = "Call To Action is required.";
    return errors;
  }

  // Payload matching backend contract
  const buildPayload = (form) => ({
    title: form.title.trim(),
    type: form.type,
    period: form.period || "",
    summary: form.summary || "",
    description: form.description || "",
    motivation: form.motivation || "",
    icon: form.icon,
    accent_color: form.accent_color || "#ff5500",
    cta: form.cta,
    is_active: !!form.is_active,
    availability: form.availability,
    order: Number(form.order) || 1,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateForm(form);
    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      setMessage("ERROR: Please fill all required fields.");
      return;
    }
    const payload = buildPayload(form);
    try {
      if (editingId) {
        await updatePersona({ id: editingId, data: payload });
        setMessage("SYSTEM: Persona Configuration Updated.");
      } else {
        await createPersona(payload);
        setMessage("SYSTEM: New Persona Initialized.");
      }
      setForm(initialFormState);
      setEditingId(null);
      setFieldErrors({});
      refetch();
    } catch (err) {
      setMessage(`ERROR: ${err?.message || "Could not save."}`);
    }
  };

  // Delete persona
  const handleDelete = async (id) => {
    if (!window.confirm("WARNING: Confirm deletion of this persona protocol?")) return;
    try {
      await deletePersona(id);
      setMessage("SYSTEM: Persona Deleted.");
      refetch();
    } catch (err) {
      setMessage(`ERROR: ${err?.message}`);
    }
  };

  if (isLoading) return <div className={styles.container}>Loading System Data...</div>;
  if (isError) return <div className={styles.container} style={{color:'red'}}>Error: {error?.message}</div>;

  return (
    <div className={styles.container}>
      {/* --- HEADER --- */}
      <div className={styles.header}>
        <div className={styles.title}>PERSONA_MANAGEMENT_PROTOCOL</div>
        {message && <div style={{ color: message.startsWith("ERROR") ? "#ff3333" : "#00ff88", fontSize: "0.9rem" }}>{message}</div>}
      </div>

      {/* --- DATA TABLE --- */}
      <div className={styles.tableContainer}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Title / Identity</th>
              <th>Status Type</th>
              <th>Availability</th>
              <th>Accent</th>
              <th>Priority</th>
              <th>State</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {personas.length === 0 && (
              <tr><td colSpan={7} style={{textAlign: "center", padding: "2rem"}}>NO DATA FOUND IN REGISTRY</td></tr>
            )}
            {personas.map((p) => (
              <tr key={p.id}>
                <td style={{ fontWeight: "bold", color: "#fff" }}>{p.title}</td>
                <td>
                  <span className={styles.badge}>{p.type}</span>
                </td>
                <td>{p.availability}</td>
                <td>
                  <div className={styles.colorDot} style={{ background: p.accent_color }}></div>
                  <span style={{ marginLeft: 8, fontSize: '0.8rem' }}>{p.accent_color}</span>
                </td>
                <td>#{p.order}</td>
                <td>
                  <span className={`${styles.badge} ${p.is_active ? styles.activeBadge : styles.inactiveBadge}`}>
                    {p.is_active ? "ONLINE" : "OFFLINE"}
                  </span>
                </td>
                <td>
                  <button className={`${styles.actionBtn} ${styles.editBtn}`} onClick={() => startEdit(p)}>EDIT</button>
                  <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => handleDelete(p.id)} disabled={isDeleting}>DELETE</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- CONFIGURATION FORM --- */}
      <div className={styles.formCard}>
        <h3 className={styles.title} style={{ fontSize: "1rem", marginBottom: "1.5rem" }}>
          {editingId ? ">> MODIFY_PERSONA_CONFIG" : ">> INITIALIZE_NEW_PERSONA"}
        </h3>
        
        <form onSubmit={handleSubmit}>
          {/* Row 1: Basics */}
          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Title (Role Name) <span className={styles.req}>*</span></label>
              <input name="title" className={styles.input} value={form.title} onChange={onChange} required />
              {fieldErrors.title && <span className={styles.error}>{fieldErrors.title}</span>}
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Type</label>
              <select name="type" className={styles.select} value={form.type} onChange={onChange}>
                <option value="current">Current Focus</option>
                <option value="past">Past Role</option>
                <option value="goal">Future Goal</option>
              </select>
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Sort Order</label>
              <input type="number" name="order" className={styles.input} value={form.order} onChange={onChange} />
            </div>
          </div>

          {/* Row 2: Appearance */}
          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Accent Color (Hex)</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="color" name="accent_color" value={form.accent_color} onChange={onChange} style={{ height: '45px', width: '60px' }} />
                <input name="accent_color" className={styles.input} value={form.accent_color} onChange={onChange} />
              </div>
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Call To Action Text <span className={styles.req}>*</span></label>
              <input name="cta" className={styles.input} value={form.cta} onChange={onChange} required placeholder="e.g. HIRE FOR SECURITY" />
              {fieldErrors.cta && <span className={styles.error}>{fieldErrors.cta}</span>}
            </div>
          </div>

          {/* Row 3: Details */}
          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Summary (Short)</label>
              <input name="summary" className={styles.input} value={form.summary} onChange={onChange} />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Availability</label>
              <select name="availability" className={styles.select} value={form.availability} onChange={onChange}>
                <option value="open">🟢 Open to Work</option>
                <option value="consulting">🟡 Consulting Only</option>
                <option value="closed">🔴 Closed</option>
              </select>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>
              Icon (URL or name) <span className={styles.req}>*</span>
            </label>
            <input name="icon" className={styles.input} value={form.icon} onChange={onChange} required placeholder="e.g. fa-shield-alt or image URL" />
            {fieldErrors.icon && <span className={styles.error}>{fieldErrors.icon}</span>}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Full Description</label>
            <textarea name="description" className={styles.textarea} rows={3} value={form.description} onChange={onChange} />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Motivation</label>
            <input name="motivation" className={styles.input} value={form.motivation} onChange={onChange} />
          </div>
          {/* Actions */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "2rem" }}>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" name="is_active" checked={form.is_active} onChange={onChange} style={{ transform: "scale(1.5)" }} />
              <span style={{fontFamily: 'Courier New', fontSize: '0.9rem'}}>SET_AS_ACTIVE_MODE</span>
            </label>
            <div>
              <button type="submit" className={styles.submitBtn} disabled={isCreating || isUpdating}>
                {editingId ? "UPDATE CONFIG" : "DEPLOY"}
              </button>
              {editingId && (
                <button type="button" className={styles.cancelBtn} onClick={cancelEdit}>
                  CANCEL
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}