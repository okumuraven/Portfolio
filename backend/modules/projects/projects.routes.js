const express = require('express');
const router = express.Router();

// Controller and middleware imports
const projectsController = require('./projects.controller');
const requireAuth = require('../auth/auth.middleware');
const uploadMiddleware = require('../../middlewares/upload.middleware');

// --- Public Endpoints ---

// List all projects (with optional filters)
router.get('/', projectsController.listProjects);

// Get single project by ID
router.get('/:id', projectsController.getProject);

// --- Admin Endpoints (JWT-protected) ---

// Create new project with image/file upload
router.post(
  '/',
  requireAuth(['admin']),
  uploadMiddleware.single('image'),
  projectsController.createProject
);

// Update project (supports file upload)
router.patch(
  '/:id',
  requireAuth(['admin']),
  uploadMiddleware.single('image'),
  projectsController.updateProject
);

// Delete project by ID
router.delete(
  '/:id',
  requireAuth(['admin']),
  projectsController.deleteProject
);

module.exports = router;