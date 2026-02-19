# Backend Architecture Documentation

## 1. Overview

This document outlines the architectural structure and workflow best practices for the Node.js/Express backend powering the **Dynamic Portfolio System**.

Architecture follows a **Feature-Based Modular Pattern**—domain features are separated for clarity, scalability, and rapid persona expansion ("Chameleon Mode").

---

## 2. Directory Structure

Infrastructure is separated from business logic with future-ready modular design.

```text
backend/
│
├── server.js                   # Entry: Loads app, starts HTTP server
├── app.js                      # Express setup: Middleware, Routing, Error Handling
│
├── config/                     # GLOBAL CONFIG
│   ├── env.js                  # Env loader & validation
│   ├── database.js             # PostgreSQL connection logic
│   ├── cors.js                 # CORS security config
│   └── logger.js               # Logging (Winston/Morgan)
│
├── database/                   # DB MANAGEMENT
│   ├── index.js                # DB Interface
│   ├── migrations/             # SQL/JS migration scripts
│   └── seeds/                  # Default data (e.g., admin user)
│
├── modules/                    # FEATURES (Core Domain Logic)
│   ├── auth/                   # Admin/Login/JWT
│   ├── personas/               # Persona/Mode Switcher
│   ├── skills/                 # Skills endpoint
│   ├── projects/               # Project CRUD, timeline feed
│   ├── activity/               # Log and analytics tracking
│   └── contact/                # Contact form/email logic
│
├── middlewares/                # SHARED MIDDLEWARES
│   ├── auth.middleware.js      # Admin route protection (sometimes moved to modules/auth/)
│   ├── error.middleware.js     # Central error handler
│   ├── rateLimiter.js          # Basic DDOS prevention
│   └── upload.middleware.js    # Multer setup
│
├── services/                   # INFRA SERVICES (Mailer, Cloud storage)
│   ├── mailer.service.js
│   ├── cloudStorage.service.js
│   └── notification.service.js
│
├── utils/                      # HELPERS
│   ├── response.js             # API response formatter
│   ├── pagination.js           # Results paging
│   └── constants.js            # Enums/Magic strings
│
├── errors/                     # CUSTOM ERROR CLASSES
│   ├── NotFoundError.js
│   └── ValidationError.js
│
├── routes.js                   # Central router composition
│
├── migrations/                 # node-pg-migrate scripts
├── storage/                    # Local uploads (images/etc)
├── logs/                       # App logs
├── tests/                      # Unit/Integration
├── docs/                       # API/Dev docs
└── package.json
```

---

## 3. Database Migration Workflow (2026 Best Practices)

### A. Tooling

- [node-pg-migrate](https://github.com/salsita/node-pg-migrate)
- [pg](https://github.com/brianc/node-postgres)

### B. Migration Workflow

**Local Development**
1. Create migration:
   ```sh
   npm run migrate-create -- create-users-table
   ```
2. Edit migration file for schema changes.
3. Apply migration:
   ```sh
   npm run migrate
   ```
4. DB uses `.env` `DATABASE_URL` (see below).

**Sample scripts in `package.json`:**
```json
"scripts": {
  "migrate": "node-pg-migrate up",
  "migrate-create": "node-pg-migrate create -m migrations"
}
```

**.env sample:**
```
DATABASE_URL=postgres://POSTGRES_USER:POSTGRES_PASSWORD@localhost:5432/POSTGRES_DB
```

**When to run migrations:**
- New migration file added/updated (locally or via Git pull).
- Schema changed for a new feature.
- Before running new backend containers.

**Troubleshooting:**
- If `pg` missing: `npm install pg`
- Avoid host/Docker confusion—run locally for node_modules, then migrate Docker.

---

## 4. Docker Backend

- Uses **Node 18+ Dockerfile** (see repo).
- Migrations run before backend boots (manual or CI/CD).
- Avoid overwriting node_modules/volume conflicts.
- Dev: run migrations locally first, then backend in Docker.

---

## 5. Workflow Summary

1. Create/edit migration (`backend/migrations/`).
2. Run `npm run migrate` (or `docker compose exec backend npm run migrate`).
3. Start backend Docker service.
4. For teams: document migration process, automate as needed.

---

## 6. References

- [node-pg-migrate](https://salsita.github.io/node-pg-migrate/)
- [Docker docs](https://docs.docker.com/get-started/)
- [PostgreSQL docs](https://www.postgresql.org/docs/current/)
- [Feature-Sliced Design](https://feature-sliced.design/)

---

_Last updated: 2026-02-19 (fully modular, dockerized, with migration and robust persona mode)_ 