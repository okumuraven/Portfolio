const ContactProfileModel = require("./contact.model");

/**
 * ContactService: Business logic for profile/contact management.
 */
const ContactService = {
  /**
   * Get visible profile fields, ordered for public display.
   */
  async getAllVisible() {
    return ContactProfileModel.findAllVisible();
  },

  /**
   * Get all fields, regardless of visibility (admin).
   */
  async getAll() {
    return ContactProfileModel.findAll();
  },

  /**
   * Update a field by id.
   * Sanitizes allowed keys.
   * @param {number} id
   * @param {object} data (allowed: value, visible, sort_order, type)
   */
  async updateById(id, data) {
    const allowedKeys = ["value", "visible", "sort_order", "type"];
    const updateData = {};
    for (const key of allowedKeys) {
      if (typeof data[key] !== "undefined") updateData[key] = data[key];
    }
    if (Object.keys(updateData).length === 0) throw new Error("No updatable fields given.");
    return ContactProfileModel.updateById(id, updateData);
  },

  /**
   * Create new about/contact/profile field.
   * Ensures correct schema.
   * @param {Object} fieldData
   */
  async create(fieldData) {
    const required = ["field", "value", "type"];
    for (const key of required) {
      if (!fieldData[key]) throw new Error(`Missing required: ${key}`);
    }
    // Normalize optional fields
    if (typeof fieldData.sort_order === "undefined") fieldData.sort_order = 0;
    if (typeof fieldData.visible === "undefined") fieldData.visible = true;
    return ContactProfileModel.create(fieldData);
  },

  /**
   * Delete a profile/contact field by id.
   */
  async remove(id) {
    return ContactProfileModel.remove(id);
  },

  /**
   * OPTIONAL: Get a field by its key.
   */
  async getField(field) {
    return ContactProfileModel.findByField(field);
  }
};

module.exports = ContactService;