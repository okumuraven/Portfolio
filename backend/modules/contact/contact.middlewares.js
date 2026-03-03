/**
 * Validation middleware for creating/updating contact_profile fields.
 * Checks types, formats, and required values.
 */
function validateContactProfileField(req, res, next) {
  const { field, value, type, order, visible } = req.body;
  const ALLOWED_TYPES = ["string", "text", "social_link", "image", "markdown", "email"];
  let errors = [];

  // Field key checks
  if (field !== undefined) {
    if (typeof field !== "string" || field.length < 2 || field.length > 64)
      errors.push("Field must be a string (2-64 chars).");
    if (!/^[a-zA-Z0-9_\-]+$/.test(field))
      errors.push("Field can only contain letters, numbers, underscores, and hyphens.");
  }

  // Value checks (required on create, can be empty string on update)
  if (typeof value !== "undefined") {
    if (typeof value !== "string")
      errors.push("Value must be a string.");
    if (type === "social_link" && value && !isURL(value))
      errors.push("Value must be a valid URL for social_link types.");
    if (type === "email" && value && !/^[^@]+@[^@]+\.[^@]+$/.test(value))
      errors.push("Value must be a valid email address.");
  }

  // Type checks
  if (!type || !ALLOWED_TYPES.includes(type)) {
    errors.push("Type is required and must be one of: " + ALLOWED_TYPES.join(", "));
  }

  // Order (optional, but if present)
  if (order !== undefined && !Number.isInteger(Number(order)))
    errors.push("Order must be an integer.");

  // Visible (optional, but if present)
  if (visible !== undefined && typeof visible !== "boolean" && visible !== "true" && visible !== "false")
    errors.push("Visible must be a boolean.");

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  next();
}

// Utility for URLs
function isURL(str) {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

module.exports = {
  validateContactProfileField,
};