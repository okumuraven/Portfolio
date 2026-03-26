import http from './http';

/**
 * Public: Send a message to the AI Chatbot
 */
export async function sendChatMessage(message, history = []) {
  const res = await http.post('/ai-chat', { message, history });
  return res.data;
}

/**
 * Public: Get chatbot status (is_active)
 */
export async function getChatbotStatus() {
  const res = await http.get('/ai-chat/status');
  return res.data;
}

/**
 * Admin: Get complete configuration
 */
export async function getChatbotConfig() {
  const res = await http.get('/admin/ai-pricing');
  return res.data;
}

/**
 * Admin: Update configuration
 */
export async function updateChatbotConfig(data) {
  const res = await http.put('/admin/ai-pricing', data);
  return res.data;
}

const ChatbotAPI = {
  sendChatMessage,
  getChatbotStatus,
  getChatbotConfig,
  updateChatbotConfig
};

export default ChatbotAPI;
