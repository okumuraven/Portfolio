const PersonasService = require('./personas.service');

/**
 * Controller for Persona endpoints.
 */
const PersonasController = {
  /** PUBLIC: Get all currently active personas (for portfolio landing, career page, etc.) */
  async listPublic(req, res, next) {
    try {
      // Only fetches personas with is_active === true
      const personas = await PersonasService.listAll({ publicView: true });
      res.json(personas);
    } catch (err) {
      next(err);
    }
  },

  /** ADMIN: List all personas (for admin CRUD table) */
  async listAdmin(req, res, next) {
    try {
      const personas = await PersonasService.listAll();
      res.json(personas);
    } catch (err) {
      next(err);
    }
  },

  /** ADMIN: Get a single persona by ID */
  async getOne(req, res, next) {
    try {
      const persona = await PersonasService.getOne(Number(req.params.id));
      if (!persona) return res.status(404).json({ error: 'Persona not found.' });
      res.json(persona);
    } catch (err) {
      next(err);
    }
  },

  /** ADMIN: Create a new persona */
  async createPersona(req, res, next) {
    try {
      const persona = await PersonasService.createPersona(req.body);
      res.status(201).json(persona);
    } catch (err) {
      next(err);
    }
  },

  /** ADMIN: Update persona by ID */
  async updatePersona(req, res, next) {
    try {
      const updatedPersona = await PersonasService.updatePersona(Number(req.params.id), req.body);
      res.json(updatedPersona);
    } catch (err) {
      next(err);
    }
  },

  /** ADMIN: Delete persona by ID */
  async deletePersona(req, res, next) {
    try {
      await PersonasService.deletePersona(Number(req.params.id));
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  },

  /** ADMIN: Instantly set a persona as active (for quick toggling) */
  async setActivePersona(req, res, next) {
    try {
      const activePersona = await PersonasService.setActivePersona(Number(req.params.id));
      res.json(activePersona);
    } catch (err) {
      next(err);
    }
  }
};

module.exports = PersonasController;