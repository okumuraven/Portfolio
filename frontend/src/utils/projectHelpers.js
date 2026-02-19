/**
 * ==========================
 *    PROJECT HELPERS
 * ==========================
 * Used for transforming, mapping, and formatting project data.
 * Import and use throughout components, forms, and helpers.
 */

/**
 * Map skill IDs to skill names for display in cards/tables.
 * @param {number[]} skillIds
 * @param {Array<{id: number, name: string}>} allSkills
 * @returns {string[]}
 */
export function skillNamesFromIds(skillIds = [], allSkills = []) {
  if (!skillIds?.length || !allSkills?.length) return [];
  return skillIds
    .map(id => allSkills.find(s => s.id === id)?.name)
    .filter(Boolean);
}

/**
 * Map persona IDs to persona names for display
 * @param {number[]} personaIds
 * @param {Array<{id: number, name: string}>} personas
 * @returns {string[]}
 */
export function personaNamesFromIds(personaIds = [], personas = []) {
  if (!personaIds?.length || !personas?.length) return [];
  return personaIds
    .map(id => personas.find(p => p.id === id)?.name)
    .filter(Boolean);
}

/**
 * Format project dates (start/end) for display
 */
export function formatProjectDates(start, end) {
  const s = start ? (new Date(start)).toLocaleDateString() : "";
  const e = end ? (new Date(end)).toLocaleDateString() : "";
  if (s && e) return `${s}—${e}`;
  if (s) return `From ${s}`;
  if (e) return `Until ${e}`;
  return "";
}

/**
 * Get first featured project (could be by highest order, explicit featured flag, etc.)
 * Here: return first with order === 1 or the first in list.
 */
export function getFeaturedProject(projects = []) {
  if (!projects.length) return null;
  return projects.find(p => p.order === 1) || projects[0];
}

/**
 * Validate project fields before submission (front-end only, not a replacement for backend schema!)
 * Returns array of error strings or empty if valid.
 */
export function validateProjectForm(form, { allSkills = [], allPersonas = [] } = {}) {
  const errors = [];
  if (!form.title || form.title.length < 2) errors.push("Title is required (min 2 chars)");
  if (!form.description || form.description.length < 10) errors.push("Description required (min 10 chars)");
  if (!form.category) errors.push("Category is required");
  if (!form.skills || !form.skills.length) errors.push("Select at least one skill");
  // Optional: check for valid linked IDs
  if (form.skills?.some(id => !allSkills.find(s => s.id === Number(id)))) errors.push("Invalid skill ID");
  if (form.persona_ids?.some(id => !allPersonas.find(p => p.id === Number(id)))) errors.push("Invalid persona ID");
  // Add more as needed (validate URLs, dates, etc.)
  return errors;
}

/**
 * Parse array fields (skills/persona_ids/collaborators) from API/string/form
 * - Accepts both arrays and JSON-encoded strings for robust FormData support.
 */
export function parseArrayInput(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  try {
    return JSON.parse(val);
  } catch {
    return [];
  }
}

/**
 * Ensure collaborators field is a valid array of objects.
 * @param {any} collab
 * @returns {Array}
 */
export function normalizeCollaborators(collab) {
  if (!collab) return [];
  if (Array.isArray(collab)) return collab;
  try {
    return JSON.parse(collab);
  } catch {
    return [];
  }
}

/**
 * Project category labels, in order.
 */
export const projectCategories = [
  "Client",
  "Personal",
  "Open Source",
  "Hackathon",
  "Other"
];
