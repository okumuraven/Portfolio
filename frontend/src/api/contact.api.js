import http from "./http";

/**
 * PUBLIC: Fetch all visible profile/contact fields (for site display)
 * Returns: Array of { field, value, type, order, visible, ... }
 */
export async function getContactProfile() {
  const res = await http.get("/contact"); // /api/contact via http.js baseURL
  return res.data.profile;
}

/**
 * ADMIN: Fetch ALL profile/contact fields (regardless of visibility)
 * Only accessible to admin (JWT token attached automatically)
 */
export async function getAllContactFieldsAdmin() {
  const res = await http.get("/contact/admin");
  return res.data.profile;
}

/**
 * ADMIN: Create a new profile/contact field
 * @param {Object} fieldData - { field, value, type, order, visible }
 * Returns: Created field object
 */
export async function createContactField(fieldData) {
  const res = await http.post("/contact", fieldData);
  return res.data.created;
}

/**
 * ADMIN: Update an existing profile/contact field by ID
 * @param {number} id
 * @param {Object} updateData - (any updatable keys: value, type, order, visible)
 * Returns: Updated field object
 */
export async function updateContactField(id, updateData) {
  const res = await http.patch(`/contact/${id}`, updateData);
  return res.data.updated;
}

/**
 * ADMIN: Delete a profile/contact field by ID
 * @param {number} id
 * Returns: { success: true }
 */
export async function deleteContactField(id) {
  const res = await http.delete(`/contact/${id}`);
  return res.data.success;
}