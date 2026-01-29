// src/api/auth.api.js
import http from './http';

export async function login(email, password) {
  const resp = await http.post('/auth/login', { email, password });
  return resp.data;
}

export async function getCurrentUser() {
  const resp = await http.get('/auth/me');
  return resp.data.user;
}