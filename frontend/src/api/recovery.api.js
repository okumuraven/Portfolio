import http from './http';

const recoveryApi = {
  getStatus: () => http.get('/admin/recovery/status'),
  logUrge: (data) => http.post('/admin/recovery/log-urge', data),
  resetStreak: (data) => http.post('/admin/recovery/reset', data),
  panic: () => http.post('/admin/recovery/panic'),
  addReason: (data) => http.post('/admin/recovery/reasons', data),
  removeReason: (id) => http.delete(`/admin/recovery/reasons/${id}`),
  chat: (data) => http.post('/admin/recovery/chat', data),
  generateBriefing: () => http.post('/admin/recovery/generate-briefing'),
  surgicalReset: () => http.post('/admin/recovery/surgical-reset'),
  testEmail: () => http.post('/admin/recovery/test-email'),
};

export default recoveryApi;
