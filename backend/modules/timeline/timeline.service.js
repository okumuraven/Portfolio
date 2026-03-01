const TimelineModel = require("./timeline.model");

/**
 * Timeline Service: business logic for timeline feed/events.
 * Use these methods in controllers, not Model directly.
 */
const TimelineService = {
  async list(opts) {
    return TimelineModel.findAll(opts);
  },

  async getById(id) {
    return TimelineModel.findById(id);
  },

  async create(data) {
    if (!Array.isArray(data.skill_ids)) data.skill_ids = [];
    if (typeof data.date_end === "undefined") data.date_end = null;
    if (!isValidUrl(data.proof_link)) data.proof_link = null;
    if (data.source_url && !isValidUrl(data.source_url)) data.source_url = null;
    return TimelineModel.create({
      ...data,
      source_name: data.source_name && data.source_name.trim()
        ? data.source_name.trim()
        : "Internal",
      source_url: data.source_url && data.source_url.trim()
        ? data.source_url.trim()
        : null,
    });
  },

  async update(id, data) {
    if (!Array.isArray(data.skill_ids)) data.skill_ids = [];
    if (typeof data.date_end === "undefined") data.date_end = null;
    if (!isValidUrl(data.proof_link)) data.proof_link = null;
    if (data.source_url && !isValidUrl(data.source_url)) data.source_url = null;
    return TimelineModel.update(id, {
      ...data,
      source_name: data.source_name && data.source_name.trim()
        ? data.source_name.trim()
        : "Internal",
      source_url: data.source_url && data.source_url.trim()
        ? data.source_url.trim()
        : null,
    });
  },

  async remove(id) {
    return TimelineModel.remove(id);
  },

  async findByProviderEvent(provider, provider_event_id) {
    return TimelineModel.findByProviderEvent(provider, provider_event_id);
  },

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
      source_name: "Internal: Personae",
      source_url: null,
    };

    let event = await TimelineModel.findByProviderEvent(provider, provider_event_id);

    if (event) {
      return TimelineModel.update(event.id, timelineData);
    }
    return TimelineModel.create(timelineData);
  },

  async removeForPersona(id) {
    const provider = "internal";
    const provider_event_id = `persona-${id}`;
    const event = await TimelineModel.findByProviderEvent(provider, provider_event_id);
    if (event) {
      await TimelineModel.remove(event.id);
    }
  },

  /**
   * "Smart" event normalization for any source (persona, skill, project, github, etc).
   * @param {string} sourceType
   * @param {object} sourceData
   * @returns {object} timeline event
   */
  normalizeEvent(sourceType, sourceData) {
    switch (sourceType) {
      case "persona":
        return {
          type: "persona",
          title: sourceData.title,
          description: sourceData.summary || sourceData.description || "No description.",
          date_start: extractStartDate(sourceData.period),
          date_end: null,
          icon: sourceData.icon,
          proof_link: getPublicProofLink(sourceData),
          provider: "internal",
          provider_event_id: `persona-${sourceData.id}`,
          visible: true,
          automated: true,
          reviewed: true,
          order: sourceData.order,
          source: "internal",
          source_name: "Internal: Personae",
          source_url: null,
        };
      case "skill":
        return {
          type: "skill",
          title: sourceData.name,
          description: `Level: ${sourceData.level} | Category: ${sourceData.category}${sourceData.superpower ? " | Superpower!" : ""}`,
          date_start: sourceData.updated_at || sourceData.created_at,
          icon: sourceData.icon || null,
          proof_link: sourceData.cert_link || null,
          provider: "skill-matrix",
          provider_event_id: `skill-${sourceData.id}`,
          visible: sourceData.active !== undefined ? !!sourceData.active : true,
          reviewed: true,
          automated: true,
          order: sourceData.order !== undefined ? sourceData.order : null,
          source: "internal",
          source_name: "Internal: Skill Matrix",
          source_url: null,
          skill_ids: [sourceData.id],
          persona_ids: sourceData.persona_ids || [],
        };
      case "project":
        return {
          type: "project",
          title: sourceData.title,
          description: sourceData.description || "",
          date_start: sourceData.date_start,
          date_end: sourceData.date_end || null,
          icon: sourceData.image || null,
          proof_link: sourceData.demo_link || sourceData.repo_link || null,
          provider: "portfolio",
          provider_event_id: `project-${sourceData.id}`,
          visible: sourceData.visible !== undefined ? !!sourceData.visible : true,
          reviewed: true,
          automated: true,
          order: sourceData.order !== undefined ? sourceData.order : null,
          source: "portfolio",
          source_name: "Internal: Project Portfolio",
          source_url: null,
          project_ids: [sourceData.id],
          persona_ids: sourceData.persona_ids || [],
          skill_ids: sourceData.skills || [],
          highlight: !!sourceData.highlight,
        };
      case "github_release":
        return {
          type: "release",
          title: sourceData.release_name,
          description: sourceData.body,
          date_start: sourceData.published_at,
          date_end: null,
          icon: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
          proof_link: isValidUrl(sourceData.html_url) ? sourceData.html_url : null,
          provider: "github",
          provider_event_id: sourceData.id ? String(sourceData.id) : null,
          visible: true,
          automated: true,
          reviewed: true,
          order: null,
          source: "external",
          source_name: "GitHub",
          source_url: isValidUrl(sourceData.html_url) ? sourceData.html_url : null,
        };
      default:
        return {
          type: sourceType,
          title: "[Unknown Event]",
          description: "Unrecognized data source.",
          date_start: null,
          date_end: null,
          icon: null,
          proof_link: null,
          provider: sourceType,
          provider_event_id: null,
          visible: true,
          automated: false,
          reviewed: false,
          order: null,
          source: "external",
          source_name: sourceType,
          source_url: null,
        };
    }
  },
};

/** Only allow valid public links to be set as proof_link. */
function getPublicProofLink(source) {
  if (
    source.external_certificate_url &&
    typeof source.external_certificate_url === "string" &&
    source.external_certificate_url.startsWith("http")
  )
    return source.external_certificate_url;
  return null;
}

/** Simple URL validity check. */
function isValidUrl(url) {
  if (!url || typeof url !== "string") return false;
  return url.startsWith("http://") || url.startsWith("https://");
}

/** Normalize various period formats to 'YYYY-MM-DD'. */
function extractStartDate(period) {
  if (!period) return new Date().toISOString().slice(0, 10);
  if (/^\d{4}-\d{2}$/.test(period)) return `${period}-01`;
  if (/^\d{4}$/.test(period)) return `${period}-01-01`;
  return new Date(period).toISOString().slice(0, 10);
}

module.exports = TimelineService;