const TimelineModel = require("./timeline.model");

/**
 * Timeline Service: business logic for timeline feed/events.
 * Use these methods in controllers, not Model directly (enables growth).
 */
const TimelineService = {
  /**
   * List timeline events with filters.
   * @param {Object} opts
   * @returns {Promise<Array>}
   */
  async list(opts) {
    // Add additional business logic here if needed later
    return TimelineModel.findAll(opts);
  },

  /**
   * Get a single timeline event by ID.
   * @param {number} id
   * @returns {Promise<Object|null>}
   */
  async getById(id) {
    return TimelineModel.findById(id);
  },

  /**
   * Create a new timeline event.
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async create(data) {
    // Business logic: e.g., default fields, computed properties
    // (If integrating with projects/personas, add logic here)
    if (!Array.isArray(data.skill_ids)) data.skill_ids = [];
    return TimelineModel.create(data);
  },

  /**
   * Update an existing timeline event by ID.
   * @param {number} id
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async update(id, data) {
    if (!Array.isArray(data.skill_ids)) data.skill_ids = [];
    return TimelineModel.update(id, data);
  },

  /**
   * Delete a timeline event by ID.
   * @param {number} id
   * @returns {Promise}
   */
  async remove(id) {
    return TimelineModel.remove(id);
  },

  /**
   * Find a timeline event by provider and event_id (for sync/integration dedup).
   * @param {string} provider
   * @param {string} provider_event_id
   * @returns {Promise<Object|null>}
   */
  async findByProviderEvent(provider, provider_event_id) {
    return TimelineModel.findByProviderEvent(provider, provider_event_id);
  },

  /** 
   * FUTURE: Bulk import, transactional ops, etc 
   * async bulkUpsert(events) {...}
   */
};

module.exports = TimelineService;