const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const app = express();

// ---- Security Headers ----
app.use(helmet());

// ---- CORS: Allow localhost and DevTunnels (frontend/backend) ----
const allowedOrigins = [
  'http://localhost:3000',
  'https://xqtqz6hp-3000.euw.devtunnels.ms', // Tunnel (frontend)
  'https://xqtqz6hp-5000.euw.devtunnels.ms', // Tunnel (backend, optional/safe)
];
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true // True if you ever use cookies; safe for modern APIs
}));

// ---- Request Body Parsing ----
app.use(express.json());

// ---- Health Check (Root) ----
app.get('/', (req, res) => {
  res.send('Portfolio Backend API Running!');
});

// ---- AUTHENTICATION ROUTES ----
const authRoutes = require('./modules/auth/auth.routes');
app.use('/api/auth', authRoutes);

// ---- PERSONA ROUTES ----
const personasRoutes = require('./modules/personas/personas.routes');
app.use('/api/personas', personasRoutes);

// ---- (Optional) Attach more modules here ----
// const userRoutes = require('./modules/users/users.routes');
// app.use('/api/users', userRoutes);

// ---- (Optional) Shared Error Handler ----
// const errorMiddleware = require('./middlewares/error.middleware');
// app.use(errorMiddleware);

module.exports = app;