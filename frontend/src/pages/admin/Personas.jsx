import React, { useState } from "react";
import { usePersonas } from "../../features/personas/usePersonas";
import "../../styles/dossier.css";
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

  if (isLoading) return <div className={`${styles.container} ink`}>Loading case registry&hellip;</div>;
  if (isError) return <div className={`${styles.container} ${styles.loadError} ink`}>Error: {error?.message}</div>;

  return (
    <div className={styles.container}>
      {/* --- HEADER --- */}
      <div className={styles.header}>
        <div>
          <p className={`${styles.eyebrow} ink`}>{"// KNOWN ASSOCIATES"}</p>
          <h1 className={`${styles.title} display`}>Persona Registry</h1>
        </div>
        {message && (
          <div className={`${styles.message} ${message.startsWith("ERROR") ? styles.messageError : styles.messageOk} ink`}>
            {message}
          </div>
        )}
      </div>

      {/* --- DATA TABLE --- */}
      <div className={`${styles.tableContainer} paperShadow`}>
        <span className={`${styles.tableTab} ink`}>CASE LEDGER</span>
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
              <tr><td colSpan={7} className={styles.emptyRow}>NO RECORDS ON FILE</td></tr>
            )}
            {personas.map((p) => (
              <tr key={p.id}>
                <td data-label="Title / Identity" className={styles.identityCell}>{p.title}</td>
                <td data-label="Status Type">
                  <span className={styles.badge}>{p.type}</span>
                </td>
                <td data-label="Availability">{p.availability}</td>
                <td data-label="Accent">
                  <div className={styles.colorDot} style={{ background: p.accent_color }}></div>
                  <span className={styles.colorHex}>{p.accent_color}</span>
                </td>
                <td data-label="Priority">#{p.order}</td>
                <td data-label="State">
                  <span className={`${styles.badge} ${p.is_active ? styles.activeBadge : styles.inactiveBadge}`}>
                    {p.is_active ? "ACTIVE" : "SEALED"}
                  </span>
                </td>
                <td data-label="Actions">
                  <button className={`${styles.actionBtn} ${styles.editBtn}`} onClick={() => startEdit(p)}>EDIT</button>
                  <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => handleDelete(p.id)} disabled={isDeleting}>DELETE</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- CONFIGURATION FORM --- */}
      <div className={`${styles.formCard} paperShadow`}>
        <span className={`${styles.formTab} ink`}>
          {editingId ? "MODIFY RECORD" : "NEW INTAKE FORM"}
        </span>
        <h3 className={`${styles.formTitle} display`}>
          {editingId ? "Modify Persona File" : "Initialize New Persona"}
        </h3>

        <form onSubmit={handleSubmit}>
          {/* Row 1: Basics */}
          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label className={`${styles.label} ink`}>Title (Role Name) <span className={styles.req}>*</span></label>
              <input name="title" className={styles.input} value={form.title} onChange={onChange} required />
              {fieldErrors.title && <span className={styles.error}>{fieldErrors.title}</span>}
            </div>
            <div className={styles.inputGroup}>
              <label className={`${styles.label} ink`}>Type</label>
              <select name="type" className={styles.select} value={form.type} onChange={onChange}>
                <option value="current">Current Focus</option>
                <option value="past">Past Role</option>
                <option value="goal">Future Goal</option>
              </select>
            </div>
            <div className={styles.inputGroup}>
              <label className={`${styles.label} ink`}>Sort Order</label>
              <input type="number" name="order" className={styles.input} value={form.order} onChange={onChange} />
            </div>
          </div>

          {/* Row 2: Appearance */}
          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label className={`${styles.label} ink`}>Accent Color (Hex)</label>
              <div className={styles.colorRow}>
                <input type="color" name="accent_color" value={form.accent_color} onChange={onChange} className={styles.colorSwatch} />
                <input name="accent_color" className={styles.input} value={form.accent_color} onChange={onChange} />
              </div>
            </div>
            <div className={styles.inputGroup}>
              <label className={`${styles.label} ink`}>Call To Action Text <span className={styles.req}>*</span></label>
              <input name="cta" className={styles.input} value={form.cta} onChange={onChange} required placeholder="e.g. HIRE FOR SECURITY" />
              {fieldErrors.cta && <span className={styles.error}>{fieldErrors.cta}</span>}
            </div>
          </div>

          {/* Row 3: Details */}
          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label className={`${styles.label} ink`}>Summary (Short)</label>
              <input name="summary" className={styles.input} value={form.summary} onChange={onChange} />
            </div>
            <div className={styles.inputGroup}>
              <label className={`${styles.label} ink`}>Availability</label>
              <select name="availability" className={styles.select} value={form.availability} onChange={onChange}>
                <option value="open">Open to Work</option>
                <option value="consulting">Consulting Only</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={`${styles.label} ink`}>
              Icon (URL or name) <span className={styles.req}>*</span>
            </label>
            <input name="icon" className={styles.input} value={form.icon} onChange={onChange} required placeholder="e.g. fa-shield-alt or image URL" />
            {fieldErrors.icon && <span className={styles.error}>{fieldErrors.icon}</span>}
          </div>

          <div className={styles.inputGroup}>
            <label className={`${styles.label} ink`}>Full Description</label>
            <textarea name="description" className={styles.textarea} rows={3} value={form.description} onChange={onChange} />
          </div>
          <div className={styles.inputGroup}>
            <label className={`${styles.label} ink`}>Motivation</label>
            <input name="motivation" className={styles.input} value={form.motivation} onChange={onChange} />
          </div>
          {/* Actions */}
          <div className={styles.formFooter}>
            <label className={`${styles.checkboxLabel} ink`}>
              <input type="checkbox" name="is_active" checked={form.is_active} onChange={onChange} className={styles.checkbox} />
              <span>SET AS ACTIVE MODE</span>
            </label>
            <div>
              <button type="submit" className={styles.submitBtn} disabled={isCreating || isUpdating}>
                {editingId ? "UPDATE FILE" : "DEPLOY PERSONA"}
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
