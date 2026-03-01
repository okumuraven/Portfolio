const express = require("express");
const TimelineController = require("./timeline.controller");
const requireAdmin = require("../auth/auth.middleware");
const {
  validateTimelineEvent,
  validateTimelinePatch,
} = require("./timeline.middlewares");

const router = express.Router();

router.get("/by-provider/event", TimelineController.findByProviderEvent); // Keep this first

router.get("/", TimelineController.listTimeline);
router.get("/:id", TimelineController.getTimelineEvent);

// ADMIN ROUTES (protected)
router.post(
  "/",
  requireAdmin(),
  validateTimelineEvent,
  TimelineController.createTimelineEvent
);

router.patch(
  "/:id",
  requireAdmin(),
  validateTimelinePatch,
  TimelineController.updateTimelineEvent
);

router.delete(
  "/:id",
  requireAdmin(),
  TimelineController.deleteTimelineEvent
);

module.exports = router;