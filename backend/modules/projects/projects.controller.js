const ProjectsModel = require('./projects.model');
const SkillsModel = require('../skills/skills.model');
const PersonasModel = require('../personas/personas.model');
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

    // Enrich projects with Skill names and full Persona objects
    const allSkills = await SkillsModel.findAll();
    const allPersonas = await PersonasModel.findAll();

    // Build lookup maps
    const skillMap = {};
    allSkills.forEach(s => { skillMap[s.id] = s.name; });

    const personaMap = {};
    allPersonas.forEach(p => {
      personaMap[p.id] = { ...p }; // all persona fields
    });

    // Map project skills/persona_ids to names/full objects (with type-robust lookup)
    const enriched = projects.map(p => ({
      ...p,
      skills: Array.isArray(p.skills)
        ? p.skills.map(id => skillMap[id]).filter(Boolean)
        : [],
      personas: Array.isArray(p.persona_ids)
        ? p.persona_ids.map(pid => personaMap[Number(pid)]).filter(Boolean)
        : [],
    }));

    res.json({ data: enriched });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/projects/:id
 * Get single project by ID, enriched
 */
async function getProject(req, res, next) {
  try {
    const { id } = req.params;
    const project = await ProjectsModel.findById(Number(id));

    const allSkills = await SkillsModel.findAll();
    const allPersonas = await PersonasModel.findAll();

    const skillMap = {};
    allSkills.forEach(s => { skillMap[s.id] = s.name; });

    const personaMap = {};
    allPersonas.forEach(p => {
      personaMap[p.id] = { ...p };
    });

    const enriched = {
      ...project,
      skills: Array.isArray(project.skills)
        ? project.skills.map(id => skillMap[id]).filter(Boolean)
        : [],
      personas: Array.isArray(project.persona_ids)
        ? project.persona_ids.map(pid => personaMap[Number(pid)]).filter(Boolean)
        : [],
    };

    res.json({ data: enriched });
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