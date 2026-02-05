const SkillsModel = require("./skills.model");

/**
 * Skill Service Layer
 * - Calls SkillsModel for CRUD
 * - Handles business logic, caching, advanced filtering, etc.
 */
const SkillsService = {
  /**
   * List all skills, with filters and advanced processing.
   * Can later add caching, joins (personas/projects), categorization, sorting, etc.
   * @param {Object} opts - filter object
   */
  async listSkills(opts = {}) {
    // Here you could add additional business logic!
    // Example: only return public skills, or enrich with persona/project details.
    return SkillsModel.findAll(opts);
  },

  /**
   * Get a single skill by ID, throw if not found
   * @param {number} id
   */
  async getSkillOrThrow(id) {
    const skill = await SkillsModel.findById(id);
    if (!skill) {
      const err = new Error("Skill not found");
      err.status = 404;
      throw err;
    }
    return skill;
  },

  /**
   * Create a new skill (with business rules, e.g., enforce unique order for superpowers, etc.)
   * @param {Object} skillData
   */
  async createSkill(skillData) {
    // Example business rule: only X skills can be "superpower" = true.
    // Or, normalize skills, sanitize input before saving.
    // ...add extra hooks here later!
    return SkillsModel.create(skillData);
  },

  /**
   * Update existing skill by ID
   * @param {number} id
   * @param {Object} changes
   */
  async updateSkill(id, changes) {
    // Example business rule: update "updated_at" or check allowed changes
    // ...add checks here
    return SkillsModel.update(id, changes);
  },

  /**
   * Delete a skill by ID
   * @param {number} id
   */
  async deleteSkill(id) {
    return SkillsModel.remove(id);
  },

  /**
   * Bulk update skill orders (for drag-drop reordering, etc.)
   * @param {Array<{id: number, order: number}>} list
   */
  async batchUpdateOrder(list) {
    // You may want a transaction here!
    const updates = list.map(({ id, order }) => SkillsModel.update(id, { order }));
    return Promise.all(updates);
  }
};

module.exports = SkillsService;