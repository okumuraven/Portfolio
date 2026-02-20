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

// -------- SEMI-PUBLIC ROUTES --------
// List all personas (for admin dropdowns/forms; publicly accessible for GET)
router.get('/', PersonasController.listAdmin);   // <--- NO requireAdmin()

// -------- ADMIN ROUTES (require authentication/authorization) --------

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