const SkillsService = require("./skills.service"); // USE SERVICE!
const SkillsModel = require("./skills.model"); // Only for list/filter

/**
 * List skills (with query filtering)
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
    const skill = req.body;
    skill.persona_ids = Array.isArray(skill.persona_ids) ? skill.persona_ids : [];
    skill.project_links = Array.isArray(skill.project_links) ? skill.project_links : [];
    if (skill.order === "") skill.order = null;

    // USE SERVICE!
    const created = await SkillsService.createSkill(skill);
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

    // USE SERVICE!
    const updated = await SkillsService.updateSkill(id, skill);
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

    // USE SERVICE!
    await SkillsService.deleteSkill(id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};