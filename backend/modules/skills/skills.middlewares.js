/**
 * Skill Validation Middleware (for create/update)
 * Usable for both createSkill and updateSkill routes.
 */
function validateSkill(req, res, next) {
  const {
    name,
    category,
    level,
    years,
    active,
    superpower,
    persona_ids,
    icon,
    cert_link,
    project_links,
    order,
  } = req.body;

  // Allowed categories and levels (extend as your UI grows)
  const CATEGORIES = [
    "Frontend", "Backend", "Security", "Cloud", "DevOps", "Database", "Soft Skill", "Other"
  ];
  const LEVELS = [
    "Expert", "Proficient", "Intermediate", "Learning", "Interested"
  ];

  let errors = [];

  // Required string checks
  if (!name || typeof name !== "string" || name.length < 2)
    errors.push("Valid skill name is required (2+ chars).");

  if (!category || typeof category !== "string" || !CATEGORIES.includes(category))
    errors.push("Category is required and must be valid.");

  if (!level || typeof level !== "string" || !LEVELS.includes(level))
    errors.push("Level is required and must be one of: " + LEVELS.join(", "));

  // years must be integer, >=0
  if (years !== undefined && (!Number.isInteger(Number(years)) || Number(years) < 0))
    errors.push("Years must be a non-negative integer.");

  // active & superpower must be boolean (if present)
  if (active !== undefined && typeof active !== "boolean" && active !== "true" && active !== "false")
    errors.push("Active must be a boolean.");

  if (superpower !== undefined && typeof superpower !== "boolean" && superpower !== "true" && superpower !== "false")
    errors.push("Superpower must be a boolean.");

  // persona_ids: must be array of IDs or omit
  if (persona_ids && !Array.isArray(persona_ids))
    errors.push("persona_ids must be an array of integers.");

  // icon recommended (empty is allowed for soft/other skills)
  if (icon && typeof icon !== "string")
    errors.push("Icon must be a string.");

  // cert_link and project_links optional, but if present, must be string or array of strings
  if (cert_link && typeof cert_link !== "string")
    errors.push("cert_link must be a string.");

  if (project_links && !Array.isArray(project_links))
    errors.push("project_links must be an array of strings.");
  if (project_links && Array.isArray(project_links)) {
    const invalid = project_links.some((l) => typeof l !== "string");
    if (invalid) errors.push("Each project link must be a string.");
  }

  // order: allow null or integer
  if (order !== undefined && order !== null && !Number.isInteger(Number(order)))
    errors.push("Order must be an integer or null.");

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
}

module.exports = {
  validateSkill,
};