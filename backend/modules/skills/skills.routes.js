const express = require("express");
const SkillsController = require("./skills.controller");
const { validateSkill } = require("./skills.middlewares");
const requireAdmin = require("../auth/auth.middleware"); // Adjust path as needed if you moved middleware

const router = express.Router();

/**
 * PUBLIC ROUTES
 * Anyone can view/filter skills (for public Skill Matrix page)
 */
router.get("/", SkillsController.listSkills);
router.get("/:id", SkillsController.getSkill);

/**
 * ADMIN ROUTES (Protected: Create, Update, Delete)
 * Only admins can change the skill matrix!
 */
router.post("/", requireAdmin(), validateSkill, SkillsController.createSkill);
router.patch("/:id", requireAdmin(), validateSkill, SkillsController.updateSkill);
router.delete("/:id", requireAdmin(), SkillsController.deleteSkill);

module.exports = router;