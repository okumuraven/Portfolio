const SkillsModel = require("./skills.model");

/**
 * List skills (with query filtering)
 * Supports: ?active=true&personaId=2&category=Backend&level=Expert&superpower=true
 */
exports.listSkills = async (req, res, next) => {
  try {
    const {
      active,
      personaId,
      category,
      level,
      superpower,
    } = req.query;

    const skills = await SkillsModel.findAll({
      active: active !== undefined ? active === "true" : undefined,
      personaId: personaId !== undefined ? Number(personaId) : undefined,
      category,
      level,
      superpower: superpower !== undefined ? superpower === "true" : undefined,
    });
    res.json(skills);
  } catch (err) {
    next(err);
  }
};

/**
 * Get a single skill by ID
 */
exports.getSkill = async (req, res, next) => {
  try {
    const skill = await SkillsModel.findById(Number(req.params.id));
    if (!skill) {
      return res.status(404).json({ error: "Skill not found" });
    }
    res.json(skill);
  } catch (err) {
    next(err);
  }
};

/**
 * Create a new skill
 */
exports.createSkill = async (req, res, next) => {
  try {
    // Input validation should happen in middleware before here!
    const skill = req.body;
    // Ensure array fields are always arrays (not undefined/null)
    skill.persona_ids = Array.isArray(skill.persona_ids) ? skill.persona_ids : [];
    skill.project_links = Array.isArray(skill.project_links) ? skill.project_links : [];
    // Allow "order" to be null/number
    if (skill.order === "") skill.order = null;

    const created = await SkillsModel.create(skill);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

/**
 * Update an existing skill by ID
 */
exports.updateSkill = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    let skill = req.body;
    skill.persona_ids = Array.isArray(skill.persona_ids) ? skill.persona_ids : [];
    skill.project_links = Array.isArray(skill.project_links) ? skill.project_links : [];
    if (skill.order === "") skill.order = null;

    const updated = await SkillsModel.update(id, skill);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

/**
 * Delete a skill by ID
 */
exports.deleteSkill = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    await SkillsModel.remove(id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
