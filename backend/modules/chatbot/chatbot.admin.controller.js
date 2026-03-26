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
      // Input sanitization/validation can be robustified here
      const updated = await ChatbotModel.updateConfig({
        is_active: req.body.is_active === true || req.body.is_active === 'true',
        base_website_price: req.body.base_website_price || '',
        hourly_rate: req.body.hourly_rate || '',
        system_prompt: req.body.system_prompt || ''
      });
      res.json(updated);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = ChatbotAdminController;
