import axios from 'axios';

// Always ensure API_BASE_URL ends with /api in all environments
const API_BASE_URL =
  process.env.NODE_ENV === 'development'
    ? (
        window.location.hostname.endsWith('.devtunnels.ms')
          ? `https://${window.location.hostname.replace('-3000', '-5000')}/api`
          : `http://${window.location.hostname}:5000/api`
      )
    : (
        // If your Vercel env var ends WITHOUT /api, add it here:
        process.env.REACT_APP_API_URL.endsWith('/api')
          ? process.env.REACT_APP_API_URL
          : process.env.REACT_APP_API_URL + '/api'
      );

// For debugging, you can uncomment:
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
