const ProjectsModel = require('./projects.model');
const NotFoundError = require('../../errors/NotFoundError');
const ValidationError = require('../../errors/ValidationError');

/**
 * GET /api/projects
 * List projects (supports filters via query params)
 */
async function listProjects(req, res, next) {
  try {
    // Parse query params for filtering
    const opts = {};
    if (typeof req.query.visible !== 'undefined') opts.visible = req.query.visible === 'true';
    if (req.query.category) opts.category = req.query.category;
    if (req.query.skillId) opts.skillId = Number(req.query.skillId);
    if (req.query.personaId) opts.personaId = Number(req.query.personaId);
    if (req.query.limit) opts.limit = Number(req.query.limit);
    if (req.query.offset) opts.offset = Number(req.query.offset);

    const projects = await ProjectsModel.findAll(opts);
    res.json({ data: projects });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/projects/:id
 * Get single project by ID
 */
async function getProject(req, res, next) {
  try {
    const { id } = req.params;
    const project = await ProjectsModel.findById(Number(id));
    res.json({ data: project });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/projects (admin)
 * Create new project (with image upload, validation)
 */
async function createProject(req, res, next) {
  try {
    let payload = { ...req.body };

    // Parse json/array fields if needed (supports form-data)
    ['skills', 'persona_ids', 'collaborators'].forEach(field => {
      if (typeof payload[field] === 'string') {
        try { payload[field] = JSON.parse(payload[field]); }
        catch { payload[field] = []; }
      }
    });

    // Handle image upload
    if (req.file && req.file.filename) {
      payload.image = `/storage/projects/${req.file.filename}`;
    }

    // Visibility default
    if (typeof payload.visible === 'undefined') payload.visible = true;

    // Order default for new
    if (typeof payload.order === 'undefined') payload.order = null;

    const project = await ProjectsModel.create(payload);
    res.status(201).json({ data: project });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/projects/:id (admin)
 * Update existing project (partial, image upload supported)
 */
async function updateProject(req, res, next) {
  try {
    const { id } = req.params;
    let payload = { ...req.body };

    // Parse array fields
    ['skills', 'persona_ids', 'collaborators'].forEach(field => {
      if (typeof payload[field] === 'string') {
        try { payload[field] = JSON.parse(payload[field]); }
        catch { payload[field] = []; }
      }
    });

    if (req.file && req.file.filename) {
      payload.image = `/storage/projects/${req.file.filename}`;
    }

    const updated = await ProjectsModel.update(Number(id), payload);
    res.json({ data: updated });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/projects/:id (admin)
 * Delete project by ID
 */
async function deleteProject(req, res, next) {
  try {
    const { id } = req.params;
    await ProjectsModel.remove(Number(id));
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
};