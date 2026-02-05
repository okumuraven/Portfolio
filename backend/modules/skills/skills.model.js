const db = require('../../database');

/**
 * Skills Model: CRUD + utilities for the Skill Matrix
 */
const SkillsModel = {
  /**
   * List all skills, with optional filters.
   * @param {Object} opts - { active, personaId, category, level, superpower }
   * @returns {Promise<Array>}
   */
  async findAll(opts = {}) {
    const filters = [];
    const values = [];
    let idx = 1;

    if (opts.active !== undefined) {
      filters.push(`active = $${idx++}`);
      values.push(!!opts.active);
    }
    if (opts.superpower !== undefined) {
      filters.push(`superpower = $${idx++}`);
      values.push(!!opts.superpower);
    }
    if (opts.personaId !== undefined) {
      filters.push(`$${idx++} = ANY(persona_ids)`);
      values.push(Number(opts.personaId));
    }
    if (opts.category) {
      filters.push(`category = $${idx++}`);
      values.push(String(opts.category));
    }
    if (opts.level) {
      filters.push(`level = $${idx++}`);
      values.push(String(opts.level));
    }
    const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
    return db.any(`
      SELECT * FROM skills
      ${whereClause}
      ORDER BY "order" ASC NULLS LAST, id ASC
    `, values);
  },

  /**
   * Find skill by ID
   * @param {number} id
   * @returns {Promise<Object|null>}
   */
  async findById(id) {
    return db.oneOrNone('SELECT * FROM skills WHERE id = $1', [id]);
  },

  /**
   * Create new skill
   * @param {Object} skill
   * @returns {Promise<Object>} created row
   */
  async create(skill) {
    return db.one(`
      INSERT INTO skills
      (name, category, level, years, active, superpower, persona_ids, icon, cert_link, project_links, "order")
      VALUES (
        $[name], $[category], $[level], $[years], $[active], $[superpower], $[persona_ids],
        $[icon], $[cert_link], $[project_links], $[order]
      )
      RETURNING *
    `, skill);
  },

  /**
   * Update existing skill by ID
   * @param {number} id
   * @param {Object} skill
   * @returns {Promise<Object>} updated row
   */
  async update(id, skill) {
    return db.one(`
      UPDATE skills SET
        name = $[name],
        category = $[category],
        level = $[level],
        years = $[years],
        active = $[active],
        superpower = $[superpower],
        persona_ids = $[persona_ids],
        icon = $[icon],
        cert_link = $[cert_link],
        project_links = $[project_links],
        "order" = $[order],
        updated_at = NOW()
      WHERE id = $[id]
      RETURNING *
    `, { ...skill, id });
  },

  /**
   * Delete skill by ID
   * @param {number} id
   * @returns {Promise<null>}
   */
  async remove(id) {
    return db.result('DELETE FROM skills WHERE id = $1', [id]);
  }
};

module.exports = SkillsModel;