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
    try {
      const config = await RecoveryModel.getConfig();
      const logs = await RecoveryModel.getLogs(10);
      const reasons = await RecoveryModel.getReasons();
      const latestBriefing = await RecoveryModel.getLatestBriefing();

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
        recent_logs: logs || [],
        reasons: reasons || [],
        latest_briefing: latestBriefing,
        db_status: 'ONLINE'
      };
    } catch (error) {
      console.error("[RecoveryService] DB Status Fetch Failed:", error.message);
      // FAIL-SAFE: Return defaults so the UI doesn't crash
      return {
        streak: { last_reset_at: new Date(), days: 0, ms: 0 },
        recent_logs: [],
        reasons: [],
        latest_briefing: null,
        db_status: 'OFFLINE',
        db_error: error.message
      };
    }
  },

  async logUrge(intensity, context, notes) {
    try {
      return await RecoveryModel.logEvent({
        type: 'URGE',
        intensity,
        trigger_context: context,
        notes
      });
    } catch (error) {
      console.error("[RecoveryService] logUrge Failed:", error.message);
      throw new Error(`DATABASE_SYNC_FAILED: ${error.message}`);
    }
  },

  async resetStreak(notes) {
    return RecoveryModel.logEvent({
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
      console.error("[RecoveryService] Panic Redirection Error:", error);
      return "Focus on your breath. Count to ten. Remember why you started. You are stronger than this moment.";
    }
  },

  async chatWithAgent(userMessage, history = [], attempt = 1) {
    try {
      // Fetch user context (streak and reasons) to personalize the AI
      // We wrap this in a sub-try-catch so that if the DB is down, the AI still functions
      let streakDays = 0;
      let reasonsList = "";
      let dbInfo = "DB_OPERATIONAL";
      
      try {
        const status = await RecoveryService.getStatus();
        if (status.db_status === 'OFFLINE') {
          dbInfo = `DB_CONNECTION_FAILURE: ${status.db_error}`;
          reasonsList = "Context currently unavailable due to system sync issues.";
        } else {
          reasonsList = status.reasons.map(r => `- ${r.content}`).join('\n');
          streakDays = status.streak.days;
        }
      } catch (dbErr) {
        dbInfo = `DB_SERVICE_EXCEPTION: ${dbErr.message}`;
        reasonsList = "Context currently unavailable due to system sync issues.";
      }

      const genAI = getAIClient();
      const model = genAI.getGenerativeModel({
        model: "gemini-flash-latest",
        systemInstruction: `
          You are the "Recovery Sentinel" – a high-level AI expert system specializing in addiction recovery, behavioral psychology, and cognitive behavioral therapy.
          Your purpose is to provide deep, analytical, and structured support to the user (a software engineer) who is managing a long-term recovery journey.
          
          SYSTEM_DIAGNOSTICS:
          - DATABASE_INTERFACE: ${dbInfo}
          
          CURRENT_OPERATIVE_STATE:
          - STREAK_STABILITY: ${streakDays} days
          - CORE_MOTIVATIONS (Reasons for quitting):
          ${reasonsList || "No specific motivations logged yet. Encourage the user to define their 'Strategic Objectives'."}

          Guidelines for Communication:
          1. Use an engineering-adjacent tone (precise, logical, yet deeply human).
          2. ALWAYS structure your responses as a "Diagnostic Report".
          3. Use "### HEADER" for distinct sections (e.g., ### STATUS_DIAGNOSTIC, ### ACTION_PROTOCOLS, ### NEURAL_REWIRING).
          4. Use bulleted lists (starting with "1." or "*") for action steps or observations.
          5. Use **BOLD** for critical technical terms or behavioral vulnerabilities.
          6. Keep paragraphs short and concise.
          7. If the user is in a high-intensity urge, pivot to "### TACTICAL_REDIRECTION" immediately with 3 clear steps.
          8. REMIND the user of their CORE_MOTIVATIONS if they seem to be faltering.
          
          Goal: Prevent "wall of text" fatigue. Make every word count toward stability and system integrity.
          
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
      // Professional Retry Logic for 503 errors
      if (error.message.includes('503') && attempt < 3) {
        console.warn(`[RecoveryService] AI 503 Error. Retrying (Attempt ${attempt + 1})...`);
        await new Promise(res => setTimeout(res, 2000)); // Wait 2 seconds
        return RecoveryService.chatWithAgent(userMessage, history, attempt + 1);
      }

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
  },

  async generateDailyBriefing() {
    try {
      const MailerService = require('../../services/mailer.service');
      const status = await RecoveryService.getStatus();
      const reasonsList = status.reasons.map(r => `- ${r.content}`).join('\n');
      const streakDays = status.streak.days;

      const genAI = getAIClient();
      const model = genAI.getGenerativeModel({
        model: "gemini-flash-latest",
        systemInstruction: `
          You are the "Recovery Sentinel" – a professional therapist and high-level AI expert system.
          Your goal is to generate a "Daily Tactical Briefing" for a software engineer in recovery.

          TONE: Professional, Engineering-adjacent, Tactical, and Encouraging.
  ...
          CONTEXT:
          - Current Streak: ${streakDays} days
          - Core Motivations:
          ${reasonsList || "No specific motivations logged yet."}
          
          BRIEFING_STRUCTURE:
          1. ### STATUS_REPORT: Briefly acknowledge the streak stability.
          2. ### MISSION_OBJECTIVES: Remind them of their core motivations in a powerful way.
          3. ### TACTICAL_ADVICE: One professional therapeutic insight or CBT technique for the day.
          4. ### ENCOURAGEMENT: A brief, strong closing statement.
          
          Keep the briefing concise and high-impact.
        `,
      });

      const result = await model.generateContent("GENERATE_DAILY_BRIEFING");
      const briefingContent = result.response.text();

      // Save to DB
      await RecoveryModel.saveBriefing(briefingContent);

      // Send via Email
      const targetEmail = process.env.RECOVERY_TARGET_EMAIL || 'okumuraven@gmail.com';
      await MailerService.sendBriefing(targetEmail, briefingContent);

      return briefingContent;
    } catch (error) {
      console.error("[RecoveryService] Briefing Generation Error:", error);
      throw error;
    }
  },

  async surgicalReset() {
    return RecoveryModel.surgicalReset();
  },

  async testEmail() {
    const MailerService = require('../../services/mailer.service');
    const targetEmail = process.env.RECOVERY_TARGET_EMAIL || 'okumuraven@gmail.com';
    const content = `[SYSTEM_TEST] Email delivery subsystem operational. 
    TIMESTAMP: ${new Date().toISOString()}
    OPERATIVE: OKUMURAVEN
    STABILITY: NOMINAL`;
    
    return MailerService.sendBriefing(targetEmail, content);
  }
};

module.exports = RecoveryService;
