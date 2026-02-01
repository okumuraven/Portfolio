const PersonasModel = require('./personas.model');

/**
 * Persona Service – Handles business logic for persona management.
 */
const PersonasService = {
  /**
   * List all personas (admin view) or just currently active for public
   * @param {Object} [opts] Example: { publicView: true }
   * @returns {Promise<Array>}
   */
  async listAll(opts = {}) {
    return PersonasModel.findAll(opts);
  },

  /**
   * Find one persona (for edit, detail view, etc)
   * @param {number} id
   * @returns {Promise<Object|null>}
   */
  async getOne(id) {
    return PersonasModel.findById(id);
  },

  /**
   * Create a persona (admin only)
   * If persona is set to active, all others are auto-deactivated.
   * @param {Object} data - Persona fields
   * @returns {Promise<Object>} created persona
   */
  async createPersona(data) {
    if (data.is_active) {
      await PersonasModel.deactivateAll();
    }
    return PersonasModel.create(data);
  },

  /**
   * Update a persona by ID.
   * If is_active is changed to true, all others are auto-deactivated.
   * @param {number} id
   * @param {Object} data
   * @returns {Promise<Object>} updated persona
   */
  async updatePersona(id, data) {
    // If updating to set is_active true, deactivate others first
    if (data.is_active) {
      await PersonasModel.deactivateAll();
    }
    return PersonasModel.update(id, data);
  },

  /**
   * Delete a persona by its ID.
   * @param {number} id
   * @returns {Promise<void>}
   */
  async deletePersona(id) {
    await PersonasModel.remove(id);
  },

  /**
   * Instantly set a persona as active (toggling off others).
   * @param {number} id
   * @returns {Promise<Object>} updated active persona
   */
  async setActivePersona(id) {
    return PersonasModel.setActive(id);
  }
};

module.exports = PersonasService;