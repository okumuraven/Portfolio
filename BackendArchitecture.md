# Backend Architecture Documentation

## 1. Overview
This document outlines the architectural structure and **workflow best practices** for the Node.js/Express backend powering the **Dynamic Portfolio System**.

The architecture follows a **Feature-Based Modular Pattern**. Unlike standard MVC frameworks that group files by type (e.g., all controllers together), this system groups files by **Domain Feature** (e.g., `auth`, `skills`, `achievements`).

This modular design supports "Chameleon Mode," allowing the user to switch professional personas (e.g., Software Developer ↔ Cyber Analyst) without code refactoring.

---

## 2. Directory Structure
Infrastructure is separated from business logic, supporting scalability and clarity.

```text
backend/
│
├── src/
│   ├── server.js               # Entry: Loads app, starts HTTP server
│   ├── app.js                  # Express setup: Middlewares, Routes, Error Handling
│   │
│   ├── config/                 # GLOBAL CONFIG
│   │   ├── env.js              # Env variable loader & validation
│   │   ├── database.js         # PostgreSQL connection logic
│   │   ├── cors.js             # Security: CORS settings
│   │   └── logger.js           # Winston/Morgan logger config
│   │
│   ├── database/               # DB MANAGEMENT
│   │   ├── index.js            # DB Interface (Pool/Client)
│   │   ├── migrations/         # SQL/JS migration scripts
│   │   └── seeds/              # Initial data (e.g., Default Persona)
│   │
│   ├── modules/                # FEATURES (Core Logic)
│   │   ├── auth/               # Admin Login & JWT
│   │   ├── roles/              # Persona Management ("Mode Switcher")
│   │   ├── skills/             # Skills
│   │   ├── achievements/       # Dynamic Feed (Certs, Projects, Jobs)
│   │   ├── activity/           # Update tracking/logs
│   │   └── contact/            # Contact Form logic
│   │
│   ├── middlewares/            # SHARED MIDDLEWARES
│   │   ├── auth.middleware.js  # Admin route protection
│   │   ├── error.middleware.js # Error handler
│   │   ├── rateLimiter.js      # DDOS protection
│   │   └── upload.middleware.js# Multer config for uploads
│   │
│   ├── services/               # INFRA SERVICES
│   │   ├── mailer.service.js   # Email sending
│   │   ├── cloudStorage.service.js # S3/Cloudinary
│   │   └── notification.service.js # Admin alerts
│   │
│   ├── utils/                  # HELPERS
│   │   ├── response.js         # Standard API formatter
│   │   ├── pagination.js       # Paged results helper
│   │   └── constants.js        # Enums & Magic Strings
│   │
│   ├── errors/                 # CUSTOM ERRORS
│   │   ├── NotFoundError.js
│   │   └── ValidationError.js
│   │
│   └── routes.js               # Main Router
│
├── migrations/                 # Node-pg-migrate migration scripts (see workflow below)
├── storage/                    # Local temp uploads
├── logs/                       # App logs
├── tests/                      # Unit/Integration tests
├── docs/                       # Dev/API docs
└── package.json
```

---

## 3. Database Migrations: **Best Practices & Proven Workflow (2026)**

### **A. Migration Tool**
- Uses [node-pg-migrate](https://github.com/salsita/node-pg-migrate) and `pg` package.
- Migration scripts are stored in `backend/migrations`.

### **B. Migration Workflow**

#### **Local Development**

1. **Create a migration** (from backend directory):
   ```sh
   npm run migrate-create -- create-users-table
   ```
   - This generates a new file in `backend/migrations`.

2. **Edit migration file**: Add SQL/JS steps for schema changes.

3. **Apply migration** (run against your Dockerized PostgreSQL database):
   ```sh
   npm run migrate
   ```
   - Applies new/pending migrations to the running database (uses `DATABASE_URL`).

#### **Config requirements**
- Ensure `pg` and `node-pg-migrate` are listed in `package.json`:
    ```json
    "dependencies": {
      "pg": "...",
      "node-pg-migrate": "...",
      ...
    }
    ```
- In `package.json` scripts:
    ```json
    "scripts": {
      "migrate": "node-pg-migrate up",
      "migrate-create": "node-pg-migrate create -m migrations"
    }
    ```
- `DATABASE_URL` in `.env` should match Docker/Postgres settings (examples below).

#### **Example .env (local development)**
```
DATABASE_URL=postgres://POSTGRES_USER:POSTGRES_PASSWORD@localhost:5432/POSTGRES_DB
```
(_Adjust for your `docker-compose.yml`, database name, password, and user._)

### **C. When To Run Migrations**
- Whenever a migration file is added, edited, or pulled from git.
- Whenever schema changes are made.
- Run before booting backend for new features.

### **D. Troubleshooting**
- If `pg` not found, install with `npm install --save pg` in backend.
- Avoid host/Docker node_modules confusion by running migrations locally first, then migrate Docker workflows if needed.

### **E. Future-Proofing**
- For production/CI/CD: Add migration run to your container entrypoint, or a dedicated migration service in `docker-compose.yml`.
    ```yaml
    migrate:
      build: ./backend
      command: npm run migrate
      environment:
        - DATABASE_URL=...
      depends_on:
        - db
    ```

---

## 4. Docker Backend Notes

- Backend is contained with a clean **Dockerfile** using Node 18+.
- Avoid volume mount overwriting node_modules during migration runs.
- For code/debug/test: use local workflow for migration, Dockerized backend for live dev.

---

## 5. Summary & Workflow

**To update the database schema:**
1. Create/edit migration in `backend/migrations`.
2. Run `npm run migrate` from backend folder.
3. Start backend service in Docker; app uses migrated schema.
4. For team/CI: document migration process, consider automating in future release.

---

## 6. References
- [node-pg-migrate](https://salsita.github.io/node-pg-migrate/)
- [Docker docs](https://docs.docker.com/get-started/)
- [PostgreSQL docs](https://www.postgresql.org/docs/current/)

---

_Last updated: 2026-01-26 (includes migration workflow, solved Docker/node_modules issues, future CI/CD notes)_