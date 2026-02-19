import React, { useState, useEffect, useCallback } from "react";
import { getProjects, deleteProject } from "../../../api/projects.api";
import EditProjectModal from "./EditProjectModal";
import styles from "./ProjectsAdminPage.module.css";

// Set your backend API base here - update in production if needed!
const API_BASE = "http://localhost:5000";
// The fallback image must be in your `/public` folder, so always fast.
const FALLBACK_IMG = "/default-thumb.png";

// Centralized helper for server-aligned project images (never stress the backend unnecessarily)
function getImageSrc(img) {
  if (!img) return FALLBACK_IMG; // fallback!
  // If already a remote URL
  if (/^https?:\/\//.test(img)) return img;
  // If has backend storage path (most common: "/storage/projects/...")
  if (img.startsWith("storage/projects")) return `${API_BASE}/${img}`;
  if (img.startsWith("/storage/projects")) return `${API_BASE}${img}`;
  // If just file name (without path)
  if (/^[A-Za-z0-9\-_]+\.(jpe?g|png|webp|gif)$/i.test(img)) return `${API_BASE}/storage/projects/${img}`;
  // Otherwise, fallback
  return FALLBACK_IMG;
}

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Normalize project data (ensure arrays and correct types)
  const normalizeProject = useCallback((proj) => ({
    ...proj,
    skills: Array.isArray(proj.skills) ? proj.skills : [],
    persona_ids: Array.isArray(proj.persona_ids) ? proj.persona_ids : [],
    image: proj.image || "",
    order: typeof proj.order === "number" ? proj.order : parseInt(proj.order) || 99,
  }), []);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      let result = await getProjects();
      let arr = Array.isArray(result)
        ? result
        : (result && Array.isArray(result.data) ? result.data : []);
      arr = arr.map(normalizeProject);
      arr.sort((a, b) => a.order - b.order);
      setProjects(arr);
    } catch (e) {
      setProjects([]);
      setError("Failed to load projects.");
    } finally {
      setLoading(false);
    }
  }, [normalizeProject]);

  useEffect(() => { loadProjects(); }, [loadProjects]);

  function handleEdit(p) { setEditing(p); setModalOpen(true); }
  function handleAdd() { setEditing(null); setModalOpen(true); }
  async function handleDelete(id) {
    if (!window.confirm("WARNING: Confirm deletion of project node?")) return;
    await deleteProject(id);
    loadProjects();
  }
  function handleModalClose() { setModalOpen(false); setEditing(null); }
  function handleProjectSaved() { handleModalClose(); loadProjects(); }

  // --- RENDER HELPERS ---
  const renderList = (list) => {
    if (!list || list.length === 0) return <span style={{color:'#666'}}>-</span>;
    return list.map((item, i) => (
      <span key={i} className={styles.chip}>{item}</span>
    ));
  };

  // To prevent infinite onError loops, track when error fallback is triggered per image
  const [imageErrorMap, setImageErrorMap] = useState({});
  const handleImgError = (projectId) => {
    setImageErrorMap((prev) => ({ ...prev, [projectId]: true }));
  };

  if (loading) return <div className={styles.loader}>INITIALIZING PROJECT REGISTRY...</div>;
  if (error) return <div className={styles.error}>SYSTEM ERROR: {error}</div>;

  return (
    <div className={styles.container}>
      {/* HEADER */}
      <div className={styles.header}>
        <div className={styles.title}>PROJECT_MANAGEMENT_PROTOCOL</div>
        <button className={styles.createBtn} onClick={handleAdd}>
          + DEPLOY NEW PROJECT
        </button>
      </div>
      {/* DATA GRID */}
      {projects.length === 0 ? (
        <div className={styles.loader}>NO PROJECT NODES DETECTED.</div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Preview</th>
                <th>Project Identity</th>
                <th>Category</th>
                <th>Tech Stack</th>
                <th>Persona ID</th>
                <th>Status</th>
                <th>Sort</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(project => (
                <tr key={project.id}>
                  {/* Thumbnail */}
                  <td>
                    <img
                      src={
                        imageErrorMap[project.id]
                          ? FALLBACK_IMG
                          : getImageSrc(project.image)
                      }
                      alt="thumb"
                      className={styles.thumbnail}
                      // If error loading, set fallback (only once per project)
                      onError={() => handleImgError(project.id)}
                      style={{
                        background: '#222',
                        borderRadius: 3,
                        width: "64px",
                        height: "48px",
                        objectFit: "cover"
                      }}
                    />
                  </td>
                  {/* Title */}
                  <td>
                    <span className={styles.projectTitle}>{project.title}</span>
                  </td>
                  {/* Category */}
                  <td style={{color: '#aaa'}}>{project.category}</td>
                  {/* Skills (Chips) */}
                  <td>{renderList(project.skills)}</td>
                  {/* Personas (Chips) */}
                  <td>{renderList(project.persona_ids)}</td>
                  {/* Status */}
                  <td>
                    <div style={{display:'flex', alignItems:'center'}}>
                      <span className={`${styles.statusDot} ${project.visible ? styles.visible : styles.hidden}`}></span>
                      <span style={{fontSize:'0.8rem', color: project.visible ? '#fff' : '#666'}}>
                        {project.visible ? 'LIVE' : 'HIDDEN'}
                      </span>
                    </div>
                  </td>
                  {/* Order */}
                  <td style={{fontFamily:'monospace'}}>#{project.order ?? "-"}</td>
                  {/* Actions */}
                  <td>
                    <button className={`${styles.actionBtn} ${styles.editBtn}`} onClick={() => handleEdit(project)}>
                      EDIT
                    </button>
                    <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => handleDelete(project.id)}>
                      DEL
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* MODAL INJECTION */}
      {modalOpen && (
        <EditProjectModal
          open={modalOpen}
          onClose={handleModalClose}
          project={editing}
          onSave={handleProjectSaved}
        />
      )}
    </div>
  );
}