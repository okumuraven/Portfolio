const db = require('../../database');
const NotFoundError = require('../../errors/NotFoundError');
const ValidationError = require('../../errors/ValidationError');

/**
 * Projects Model: CRUD & query for Project Portfolio
 */
const ProjectsModel = {
  /**
   * List all projects (optionally filter by visible/category/skill/persona/order/offset/limit)
   * @param {Object} opts - Filtering and paging options
   * @returns {Promise<Array>}
   */
  async findAll(opts = {}) {
    const filters = [];
    const values = [];
    let idx = 1;

    // Professional pattern: filters added dynamically only if provided
    if (opts.visible !== undefined) {
      filters.push(`visible = $${idx++}`);
      values.push(!!opts.visible);
    }
    if (opts.category) {
      filters.push(`category = $${idx++}`);
      values.push(String(opts.category));
    }
    if (opts.skillId !== undefined) {
      filters.push(`$${idx++} = ANY(skills)`);
      values.push(Number(opts.skillId));
    }
    if (opts.personaId !== undefined) {
      filters.push(`$${idx++} = ANY(persona_ids)`);
      values.push(Number(opts.personaId));
    }

    const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
    const orderBy = `ORDER BY "order" ASC NULLS LAST, id DESC`;
    const limit = opts.limit ? `LIMIT ${Number(opts.limit)}` : '';
    const offset = opts.offset ? `OFFSET ${Number(opts.offset)}` : '';

    return db.any(`
      SELECT * FROM projects
      ${whereClause}
      ${orderBy}
      ${limit}
      ${offset}
    `, values);
  },

  /**
   * Find a project by its ID
   * @param {number} id
   * @returns {Promise<Object|null>}
   */
  async findById(id) {
    const project = await db.oneOrNone('SELECT * FROM projects WHERE id = $1', [id]);
    if (!project) throw new NotFoundError('Project not found');
    return project;
  },

  /**
   * Create a new project
   * @param {Object} project - Full project info (valid, validated)
   * @returns {Promise<Object>} created row
   */
  async create(project) {
    // Check required fields (add more as needed)
    if (!project.title || !project.category || !project.image) {
      throw new ValidationError('Missing required fields: title, category, image');
    }
    if (!Array.isArray(project.skills) || project.skills.length < 1) {
      throw new ValidationError('Project must have at least one skill.');
    }

    const insertQuery = `
      INSERT INTO projects (
        title, description, category, skills, persona_ids,
        date_start, date_end, demo_link, repo_link, image, highlight,
        visible, "order", collaborators, created_at, updated_at
      ) VALUES (
        $[title], $[description], $[category], $[skills], $[persona_ids],
        $[date_start], $[date_end], $[demo_link], $[repo_link], $[image], $[highlight],
        $[visible], $[order], $[collaborators], NOW(), NOW()
      )
      RETURNING *
    `;
    try {
      return await db.one(insertQuery, project);
    } catch (err) {
      console.error('[PROJECT CREATE ERROR]', err, '\nPayload:', project);
      throw new ValidationError('Failed to create project: ' + err.message, 'PG_ERROR');
    }
  },

  /**
   * Update existing project (partial updates supported)
   * @param {number} id
   * @param {Object} project - Fields to update
   * @returns {Promise<Object>} updated row
   */
  async update(id, project) {
    // Build dynamic set clause just like in skills/personas
    const allowed = [
      'title', 'description', 'category', 'skills', 'persona_ids',
      'date_start', 'date_end', 'demo_link', 'repo_link', 'image', 'highlight',
      'visible', 'order', 'collaborators'
    ];
    const sets = [];
    const values = [];
    let idx = 1;

    for (const key of allowed) {
      if (typeof project[key] !== 'undefined') {
        sets.push(`${key} = $${idx}`);
        values.push(project[key]);
        idx++;
      }
    }
    if (!sets.length) throw new ValidationError('No updatable fields provided.');

    values.push(id);
    const updateQuery = `
      UPDATE projects SET
        ${sets.join(', ')},
        updated_at = NOW()
      WHERE id = $${values.length}
      RETURNING *
    `;
    try {
      const updated = await db.oneOrNone(updateQuery, values);
      if (!updated) throw new NotFoundError('Project not found for update.');
      return updated;
    } catch (err) {
      console.error('[PROJECT UPDATE ERROR]', err, '\nValues:', values);
      throw new ValidationError('Failed to update project: ' + err.message, 'PG_ERROR');
    }
  },

  /**
   * Delete project by ID
   * @param {number} id
   * @returns {Promise<null>}
   */
  async remove(id) {
    const result = await db.result('DELETE FROM projects WHERE id = $1', [id]);
    if (result.rowCount === 0) throw new NotFoundError('Project not found for deletion');
    return null;
  }
};

module.exports = ProjectsModel;