const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// ---- Security Headers ----
app.use(helmet());

// ---- Allowed Frontends ----
const allowedOrigins = [
  'http://localhost:3000',
  'https://xqtqz6hp-3000.euw.devtunnels.ms',
  'https://xqtqz6hp-5000.euw.devtunnels.ms',
];

// ---- Relax CORP for static images ----
// Only for /storage/projects, not APIs
app.use(
  '/storage/projects',
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  })
);

// ---- Static Images: CORS for `/storage/projects` ----
app.use(
  '/storage/projects',
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

// ---- Serve static project images ----
app.use('/storage/projects', express.static('storage/projects'));

// ---- All Other CORS (APIs) ----
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

// ---- Request Body Parsing ----
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Handles form-data uploads

// ---- Health Check ----
app.get('/', (req, res) => res.send('Portfolio Backend API Running!'));

// ==== ROUTE ATTACHMENTS ====
const authRoutes = require('./modules/auth/auth.routes');
const personasRoutes = require('./modules/personas/personas.routes');
const skillsRoutes = require('./modules/skills/skills.routes');
const projectsRoutes = require('./modules/projects/projects.routes');

app.use('/api/auth', authRoutes);
app.use('/api/personas', personasRoutes);
app.use('/personas', personasRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/skills', skillsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/projects', projectsRoutes);

// ---- 404 Handler ----
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

// ---- Global Error Handler (must be last) ----
const errorMiddleware = require('./middlewares/error.middleware');
app.use(errorMiddleware);

module.exports = app;