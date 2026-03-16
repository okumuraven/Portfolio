import axios from 'axios';

// Get the API base URL from env for production
const API_BASE_URL =
  process.env.NODE_ENV === 'development'
    ? (window.location.hostname.endsWith('.devtunnels.ms')
        ? 'https://xqtqz6hp-5000.euw.devtunnels.ms/api'
        : 'http://localhost:5000/api')
    : process.env.REACT_APP_API_URL;

// If you want to see what base URL is used (for debugging), uncomment:
// console.log("Using API base URL:", API_BASE_URL);

const http = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false // Set to true if you use cookies
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
