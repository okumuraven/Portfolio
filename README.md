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

| Layer      | Tech                           |
|------------|-------------------------------|
| Frontend   | React.js (+ CSS modules)      |
| Backend    | Node.js, Express.js           |
| Database   | PostgreSQL                    |
| Styling    | CSS Modules / Custom themes   |
| Auth       | JWT (admin area)              |
| Other      | REST API, file uploads (S3)   |

---

## 📦 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/okumuraven/portfolio.git
cd portfolio
```

### 2. Setup Backend

```bash
cd backend
npm install
cp .env.example .env   # Edit with your DB/API secrets
npm run migrate        # Run your migrations
npm run seed           # Optional: Seed demo data
npm start
```

### 3. Setup Frontend

```bash
cd ../frontend
npm install
npm start
```

---

## 📝 Documentation

- **Frontend & Backend structures**: See respective architecture docs.
- **API Reference**: Check `/backend/docs/API.md` (if present).
- **Admin Usage**: Log into `/admin`. Add/update roles, skills, achievements, contact.

---

## 💡 Customization

- Easily add new roles, skills, achievements via the admin dashboard.
- Theme, persona, and site content are all dynamically managed.

---

## 🤝 Contributing

PRs and suggestions welcome! Please see the contributing guide (if present).

---

---

**For deeper dive into the tech stack or for feature requests, check the architecture docs or open an issue.**