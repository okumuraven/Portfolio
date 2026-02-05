const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// ---- Security Headers ----
app.use(helmet());

// ---- CORS: Allow localhost and DevTunnels (frontend/backend) ----
const allowedOrigins = [
  'http://localhost:3000',
  'https://xqtqz6hp-3000.euw.devtunnels.ms', // DevTunnel (frontend)
  'https://xqtqz6hp-5000.euw.devtunnels.ms', // DevTunnel (backend, optional)
];
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // Allow REST tools, SSR
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true // For cookies, JWT tokens, etc.
}));

// ---- Request Body Parsing ----
app.use(express.json());

// ---- Health Check (Root) ----
app.get('/', (req, res) => {
  res.send('Portfolio Backend API Running!');
});

// ==== ROUTE ATTACHMENTS ====

// ---- Authentication ----
const authRoutes = require('./modules/auth/auth.routes');
app.use('/api/auth', authRoutes);

// ---- Personas ----
const personasRoutes = require('./modules/personas/personas.routes');
app.use('/api/personas', personasRoutes);

// ---- Skills (Skill Matrix) ----
const skillsRoutes = require('./modules/skills/skills.routes');
app.use('/api/skills', skillsRoutes);

// ---- Projects (for project management, optional) ----
// const projectsRoutes = require('./modules/projects/projects.routes');
// app.use('/api/projects', projectsRoutes);

// ---- Timeline / Achievements (optional) ----
// const timelineRoutes = require('./modules/achievements/achievements.routes');
// app.use('/api/achievements', timelineRoutes);

// ---- Activity Logs (optional) ----
// const activityRoutes = require('./modules/activity/activity.routes');
// app.use('/api/activity', activityRoutes);

// ---- Contact (optional) ----
// const contactRoutes = require('./modules/contact/contact.routes');
// app.use('/api/contact', contactRoutes);

// ---- Shared Error Handler (Must be last!) ----
const errorMiddleware = require('./middlewares/error.middleware');
app.use(errorMiddleware);

module.exports = app;