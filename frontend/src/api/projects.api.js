import http from "./http";

// Fetch all projects, with optional filters
export function getProjects(params = {}) {
  return http
    .get("/projects", { params })
    .then(res => {
      if (res && res.data && Array.isArray(res.data.data)) {
        return res.data.data;
      }
      return [];
    })
    .catch(() => []);
}

// Fetch a single project by id
export function getProjectById(id) {
  return http
    .get(`/projects/${id}`)
    .then(res => res.data.data)
    .catch(() => null);
}

// Create a new project (FormData for file/image upload)
export function createProject(formData) {
  return http
    .post("/projects", formData)  // <-- FIXED: removed /admin
    .then(res => res.data.data)
    .catch((err) => {
      throw err?.response?.data || err;
    });
}

// Update a project by ID (PATCH, FormData for file/image upload)
export function updateProject(id, formData) {
  return http
    .patch(`/projects/${id}`, formData) // <-- FIXED: removed /admin
    .then(res => res.data.data)
    .catch((err) => {
      throw err?.response?.data || err;
    });
}

// Delete a project
export function deleteProject(id) {
  return http
    .delete(`/projects/${id}`)  // <-- FIXED: removed /admin
    .then(res => res.data.data)
    .catch((err) => {
      throw err?.response?.data || err;
    });
}

const api = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};

export default api;