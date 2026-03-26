const db = require('../../database');

/**
 * Chatbot Model: CRUD for the chatbot_config table and chat_logs
 */
const ChatbotModel = {
  async getConfig() {
    // Return the absolute latest configuration row (Versioning)
    return db.oneOrNone('SELECT * FROM chatbot_config ORDER BY id DESC LIMIT 1');
  },

  async updateConfig(data) {
    const { is_active, base_website_price, hourly_rate, system_prompt } = data;
    // INSERT instead of UPDATE to maintain version history!
    return db.one(`
      INSERT INTO chatbot_config (is_active, base_website_price, hourly_rate, system_prompt)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [is_active, base_website_price, hourly_rate, system_prompt]);
  },

  async insertLog(ipAddress, userMessage, aiResponse) {
    return db.none(`
      INSERT INTO chat_logs (ip_address, user_message, ai_response)
      VALUES ($1, $2, $3)
    `, [ipAddress, userMessage, aiResponse]);
  }
};

module.exports = ChatbotModel;
