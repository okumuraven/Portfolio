const db = require('../../database');

/**
 * ContactProfileModel: CRUD for about/profile/contact socials.
 * Keys are "field", "value", "type", "sort_order", "visible"
 */
const ContactProfileModel = {
  /**
   * Fetch all public (visible) fields, sorted for frontend
   */
  async findAllVisible() {
    return db.any(
      'SELECT * FROM contact_profile WHERE visible = TRUE ORDER BY sort_order ASC, id ASC'
    );
  },

  /**
   * Fetch all fields (admin)
   */
  async findAll() {
    return db.any('SELECT * FROM contact_profile ORDER BY sort_order ASC, id ASC');
  },

  /**
   * Find by field key (e.g. "real_name")
   */
  async findByField(field) {
    return db.oneOrNone('SELECT * FROM contact_profile WHERE field = $1', [field]);
  },

  /**
   * Update profile field by id
   */
  async updateById(id, data) {
    const fields = [];
    const values = [];
    let idx = 1;
    for (const key of ['value', 'visible', 'sort_order', 'type']) {
      if (typeof data[key] !== 'undefined') {
        fields.push(`${key} = $${idx++}`);
        values.push(data[key]);
      }
    }
    values.push(id);

    if (!fields.length) throw new Error("No updatable fields given.");
    return db.one(
      `
      UPDATE contact_profile SET
        ${fields.join(', ')}, updated_at = NOW()
      WHERE id = $${values.length}
      RETURNING *
      `,
      values
    );
  },

  /**
   * Create a new profile/about/contact field
   */
  async create(fieldData) {
    return db.one(
      `INSERT INTO contact_profile (field, value, type, sort_order, visible, updated_at)
       VALUES ($[field], $[value], $[type], $[sort_order], $[visible], NOW())
       RETURNING *`,
      fieldData
    );
  },

  /**
   * Delete a profile field by id
   */
  async remove(id) {
    return db.result('DELETE FROM contact_profile WHERE id = $1', [id]);
  }
};

module.exports = ContactProfileModel;