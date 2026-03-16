const express = require('express');
const router = express.Router();

// Controller and middleware imports
const projectsController = require('./projects.controller');
const requireAuth = require('../auth/auth.middleware');

// --- Public Endpoints ---

// List all projects (with optional filters)
router.get('/', projectsController.listProjects);

// Get single project by ID
router.get('/:id', projectsController.getProject);

// --- Admin Endpoints (JWT-protected) ---

// Create new project (image as URL, NO file upload)
router.post(
  '/',
  requireAuth(['admin']),
  projectsController.createProject
);

// Update project (image as URL, NO file upload)
router.patch(
  '/:id',
  requireAuth(['admin']),
  projectsController.updateProject
);

// Delete project by ID
router.delete(
  '/:id',
  requireAuth(['admin']),
  projectsController.deleteProject
);

module.exports = router;
