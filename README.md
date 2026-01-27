# Dynamic Personal Portfolio

A modern, full-stack portfolio system built with **React.js** (frontend), **Node.js/Express** (backend), and **PostgreSQL** (database).  
This portfolio is dynamic, allowing real-time updates of skills, roles, achievements, and more—no redeploy required.

---

## 🚀 Features

- **Dynamic Profile:** Instantly update skills, roles, and certifications via admin dashboard.
- **Multi-role Persona:** Switch between fields (developer, cyber analyst, etc.) with persona-based theming/content.
- **Achievements Timeline:** Visually showcase certificates, milestones, and ongoing learning.
- **Seamless Contact:** WhatsApp and Gmail integration for easy client contact.
- **Admin Dashboard:** Private interface for portfolio management (no code changes needed).
- **Mobile-Friendly & Responsive:** Smooth UX everywhere.

---

## 🏗️ Project Structure

See:
- [`FrontendArchitecture.md`](./FrontendArchitecture.md) — *Frontend structure, conventions, decisions*
- [`BackendArchitecture.md`](./BackendArchitecture.md) — *Backend structure, tech stack, API, DB*  

High-level structure:
```
/PORTFOLIO
  |-- BackendArchitecture.md
  |-- FrontendArchitecture.md
  |-- README.md
  /frontend/  (React app)
  /backend/   (Express API)
```

---

## 🔧 Tech Stack

| Layer      | Tech                             |
|------------|----------------------------------|
| Frontend   | React.js (+ CSS modules)         |
| Backend    | Node.js, Express.js              |
| Database   | PostgreSQL                       |
| Styling    | CSS Modules / Custom themes      |
| Auth       | JWT (admin area)                 |
| Other      | REST API, file uploads (S3)      |

---

## 📦 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/okumuraven/portfolio.git
cd portfolio
```

---

### 2. Run with Docker (Recommended for dev/test)

> This will bring up Postgres, backend and frontend—all connected.  
> See `docker-compose.yml` for port mappings and ENV variables.

```bash
docker compose up --build
```

- The backend should run at http://localhost:5000
- The frontend should run at http://localhost:3000

**Environment Variables:**  
- Update `.env` in `/backend` and `/frontend` (copy from `.env.example` if present).

---

### 3. Setup Backend (Manual/local alternative)

```bash
cd backend
npm install
cp .env.example .env   # Edit with your DB/API secrets
npm run migrate        # Run your migrations (locally, or in container)
npm run seed           # Optional: Seed demo data
npm start
```

---

### 4. Setup Frontend

```bash
cd ../frontend
npm install
npm start
```

---

## 📝 Documentation

- **Frontend & Backend structures**: See respective architecture docs:
  - [Frontend Architecture](./FrontendArchitecture.md)
  - [Backend Architecture](./BackendArchitecture.md)
- **API Reference**: Check `/backend/docs/API.md` (if present).
- **Admin Usage**: Browse to `/admin`. Add/update roles, skills, achievements, contact.

---

## 🛠️ Database Migrations

- To create a migration (from `/backend`):
  ```bash
  npm run migrate-create -- [migration_name]
  ```
- To apply migrations (ensure DB in Docker/localhost is running):
  ```bash
  npm run migrate
  ```
  See `BackendArchitecture.md` for full workflow and troubleshooting.

---

## 💡 Customization

- Add new roles, skills, achievements from the admin dashboard.
- Content, themes, and personas are managed live—no redeploy required.

---

## 🤝 Contributing

PRs and suggestions welcome! Please see the contributing guide (if present).

---

**For tech deep-dives, feature requests, or troubleshooting, check the architecture docs or open an issue.**