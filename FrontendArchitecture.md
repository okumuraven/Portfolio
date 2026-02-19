# Frontend Architecture & File Structure

## 1. Overview

This document defines the architectural structure of the React frontend for the **Dynamic Portfolio System**.

The design supports two main systems within a single codebase:
- **Public Portfolio:** High-performance, visually expressive presentation layer, adapting to active Persona (e.g., Software Developer, Cyber Analyst).
- **Admin Dashboard:** Restricted CMS panel for managing projects, personas, skills, and content.

---

## 2. Directory Structure

The codebase follows a **Feature-Sliced Design** pattern to achieve optimal separation between global configuration, domain logic, and UI layers.

```text
frontend/
│
├── public/                     # Static assets (favicon, manifest, robots.txt)
│
├── src/
│   ├── app/                    # App Wiring: Root, Routing, and Providers
│   │   ├── App.jsx
│   │   ├── routes.jsx
│   │   └── providers.jsx
│   │
│   ├── api/                    # Backend API Layer (e.g. axios config, endpoint modules)
│   │   ├── http.js
│   │   ├── personas.api.js
│   │   ├── skills.api.js
│   │   ├── achievements.api.js
│   │   └── activity.api.js
│   │
│   ├── layouts/                # Page Shells (separated for public/admin)
│   │   ├── public/
│   │   └── admin/
│   │
│   ├── pages/                  # Route Targets/Views
│   │   ├── public/
│   │   │   ├── Home/
│   │   │   ├── Projects/
│   │   │   ├── Timeline/
│   │   │   └── Contact/
│   │   └── admin/
│   │       ├── Dashboard/
│   │       ├── Personas.jsx
│   │       └── Skill/
│   │
│   ├── features/               # Business Logic Modules (state & transformations)
│   │   ├── personas/
│   │   ├── skills/
│   │   └── achievements/
│   │
│   ├── components/             # Reusable UI Components
│   │   ├── ui/                 # Atomic UI (Button, Card, Badge)
│   │   ├── timeline/           # Timeline/Feed blocks
│   │   ├── forms/              # Inputs, Validation, Forms
│   │   └── feedback/           # Modals, Toasts, Spinners
│   │
│   ├── hooks/                  # Custom Global Hooks
│   │   ├── useAuth.js
│   │   ├── useTheme.js
│   │   └── useActiveRole.js
│   │
│   ├── styles/                 # Styling System
│   │   ├── base/
│   │   ├── themes/
│   │   │   ├── developer.css
│   │   │   ├── cyber.css
│   │   │   └── ai.css
│   │   └── globals.css
│   │
│   ├── utils/                  # Helpers (date, constants, role management)
│   │
│   ├── error/                  # Error Handling (ErrorBoundary, logger)
│   │
│   └── assets/                 # Local asset files (icons, certificates)
│
├── docs/                       # Project Documentation
│   ├── ARCHITECTURE.md
│   └── FOLDER_GUIDE.md
│
└── package.json
```

---

## 3. Key Patterns & Principles

- **Feature-Sliced Design:** Highly scalable and maintainable—each domain/theme is isolated for speed and clarity.
- **API Layer:** Abstracts backend endpoint handling, centralizes network config, enables flexible API changes.
- **App Providers:** Theme, auth, and React Query contexts are set at root for global access.
- **Layouts:** Clean separation between public portfolio UX and secure admin dashboard.
- **Theme System:** Persona-driven theming—dedicated visual styles for each mode.
- **Global Hooks:** Unified utilities for authentication, theming, persona switching.
- **Error Handling:** Runtime errors are contained and logged for both public and admin sides.

---

## 4. Usage Notes

- Public pages (`pages/public/`) **never import admin/CMS logic or assets**.
- Admin logic/UI is **protected** by route guards and role-aware hooks.
- Business logic modules in `features/` handle their own state and API sync.
- Error boundaries and error logging maximize resilience.

---

## 5. Useful References

- [Feature-Sliced Design](https://feature-sliced.design/)
- [React Project Structure Best Practices](https://react.dev/learn/project-structure)
- [Atomic Design Pattern](https://bradfrost.com/blog/post/atomic-web-design/)

---

_Last updated: 2026-02-19 (includes full persona/theme system, admin CMS separation, and production-grade FSD)_ 