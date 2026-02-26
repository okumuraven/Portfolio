const TimelineModel = require("./timeline.model");

/**
 * Timeline Service: business logic for timeline feed/events.
 * Use these methods in controllers, not Model directly (enables growth).
 */
const TimelineService = {
  /**
   * List timeline events with filters.
   */
  async list(opts) {
    return TimelineModel.findAll(opts);
  },

  /**
   * Get a single timeline event by ID.
   */
  async getById(id) {
    return TimelineModel.findById(id);
  },

  /**
   * Create a new timeline event.
   */
  async create(data) {
    if (!Array.isArray(data.skill_ids)) data.skill_ids = [];
    if (typeof data.date_end === "undefined") data.date_end = null;
    if (!isValidUrl(data.proof_link)) data.proof_link = null;
    // Optionally, validate/format other fields here.
    return TimelineModel.create(data);
  },

  /**
   * Update an existing timeline event by ID.
   */
  async update(id, data) {
    if (!Array.isArray(data.skill_ids)) data.skill_ids = [];
    if (typeof data.date_end === "undefined") data.date_end = null;
    if (!isValidUrl(data.proof_link)) data.proof_link = null;
    return TimelineModel.update(id, data);
  },

  /**
   * Delete a timeline event by ID.
   */
  async remove(id) {
    return TimelineModel.remove(id);
  },

  /**
   * Find a timeline event by provider and event_id.
   */
  async findByProviderEvent(provider, provider_event_id) {
    return TimelineModel.findByProviderEvent(provider, provider_event_id);
  },

  /**
   * Sync or create/update timeline event for persona.
   * Ensures clarity in fields: proof_link is only a real public link,
   * cta is purely button text, and profile_link can be set if desired.
   */
  async syncFromPersona(persona) {
    const provider = "internal";
    const provider_event_id = `persona-${persona.id}`;

    const timelineData = {
      type: "persona",
      title: persona.title,
      description: persona.summary || persona.description || "",
      date_start: extractStartDate(persona.period),
      date_end: null,
      icon: persona.icon,
      proof_link: getPublicProofLink(persona),
      provider,
      provider_event_id,
      visible: true,
      automated: true,
      reviewed: true,
      order: persona.order,
      source: "internal",
      // profile_link: `/personas/${persona.id}`, // Uncomment if desired and supported by DB/model
    };

    let event = await TimelineModel.findByProviderEvent(provider, provider_event_id);

    if (event) {
      return TimelineModel.update(event.id, timelineData);
    }
    return TimelineModel.create(timelineData);
  },

  /**
   * Remove timeline event for persona.
   */
  async removeForPersona(id) {
    const provider = "internal";
    const provider_event_id = `persona-${id}`;
    const event = await TimelineModel.findByProviderEvent(provider, provider_event_id);
    if (event) {
      await TimelineModel.remove(event.id);
    }
  },
};

/**
 * Only allow valid public links to be set as proof_link.
 * @param {*} persona
 * @returns {string|null}
 */
function getPublicProofLink(persona) {
  if (
    persona.external_certificate_url &&
    typeof persona.external_certificate_url === "string" &&
    persona.external_certificate_url.startsWith('http')
  ) return persona.external_certificate_url;
  // If you store portfolio/project links, check here as well
  // Example: if (persona.portfolio_link && isValidUrl(persona.portfolio_link)) return persona.portfolio_link;
  return null;
}

/**
 * Simple URL validity check.
 */
function isValidUrl(url) {
  if (!url || typeof url !== "string") return false;
  return url.startsWith("http://") || url.startsWith("https://");
}

/**
 * Normalize various period formats to 'YYYY-MM-DD'.
 */
function extractStartDate(period) {
  if (!period) return new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
  if (/^\d{4}-\d{2}$/.test(period)) return `${period}-01`;
  if (/^\d{4}$/.test(period)) return `${period}-01-01`;
  return new Date(period).toISOString().slice(0, 10);
}

module.exports = TimelineService;