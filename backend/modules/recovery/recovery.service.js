const RecoveryModel = require('./recovery.model');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const configEnv = require('../../config/env');

// Initialization helper to ensure we use the correct key
const getAIClient = () => {
  const key = configEnv.RECOVERY_GEMINI_API_KEY || configEnv.GEMINI_API_KEY;
  if (!key) {
    throw new Error("Missing Gemini API Key in system configuration.");
  }
  return new GoogleGenerativeAI(key);
};

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
      const genAI = getAIClient();
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
      console.error("[RecoveryService] Panic Redirection Error:", error.message);
      return "Focus on your breath. Count to ten. Remember why you started. You are stronger than this moment.";
    }
  },

  async chatWithAgent(userMessage, history = []) {
    try {
      const genAI = getAIClient();
      const model = genAI.getGenerativeModel({
        model: "gemini-flash-latest",
        systemInstruction: `
          You are the "Recovery Sentinel" – a high-level AI expert system specializing in addiction recovery, behavioral psychology, and cognitive behavioral therapy.
          Your purpose is to provide deep, analytical, and empathetic support to the user (a software engineer) who is managing a long-term recovery journey.
          
          Guidelines:
          1. Use an engineering-adjacent tone (precise, logical, yet deeply human).
          2. Help with research into behavioral patterns, neurobiology of addiction, and recovery strategies.
          3. Provide non-judgmental, professional advice.
          4. If the user is in a high-intensity urge, pivot to "Tactical Redirection" immediately.
          5. Keep the conversation private and focused on growth, integrity, and system stability.
          
          You are NOT the public-facing portfolio bot. You are the user's private tactical advisor.
        `,
      });

      const geminiHistory = [];
      if (Array.isArray(history)) {
        // Map history ensuring we don't have consecutive same roles
        history.forEach(msg => {
          const role = msg.role === 'ai' ? 'model' : 'user';
          if (geminiHistory.length > 0 && geminiHistory[geminiHistory.length - 1].role === role) {
            geminiHistory[geminiHistory.length - 1].parts[0].text += `\n\n${msg.content}`;
          } else {
            geminiHistory.push({
              role: role,
              parts: [{ text: msg.content }]
            });
          }
        });
        
        // Gemini API REQUIRES history to start with 'user'
        if (geminiHistory.length > 0 && geminiHistory[0].role === 'model') {
          geminiHistory.shift();
        }
      }

      const chat = model.startChat({ history: geminiHistory });
      const result = await chat.sendMessage(userMessage);
      return result.response.text();
    } catch (error) {
      console.error("[RecoveryService] AI Chat Error:", error.message);
      // Re-throw to be caught by controller
      throw error;
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
