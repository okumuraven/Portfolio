# Dynamic Personal Portfolio

A modern, full-stack, modular portfolio platform built with **React.js** (frontend), **Node.js/Express** (backend), and **PostgreSQL** (database).

Easily showcase your projects, skills, achievements, and update your persona or content live—**no redeploy required**.

---

## 🚀 Features

- **Persona Switching:** Instantly transform between focus areas (developer, cyber analyst, etc.) with adaptive branding and content.
- **Dynamic Profile:** Update skills, roles, certifications, and highlights via a secure admin dashboard.
- **Achievements Timeline:** Display certificates, milestones, and learning journey.
- **Powerful Admin Dashboard:** End-to-end content management (roles, projects, personas, skills, and more).
- **Contact Integration:** WhatsApp, Gmail linking for seamless outreach.
- **Mobile-First & Responsive:** Optimized UX everywhere.
- **File Uploads and Image Management:** Upload project images and instantly update live visuals.

---

## 🏗️ Project Structure

See architecture details:
- [`FrontendArchitecture.md`](./FrontendArchitecture.md): *Frontend (React) structure, patterns, and conventions*
- [`BackendArchitecture.md`](./BackendArchitecture.md): *Backend (Express & Postgres) structure, migrations, API*
- [`docker-compose.yml`](./docker-compose.yml): *Dev/test orchestration*

Overall:
```
/PORTFOLIO
  |-- BackendArchitecture.md
  |-- FrontendArchitecture.md
  |-- README.md
  /frontend/   (React app)
  /backend/    (Express API)
  /docs/
```

---

## 🔧 Tech Stack

| Layer    | Tech                                    |
|----------|-----------------------------------------|
| Frontend | React, CSS Modules, Recharts, React Query |
| Backend  | Node.js, Express.js, JWT, Helmet, Joi   |
| DB       | PostgreSQL, node-pg-migrate, pg-promise |
| Auth     | JWT (admin area), bcrypt                |
| Deploy   | Docker Compose (recommended for dev)    |
| Extras   | Multer (uploads), custom theme system   |

---

## 📦 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/okumuraven/portfolio.git
cd portfolio
```

---

### 2. Run with Docker (Recommended)

**Spin up frontend, backend, and Postgres in one step:**

```bash
docker compose up --build
```

- Backend: [http://localhost:5000](http://localhost:5000)
- Frontend: [http://localhost:3000](http://localhost:3000)

**Config:**  
- Edit the `.env` files in `/backend` and `/frontend` (sample with `.env.example`).

---

### 3. Backend Manual Setup (Alternative to Docker)

```bash
cd backend
npm install
cp .env.example .env   # Set POSTGRES/PORT config
npm run migrate        # Run db migrations
npm run seed           # Seed initial data (admin/demo user)
npm start
```

---

### 4. Frontend Setup

```bash
cd ../frontend
npm install
npm start
```

---

## 📝 Documentation & Guides

- [Frontend Architecture](./FrontendArchitecture.md)
- [Backend Architecture](./BackendArchitecture.md)
- API docs (see `/backend/docs/API.md` if present)
- Admin panel: visit `/admin` route for content/portfolio management

---

## 🛠️ Database Migrations

- **Create:**  
  ```bash
  npm run migrate-create -- [migration_name]
  ```
- **Apply:**  
  ```bash
  npm run migrate
  ```
- Details: see [`BackendArchitecture.md`](./BackendArchitecture.md)

---

## 💡 Customization & Extensions

- Add/edit personas, skills, highlights, projects—live, with no code push.
- Adjust themes and branding via admin or (soon) theme config files.
- Expand API/features by adding new modules in backend/frontend.

---

## 🤝 Contributing

Contributions welcome! Please open an issue or PR to suggest improvements, add features, or report bugs.  
For code guidelines or feature requests, see architecture docs.

---

## 🧑‍💻 Authors & Contact

- Main Dev: [Your Name/Handle]
- [Your Contact/Email/LinkedIn]

---

## 🏷️ License

[MIT](./LICENSE) (or update as needed for your project)

---

**For deep-dives, support, or troubleshooting, check the architecture docs or open a repo issue.**