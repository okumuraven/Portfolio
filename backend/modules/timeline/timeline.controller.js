const TimelineModel = require("./timeline.model");

exports.listTimeline = async (req, res, next) => {
  try {
    const {
      type,
      visible,
      personaId,
      skillId,
      reviewed,
      automated,
      provider,
    } = req.query;

    const events = await TimelineModel.findAll({
      type,
      visible: visible !== undefined ? visible === "true" : undefined,
      personaId: personaId !== undefined ? Number(personaId) : undefined,
      skillId: skillId !== undefined ? Number(skillId) : undefined,
      reviewed: reviewed !== undefined ? reviewed === "true" : undefined,
      automated: automated !== undefined ? automated === "true" : undefined,
      provider,
    });
    res.json({ data: events });
  } catch (err) {
    console.error("[TimelineController.listTimeline ERROR]", err);
    next(err);
  }
};

exports.getTimelineEvent = async (req, res, next) => {
  try {
    const event = await TimelineModel.findById(Number(req.params.id));
    if (!event) {
      return res.status(404).json({ error: "Timeline event not found." });
    }
    res.json({ data: event });
  } catch (err) {
    console.error("[TimelineController.getTimelineEvent ERROR]", err);
    next(err);
  }
};

exports.createTimelineEvent = async (req, res, next) => {
  try {
    const payload = req.body;
    if (!Array.isArray(payload.skill_ids)) payload.skill_ids = [];
    const created = await TimelineModel.create(payload);
    res.status(201).json({ data: created });
  } catch (err) {
    console.error("[TimelineController.createTimelineEvent ERROR]", err, "\nPayload was:", req.body);
    next(err);
  }
};

exports.updateTimelineEvent = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const event = req.body;
    if (!Array.isArray(event.skill_ids)) event.skill_ids = [];
    const updated = await TimelineModel.update(id, event);
    res.json({ data: updated });
  } catch (err) {
    console.error("[TimelineController.updateTimelineEvent ERROR]", err, "\nPayload was:", req.body);
    next(err);
  }
};

exports.deleteTimelineEvent = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    await TimelineModel.remove(id);
    res.status(204).end();
  } catch (err) {
    console.error("[TimelineController.deleteTimelineEvent ERROR]", err);
    next(err);
  }
};

exports.findByProviderEvent = async (req, res, next) => {
  try {
    const { provider, provider_event_id } = req.query;
    if (!provider || !provider_event_id) {
      return res.status(400).json({ error: "Missing provider or provider_event_id." });
    }
    const event = await TimelineModel.findByProviderEvent(provider, provider_event_id);
    if (!event)
      return res.status(404).json({ error: "Timeline event not found for provider." });
    res.json({ data: event });
  } catch (err) {
    console.error("[TimelineController.findByProviderEvent ERROR]", err);
    next(err);
  }
};