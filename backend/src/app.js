const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const app = express();

// Security headers
app.use(helmet());

// CORS config: adjust "origin" for your frontend port
app.use(cors({
  origin: 'http://localhost:3000', // Change this if your frontend runs elsewhere
  credentials: true, // For cookies if you use them later
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