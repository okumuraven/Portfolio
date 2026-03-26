const ChatbotModel = require('./chatbot.model');

const ChatbotAdminController = {
  async getConfig(req, res, next) {
    try {
      const config = await ChatbotModel.getConfig();
      res.json(config);
    } catch (error) {
      next(error);
    }
  },

  async updateConfig(req, res, next) {
    try {
      const current = await ChatbotModel.getConfig();
      const updated = await ChatbotModel.updateConfig({
        is_active: req.body.is_active === true || req.body.is_active === 'true',
        base_website_price: current.base_website_price || '500',
        hourly_rate: current.hourly_rate || '50',
        system_prompt: null // Stick to file-based prompt
      });
      res.json(updated);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = ChatbotAdminController;
