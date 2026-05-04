const db = require('../../database');

const RecoveryModel = {
  async getConfig() {
    return db.oneOrNone('SELECT * FROM recovery_config LIMIT 1');
  },

  async updateLastReset(timestamp = new Date()) {
    return db.one(`
      UPDATE recovery_config 
      SET last_reset_at = $1, updated_at = NOW() 
      WHERE id = (SELECT id FROM recovery_config LIMIT 1)
      RETURNING *
    `, [timestamp]);
  },

  async logEvent(event) {
    const { type, intensity, trigger_context, notes } = event;
    return db.one(`
      INSERT INTO recovery_logs (type, intensity, trigger_context, notes)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [type, intensity, trigger_context, notes]);
  },

  async getLogs(limit = 50) {
    return db.any('SELECT * FROM recovery_logs ORDER BY created_at DESC LIMIT $1', [limit]);
  },

  async getReasons() {
    return db.any('SELECT * FROM recovery_reasons ORDER BY created_at DESC');
  },

  async addReason(content) {
    return db.one('INSERT INTO recovery_reasons (content) VALUES ($1) RETURNING *', [content]);
  },

  async removeReason(id) {
    return db.none('DELETE FROM recovery_reasons WHERE id = $1', [id]);
  }
};

module.exports = RecoveryModel;
