const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const app = express();

// Security headers
app.use(helmet());

// Allow both localhost and VSCode tunnel origins for dev
const allowedOrigins = [
  'http://localhost:3000',
  'https://xqtqz6hp-3000.euw.devtunnels.ms', // Your tunnel frontend
  'https://xqtqz6hp-5000.euw.devtunnels.ms', // Your tunnel backend (if ever needed, safe to add)
];

// CORS config: accepts both in development
app.use(cors({
  origin: function(origin, callback) {
    // Allow no origin for tools like curl/Postman, or if run locally
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true // Set to true if using cookies, false if only Bearer tokens
}));

// Parse JSON bodies
app.use(express.json());

// Health check root
app.get('/', (req, res) => {
  res.send('Portfolio Backend API Running!');
});

// === AUTH API ENDPOINTS ===
const authRoutes = require('../modules/auth/auth.routes');
app.use('/api/auth', authRoutes);

// (Optional: attach more modules here!)
// const userRoutes = require('./modules/users/users.routes');
// app.use('/api/users', userRoutes);

module.exports = app;