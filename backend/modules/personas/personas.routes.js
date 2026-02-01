const express = require('express');
const PersonasController = require('./personas.controller');
const {
  validatePersona,
  personaExists,
  checkUniqueActivePersona,
} = require('./personas.middlewares');
const requireAdmin = require('../auth/auth.middleware');

const router = express.Router();

// -------- PUBLIC ROUTES --------
// Get all active personas (for public site: landing/about/etc)
router.get('/public', PersonasController.listPublic);

// -------- ADMIN ROUTES (require authentication/authorization) --------

// List all personas (admin table view)
router.get('/', requireAdmin(), PersonasController.listAdmin);

// Get a single persona by id
router.get('/:id', requireAdmin(), personaExists, PersonasController.getOne);

// Create new persona (with validation)
router.post(
  '/',
  requireAdmin(),
  validatePersona,
  checkUniqueActivePersona,
  PersonasController.createPersona
);

// Update existing persona (must exist, validate)
router.patch(
  '/:id',
  requireAdmin(),
  personaExists,
  validatePersona,
  checkUniqueActivePersona,
  PersonasController.updatePersona
);

// Delete persona (must exist first)
router.delete('/:id', requireAdmin(), personaExists, PersonasController.deletePersona);

// Set a persona as active (makes this persona active and others inactive)
router.post('/:id/set-active', requireAdmin(), personaExists, PersonasController.setActivePersona);

module.exports = router;