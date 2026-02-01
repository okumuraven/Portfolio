import http from "./http";

/**
 * Fetch all personas (Admin, requires Auth)
 * GET /api/personas
 */
export async function getPersonas() {
  const res = await http.get("/personas");
  return res.data;
}

/**
 * Fetch all personas (Public, no Auth)
 * GET /api/personas/public
 */
export async function getPublicPersonas() {
  const res = await http.get("/personas/public");
  return res.data;
}

/**
 * Fetch a single persona by id
 * GET /api/personas/:id
 */
export async function getPersona(id) {
  const res = await http.get(`/personas/${id}`);
  return res.data;
}

/**
 * Create a new persona (Admin only)
 * POST /api/personas
 * @param {object} data - Persona data
 */
export async function createPersona(data) {
  const res = await http.post("/personas", data);
  return res.data;
}

/**
 * Update persona (Admin only)
 * PUT /api/personas/:id
 * @param {number|string} id - Persona ID
 * @param {object} data - Persona data
 */
export async function updatePersona(id, data) {
  const res = await http.put(`/personas/${id}`, data);
  return res.data;
}

/**
 * Delete persona (Admin only)
 * DELETE /api/personas/:id
 * @param {number|string} id - Persona ID
 */
export async function deletePersona(id) {
  const res = await http.delete(`/personas/${id}`);
  return res.data;
}