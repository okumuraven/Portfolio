// You can enhance validation with libraries like Joi, yup, zod if needed.
// For now, let's use basic checks for illustration.

const PersonasService = require('./personas.service');

/**
 * Validate persona input (for create/update).
 */
function validatePersona(req, res, next) {
  const {
    title,
    type,
    summary,
    description,
    motivation,
    icon,
    accent_color,
    cta,
    availability,
  } = req.body;

  // Basic validation (extend as needed)
  const errors = [];
  if (!title || typeof title !== 'string') errors.push('Title is required.');
  if (!type || !['current', 'past', 'goal'].includes(type)) errors.push('Valid type is required.');
  if (summary && typeof summary !== 'string') errors.push('Summary must be a string.');
  if (description && typeof description !== 'string') errors.push('Description must be a string.');
  if (motivation && typeof motivation !== 'string') errors.push('Motivation must be a string.');
  if (!icon || typeof icon !== 'string') errors.push('Icon is required.');
  if (!accent_color || typeof accent_color !== 'string') errors.push('Accent color is required.');
  if (!cta || typeof cta !== 'string') errors.push('CTA is required.');
  if (!availability || !['open', 'consulting', 'closed'].includes(availability))
    errors.push('Availability must be open, consulting, or closed.');

  if (errors.length)
    return res.status(400).json({ errors });

  next();
}

/**
 * Middleware to check if persona with :id exists and attach to req.persona
 */
async function personaExists(req, res, next) {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: 'Invalid persona ID.' });

  try {
    const persona = await PersonasService.getOne(id);
    if (!persona) return res.status(404).json({ error: 'Persona not found.' });
    req.persona = persona; // Attach for downstream handlers
    next();
  } catch (err) {
    next(err);
  }
}

/**
 * (Optional) Middleware for unique active persona
 * Example usage: block activating if another exists, or just auto-deactivate others in service.
 */
async function checkUniqueActivePersona(req, res, next) {
  if (req.body.is_active) {
    // Optionally, reject if another is active (or always auto-deactivate in service)
    // This can just call next(), since your service already ensures one active
    // But here for extensibility - e.g. scheduled personas, warnings, etc.
  }
  next();
}

module.exports = {
  validatePersona,
  personaExists,
  checkUniqueActivePersona,
};