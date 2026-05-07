// src/api/auth.api.js
import http from './http';

export async function login(email, password) {
  const resp = await http.post('/auth/login', { email, password });
  return resp.data;
}

export async function login2FA(userId, token) {
  const resp = await http.post('/auth/login/2fa', { userId, token });
  return resp.data;
}

export async function setup2FA() {
  const resp = await http.post('/auth/2fa/setup');
  return resp.data;
}

export async function verifyAndEnable2FA(secret, token) {
  const resp = await http.post('/auth/2fa/verify', { secret, token });
  return resp.data;
}

export async function disable2FA() {
  const resp = await http.post('/auth/2fa/disable');
  return resp.data;
}

export async function getCurrentUser() {
  const resp = await http.get('/auth/me');
  return resp.data.user;
}