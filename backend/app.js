const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// ---- Security Headers ----
app.use(helmet());

// ---- Allowed Frontends (Include your Vercel domain!) ----
const allowedOrigins = [
  'http://localhost:3000',
  'https://xqtqz6hp-3000.euw.devtunnels.ms',
  'https://xqtqz6hp-5000.euw.devtunnels.ms',
  'https://portfolio-okumuravens-projects.vercel.app', // <---- YOUR VERCEL FRONTEND DOMAIN
];

// ---- Dynamic Origin Checking ----
const corsOptions = {
  origin: function (origin, callback) {
    // allow REST tools/server-to-server/no-origin requests
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};

// ---- CORS for Static Images ----
app.use('/storage/projects', cors(corsOptions), express.static('storage/projects'));

// ---- CORS for All Other APIs ----
app.use(cors(corsOptions));

// ---- Request Body Parsing ----
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---- Health Check ----
app.get('/', (req, res) => res.send('Portfolio Backend API Running!'));

// ==== ROUTE ATTACHMENTS ====
// Modular, clear order

const authRoutes = require('./modules/auth/auth.routes');
const personasRoutes = require('./modules/personas/personas.routes');
const skillsRoutes = require('./modules/skills/skills.routes');
const projectsRoutes = require('./modules/projects/projects.routes');
const timelineRoutes = require('./modules/timeline/timeline.routes');
const contactRoutes = require('./modules/contact/contact.routes');

app.use('/api/auth', authRoutes);
app.use('/api/personas', personasRoutes);
app.use('/personas', personasRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/skills', skillsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/projects', projectsRoutes);
app.use('/api/timeline', timelineRoutes);
app.use('/timeline', timelineRoutes);
app.use('/api/contact', contactRoutes);

// ---- 404 Handler ----
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

// ---- Global Error Handler ----
const errorMiddleware = require('./middlewares/error.middleware');
app.use(errorMiddleware);

module.exports = app;