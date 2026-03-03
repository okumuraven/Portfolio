const ContactService = require("./contact.service");

/**
 * Public: Get all visible contact/profile fields, ordered for frontend.
 */
exports.getContactProfile = async (req, res, next) => {
  try {
    const profile = await ContactService.getAllVisible();
    res.json({ profile });
  } catch (err) {
    next(err);
  }
};

/**
 * Admin: Get all contact/profile fields (visible or not).
 */
exports.getAllProfileAdmin = async (req, res, next) => {
  try {
    const profile = await ContactService.getAll();
    res.json({ profile });
  } catch (err) {
    next(err);
  }
};

/**
 * Admin: Update ANY profile field by ID.
 * Accepts partial, e.g. { value, visible, sort_order, type }
 */
exports.updateProfileField = async (req, res, next) => {
  try {
    const { id } = req.params;
    const fieldData = req.body;
    // Optionally, sanitize/validate fieldData keys here
    // e.g. only allow keys in ["value", "visible", "sort_order", "type"]
    const allowedKeys = ["value", "visible", "sort_order", "type"];
    const updateData = {};
    for (const key of allowedKeys) {
      if (typeof fieldData[key] !== "undefined") updateData[key] = fieldData[key];
    }
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "No updatable fields provided." });
    }
    const updated = await ContactService.updateById(Number(id), updateData);
    res.json({ updated });
  } catch (err) {
    next(err);
  }
};

/**
 * Admin: Create a new profile/contact/about field
 */
exports.createProfileField = async (req, res, next) => {
  try {
    const fieldData = req.body;
    // Validate required keys
    const required = ["field", "value", "type"];
    const missing = required.filter(k => !fieldData[k]);
    if (missing.length > 0) {
      return res.status(400).json({ error: `Missing: ${missing.join(", ")}` });
    }
    // Default sort_order/visible if omitted
    if (typeof fieldData.sort_order === "undefined") fieldData.sort_order = 0;
    if (typeof fieldData.visible === "undefined") fieldData.visible = true;
    const created = await ContactService.create(fieldData);
    res.status(201).json({ created });
  } catch (err) {
    next(err);
  }
};

/**
 * Admin: Remove (delete) a field
 */
exports.deleteProfileField = async (req, res, next) => {
  try {
    const { id } = req.params;
    await ContactService.remove(Number(id));
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};