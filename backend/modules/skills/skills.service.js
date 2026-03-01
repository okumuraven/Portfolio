const SkillsModel = require("./skills.model");
const TimelineService = require("../timeline/timeline.service"); // Adjust path to timeline service

const SkillsService = {
  async listSkills(opts = {}) {
    return SkillsModel.findAll(opts);
  },

  async getSkillOrThrow(id) {
    const skill = await SkillsModel.findById(id);
    if (!skill) {
      const err = new Error("Skill not found");
      err.status = 404;
      throw err;
    }
    return skill;
  },

  async createSkill(skillData) {
    const created = await SkillsModel.create(skillData);

    // Timeline event sync
    const timelineEvent = SkillsService.toTimelineEvent(created);
    const exists = await TimelineService.findByProviderEvent("skill-matrix", `skill-${created.id}`);
    if (!exists) {
      await TimelineService.create(timelineEvent);
    }
    return created;
  },

  async updateSkill(id, changes) {
    const updated = await SkillsModel.update(id, changes);

    // Timeline event sync
    const timelineEvent = SkillsService.toTimelineEvent(updated);
    const exists = await TimelineService.findByProviderEvent("skill-matrix", `skill-${updated.id}`);
    if (exists) {
      await TimelineService.update(exists.id, timelineEvent);
    } else {
      await TimelineService.create(timelineEvent);
    }
    return updated;
  },

  async deleteSkill(id) {
    // Remove timeline event if exists
    const exists = await TimelineService.findByProviderEvent("skill-matrix", `skill-${id}`);
    if (exists) {
      await TimelineService.remove(exists.id);
    }
    return SkillsModel.remove(id);
  },

  async batchUpdateOrder(list) {
    const updates = list.map(({ id, order }) => SkillsModel.update(id, { order }));
    return Promise.all(updates);
  },

  toTimelineEvent(skill) {
    return {
      type: "skill",
      title: skill.name,
      description: `Level: ${skill.level} | Category: ${skill.category}${skill.superpower ? " | Superpower!" : ""}`,
      date_start: skill.updated_at || skill.created_at,
      icon: skill.icon || null,
      proof_link: skill.cert_link || null,
      source: "internal",
      source_name: "Internal: Skill Matrix",
      source_url: null,
      skill_ids: [skill.id],
      persona_ids: skill.persona_ids || [],
      order: skill.order !== undefined ? skill.order : null,
      visible: skill.active !== undefined ? !!skill.active : true,
      reviewed: true,
      automated: true,
      provider: "skill-matrix",
      provider_event_id: `skill-${skill.id}`,
    };
  }
};

module.exports = SkillsService;