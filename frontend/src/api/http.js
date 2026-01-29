import axios from 'axios';

// Dynamically choose baseURL based on where the frontend is running
let API_BASE_URL;

if (window.location.hostname.endsWith('.devtunnels.ms')) {
  // Using VSCode Dev Tunnel—point to tunnel backend
  API_BASE_URL = 'https://xqtqz6hp-5000.euw.devtunnels.ms/api';
} else {
  // Local development
  API_BASE_URL = 'http://localhost:5000/api';
}

const http = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false // If you use cookies, set to true
});

// Attach JWT automatically for all requests
http.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default http;