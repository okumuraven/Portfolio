const db = require('../../database'); // pg-promise instance or equivalent

const PersonasModel = {
  /**
   * List personas
   * @param {Object} opts { publicView?: boolean } – if true, return only active personas.
   * @returns {Promise<Array>}
   */
  async findAll(opts = {}) {
    const filter = opts.publicView ? 'WHERE is_active = TRUE' : '';
    return db.any(`
      SELECT * FROM personas
      ${filter}
      ORDER BY "order" ASC NULLS LAST, id ASC
    `);
  },

  /**
   * Find persona by ID
   * @param {number} id
   * @returns {Promise<Object|null>}
   */
  async findById(id) {
    return db.oneOrNone('SELECT * FROM personas WHERE id = $1', [id]);
  },

  /**
   * Create a new persona
   * @param {Object} persona
   * @returns {Promise<Object>} created row
   */
  async create(persona) {
    return db.one(`
      INSERT INTO personas
      (title, type, period, summary, description, motivation, icon, accent_color, cta, is_active, availability, "order")
      VALUES (
        $[title], $[type], $[period], $[summary], $[description], $[motivation], $[icon], $[accent_color], $[cta],
        $[is_active], $[availability], $[order]
      )
      RETURNING *
    `, persona);
  },

  /**
   * Update a persona
   * @param {number} id
   * @param {Object} persona
   * @returns {Promise<Object>} updated row
   */
  async update(id, persona) {
    return db.one(`
      UPDATE personas SET
        title = $[title],
        type = $[type],
        period = $[period],
        summary = $[summary],
        description = $[description],
        motivation = $[motivation],
        icon = $[icon],
        accent_color = $[accent_color],
        cta = $[cta],
        is_active = $[is_active],
        availability = $[availability],
        "order" = $[order],
        updated_at = NOW()
      WHERE id = $[id]
      RETURNING *
    `, { ...persona, id });
  },

  /**
   * Delete a persona by ID
   * @param {number} id
   * @returns {Promise<null>}
   */
  async remove(id) {
    return db.result('DELETE FROM personas WHERE id = $1', [id]);
  },

  /**
   * Set all personas as inactive.
   * @returns {Promise<null>}
   */
  async deactivateAll() {
    return db.none('UPDATE personas SET is_active = FALSE WHERE is_active = TRUE');
  },

  /**
   * Set persona as active by ID (and deactivate others)
   * @param {number} id
   * @returns {Promise<Object>}
   */
  async setActive(id) {
    await this.deactivateAll();
    return db.one('UPDATE personas SET is_active = TRUE WHERE id = $1 RETURNING *', [id]);
  }
};

module.exports = PersonasModel;