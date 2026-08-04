const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const app = express();

// Trust the first proxy hop (Render/Vercel-style reverse proxy) so req.ip reflects
// the real client IP from X-Forwarded-For instead of the proxy's own address —
// otherwise express-rate-limit buckets every user behind the proxy together.
app.set('trust proxy', 1);

// ---- Security Headers ----
app.use(helmet());

// ---- Allowed Frontends ----
const allowedOrigins = [
  'http://localhost:3000',
  'https://xqtqz6hp-3000.euw.devtunnels.ms',
  'https://xqtqz6hp-5000.euw.devtunnels.ms',
  'https://portfolio-okumuravens-projects.vercel.app',
  'https://okumuraven.me',              // added for new custom domain
  'https://www.okumuraven.me',          // added for www redirect
];

// ---- Dynamic Origin Checking ----
// Wildcards are scoped as tightly as possible: only this project's known Vercel
// deployment prefix is trusted (not *any* vercel.app app), and dev-only patterns
// (devtunnels, private LAN) are disabled outright once NODE_ENV=production.
const isProduction = process.env.NODE_ENV === 'production';

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const isAllowed =
      allowedOrigins.includes(origin) ||
      /^https:\/\/(www\.)?okumuraven\.me$/.test(origin) ||
      /^https:\/\/portfolio(-[a-z0-9-]+)?-okumuravens-projects\.vercel\.app$/.test(origin) ||
      (!isProduction && /^https:\/\/.*\.devtunnels\.ms$/.test(origin)) ||
      (!isProduction && /^http:\/\/(192\.168|10\.|172\.(1[6-9]|2[0-9]|3[0-1]))\./.test(origin));

    if (isAllowed) return callback(null, true);
    console.warn("CORS BLOCKED:", origin);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};

// ---- CORS + Static serving for uploaded images ----
app.use(
  '/storage/projects',
  cors(corsOptions),
  express.static(path.join(__dirname, 'storage/projects'))
);

// ---- CORS for all other APIs ----
app.use(cors(corsOptions));

// ---- Request Body Parsing ----
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---- Health Check ----
app.get('/', (req, res) => res.send('Portfolio Backend API Running!'));

// ==== ROUTE ATTACHMENTS ====
const authRoutes = require('./modules/auth/auth.routes');
const personasRoutes = require('./modules/personas/personas.routes');
const skillsRoutes = require('./modules/skills/skills.routes');
const projectsRoutes = require('./modules/projects/projects.routes');
const timelineRoutes = require('./modules/timeline/timeline.routes');
const contactRoutes = require('./modules/contact/contact.routes');
const chatbotRoutes = require('./modules/chatbot/chatbot.routes');
const chatbotAdminRoutes = require('./modules/chatbot/chatbot.admin.routes');
const recoveryRoutes = require('./modules/recovery/recovery.routes');

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
app.use('/api/ai-chat', chatbotRoutes);
app.use('/api/admin/ai-pricing', chatbotAdminRoutes);
app.use('/api/admin/recovery', recoveryRoutes);

// ---- 404 Handler ----
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

// ---- Global Error Handler ----
const errorMiddleware = require('./middlewares/error.middleware');
app.use(errorMiddleware);

module.exports = app;
