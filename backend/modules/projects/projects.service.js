const ProjectsModel = require("./projects.model");
const TimelineService = require("../timeline/timeline.service"); // adjust path as needed

const ProjectsService = {
  async listProjects(opts = {}) {
    return ProjectsModel.findAll(opts);
  },

  async getProjectOrThrow(id) {
    const project = await ProjectsModel.findById(id);
    if (!project) {
      const err = new Error("Project not found");
      err.status = 404;
      throw err;
    }
    return project;
  },

  async createProject(projectData) {
    const created = await ProjectsModel.create(projectData);

    // Sync to timeline!
    const timelineEvent = ProjectsService.toTimelineEvent(created);
    const exists = await TimelineService.findByProviderEvent("portfolio", `project-${created.id}`);
    if (!exists) {
      await TimelineService.create(timelineEvent);
    }
    return created;
  },

  async updateProject(id, changes) {
    const updated = await ProjectsModel.update(id, changes);

    // Sync to timeline!
    const timelineEvent = ProjectsService.toTimelineEvent(updated);
    const exists = await TimelineService.findByProviderEvent("portfolio", `project-${updated.id}`);
    if (exists) {
      await TimelineService.update(exists.id, timelineEvent);
    } else {
      await TimelineService.create(timelineEvent);
    }
    return updated;
  },

  async deleteProject(id) {
    // Remove timeline event if exists!
    const exists = await TimelineService.findByProviderEvent("portfolio", `project-${id}`);
    if (exists) {
      await TimelineService.remove(exists.id);
    }
    return ProjectsModel.remove(id);
  },

  toTimelineEvent(project) {
    // Map your project to a timeline event format!
    return {
      type: "project",
      title: project.title,
      description: project.description || "",
      date_start: project.date_start,
      date_end: project.date_end || null,
      icon: project.image || null,
      proof_link: project.demo_link || project.repo_link || null,
      source: "portfolio",
      source_name: "Internal: Project Portfolio",
      source_url: null,
      project_ids: [project.id],
      persona_ids: project.persona_ids || [],
      skill_ids: project.skills || [],
      order: project.order !== undefined ? project.order : null,
      visible: project.visible !== undefined ? !!project.visible : true,
      reviewed: true,
      automated: true,
      provider: "portfolio",
      provider_event_id: `project-${project.id}`,
      highlight: !!project.highlight,
    };
  },
};

module.exports = ProjectsService;