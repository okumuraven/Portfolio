const express = require("express");
const router = express.Router();

const ContactController = require("./contact.controller");
const requireAdmin = require("../auth/auth.middleware"); // Adjust path if needed

// --- PUBLIC ROUTES ---

// Get visible contact/profile info (for frontend about/contact rendering)
router.get("/", ContactController.getContactProfile);

// --- ADMIN ROUTES (JWT-protected for admin panel only) ---

// Get all profile fields (including invisible/hidden)
router.get("/admin", requireAdmin(), ContactController.getAllProfileAdmin);

// Create new profile/contact field
router.post("/", requireAdmin(), ContactController.createProfileField);

// Update field by ID
router.patch("/:id", requireAdmin(), ContactController.updateProfileField);

// Delete field by ID
router.delete("/:id", requireAdmin(), ContactController.deleteProfileField);

module.exports = router;