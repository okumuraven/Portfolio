const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const ChatbotModel = require('./chatbot.model');

// Initialize Gemini client (requires GEMINI_API_KEY in .env)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const ChatbotService = {
  /**
   * Process a chat message from a user
   * @param {string} userMessage The latest message from the user
   * @param {Array} history Optional previous messages in the conversation
   * @param {string} ipAddress Request IP for analytics
   * @returns {Promise<string>} The AI's response text
   */
  async processChat(userMessage, history = [], ipAddress = 'unknown') {
    // 1. Fetch live config from database
    const config = await ChatbotModel.getConfig();
    if (!config || !config.is_active) {
      throw new Error("Chatbot is currently offline.");
    }

    // 2. Load and parse the system prompt template
    const promptPath = path.join(__dirname, 'prompts', 'estimatorPrompt.txt');
    let systemPromptTemplate = fs.readFileSync(promptPath, 'utf8');

    // Override text file if DB has custom instructions
    if (config.system_prompt) {
      systemPromptTemplate = config.system_prompt;
    }

    // Inject live pricing
    const systemPromptMessage = systemPromptTemplate
      .replace('{{base_website_price}}', config.base_website_price || 'N/A')
      .replace('{{hourly_rate}}', config.hourly_rate || 'N/A');

    try {
      // 3. Initialize the Gemini Model
      const model = genAI.getGenerativeModel({
        model: "gemini-flash-latest",
        systemInstruction: systemPromptMessage,
      });

      // 4. Map existing multi-turn chat format to Gemini's format
      const geminiHistory = [];
      if (Array.isArray(history)) {
        history.slice(-10).forEach(msg => {
          if (msg.role && msg.content) {
            const mappedRole = msg.role === 'ai' ? 'model' : 'user';
            
            // If the last message has the same role, append to its text instead of creating a new consecutive message
            if (geminiHistory.length > 0 && geminiHistory[geminiHistory.length - 1].role === mappedRole) {
              geminiHistory[geminiHistory.length - 1].parts[0].text += `\n\n${msg.content}`;
            } else {
              geminiHistory.push({
                role: mappedRole,
                parts: [{ text: msg.content }]
              });
            }
          }
        });
        
        // Gemini API REQUIRES the first message in history to be from 'user'.
        // If the sliced history happens to start with 'model', we drop it.
        if (geminiHistory.length > 0 && geminiHistory[0].role === 'model') {
          geminiHistory.shift();
        }
      }

      // 5. Build and execute chat completion
      const chat = model.startChat({
        history: geminiHistory,
      });

      const result = await chat.sendMessage(userMessage);
      const reply = result.response.text();

      // 6. Log the conversation asynchronously
      ChatbotModel.insertLog(ipAddress, userMessage, reply).catch(err => {
        console.error("[ChatbotService] Failed to log chat:", err.message);
      });

      return reply;
    } catch (error) {
      console.error("[ChatbotService] Gemini Error:", error.message);
      throw new Error("I'm currently unable to connect to my AI brain. Please try again later or contact support directly.");
    }
  },

  /**
   * Gets the current public configuration for ping/status checks
   */
  async getStatus() {
    const config = await ChatbotModel.getConfig();
    return {
      is_active: config ? config.is_active : false,
    };
  }
};

module.exports = ChatbotService;
