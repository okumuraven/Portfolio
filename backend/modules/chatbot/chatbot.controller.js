const ChatbotService = require('./chatbot.service');

const ChatbotController = {
  async handleChat(req, res, next) {
    try {
      const { message, history } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required." });
      }

      const ip = req.ip || req.connection.remoteAddress;
      const reply = await ChatbotService.processChat(message, history, ip);
      res.json({ reply });
    } catch (error) {
      if (error.message === "Chatbot is currently offline.") {
        return res.status(503).json({ error: error.message });
      }
      next(error);
    }
  },

  async getStatus(req, res, next) {
    try {
      const status = await ChatbotService.getStatus();
      res.json(status);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = ChatbotController;
