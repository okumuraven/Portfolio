const RecoveryModel = require('./recovery.model');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const RecoveryService = {
  async getStatus() {
    const config = await RecoveryModel.getConfig();
    const logs = await RecoveryModel.getLogs(10);
    const reasons = await RecoveryModel.getReasons();

    const lastReset = config ? new Date(config.last_reset_at) : new Date();
    const now = new Date();
    const diffMs = now - lastReset;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    return {
      streak: {
        last_reset_at: lastReset,
        days: diffDays,
        ms: diffMs
      },
      recent_logs: logs,
      reasons: reasons
    };
  },

  async logUrge(intensity, context, notes) {
    return RecoveryModel.logEvent({
      type: 'URGE',
      intensity,
      trigger_context: context,
      notes
    });
  },

  async resetStreak(notes) {
    await RecoveryModel.logEvent({
      type: 'RESET',
      notes
    });
    return RecoveryModel.updateLastReset();
  },

  async getPanicRedirection() {
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-flash-latest",
        systemInstruction: `
          You are a Virtual Operative AI and a professional therapist. 
          The user is experiencing a strong urge to relapse into an addiction.
          Your goal is to provide immediate cognitive behavioral redirection. 
          Be firm, tactical, yet empathetic. 
          Remind them of the engineering approach they have taken to their recovery.
          Provide 3 immediate, practical action steps to diffuse the urge.
          Keep it concise, powerful, and focused on immediate survival of the urge.
        `,
      });

      const result = await model.generateContent("EMERGENCY: I am having a strong urge. Redirect me now.");
      return result.response.text();
    } catch (error) {
      console.error("[RecoveryService] Gemini Error:", error.message);
      return "Focus on your breath. Count to ten. Remember why you started. You are stronger than this moment.";
    }
  },

  async addReason(content) {
    return RecoveryModel.addReason(content);
  },

  async removeReason(id) {
    return RecoveryModel.removeReason(id);
  }
};

module.exports = RecoveryService;
