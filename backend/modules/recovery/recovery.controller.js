const RecoveryService = require('./recovery.service');

const RecoveryController = {
  async getStatus(req, res, next) {
    try {
      const status = await RecoveryService.getStatus();
      res.json(status);
    } catch (err) {
      next(err);
    }
  },

  async logUrge(req, res, next) {
    try {
      const { intensity, trigger_context, notes } = req.body;
      const log = await RecoveryService.logUrge(intensity, trigger_context, notes);
      res.status(201).json(log);
    } catch (err) {
      next(err);
    }
  },

  async resetStreak(req, res, next) {
    try {
      const { notes } = req.body;
      const config = await RecoveryService.resetStreak(notes);
      res.json(config);
    } catch (err) {
      next(err);
    }
  },

  async panic(req, res, next) {
    try {
      const redirection = await RecoveryService.getPanicRedirection();
      res.json({ redirection });
    } catch (err) {
      next(err);
    }
  },

  async addReason(req, res, next) {
    try {
      const { content } = req.body;
      const reason = await RecoveryService.addReason(content);
      res.status(201).json(reason);
    } catch (err) {
      next(err);
    }
  },

  async removeReason(req, res, next) {
    try {
      const { id } = req.params;
      await RecoveryService.removeReason(id);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  },

  async chat(req, res, next) {
    try {
      const { message, history } = req.body;
      const response = await RecoveryService.chatWithAgent(message, history);
      res.json({ response });
    } catch (err) {
      next(err);
    }
  },

  async generateBriefing(req, res, next) {
    try {
      const briefing = await RecoveryService.generateDailyBriefing();
      res.json({ briefing });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = RecoveryController;
