# Frontend Architecture & File Structure

## 1. Overview
This document outlines the architectural structure of the React frontend for the **Dynamic Portfolio System**.

The architecture is designed to support two distinct systems within a single codebase:
1.  **Public Portfolio:** A high-performance, visually dynamic presentation layer that transforms based on the active "Persona" (e.g., Software Developer vs. Cyber Analyst).
2.  **Admin Dashboard:** A restricted, functional Content Management System (CMS) for managing the content and current mode.

---

## 2. Directory Structure

The codebase follows a **Feature-Sliced Design** pattern, cleanly separating global configuration from domain-specific business logic and interface layers.

```text
frontend/
│
├── public/                     # Static assets (Favicon, manifest.json, robots.txt)
│
├── src/                        # Main Application Code
│   │
│   ├── app/                    # APP WIRING
│   │   ├── App.jsx             # Application root
│   │   ├── routes.jsx          # Central Route Definitions (Public vs Protected)
│   │   └── providers.jsx       # Context Wrappers (Theme, Auth, React Query)
│   │
│   ├── api/                    # API LAYER (Backend Communication)
│   │   ├── http.js             # Base Axios instance (Interceptors, Auth headers)
│   │   ├── roles.api.js        # Persona management endpoints
│   │   ├── skills.api.js       # Skill tree endpoints
│   │   ├── achievements.api.js # Timeline feed endpoints
│   │   └── activity.api.js     # Analytics/Status endpoints
│   │
│   ├── layouts/                # PAGE SHELLS
│   │   ├── public/             # Public Layout (Navbar, Footer, SEO Wrapper)
│   │   └── admin/              # Admin Layout (Sidebar, Topbar, Auth Guard)
│   │
│   ├── pages/                  # ROUTE TARGETS (Views)
│   │   ├── public/             # Client-Facing Pages
│   │   │   ├── Home/           # The Dynamic Landing Page
│   │   │   ├── Projects/       # Case Studies
│   │   │   ├── Timeline/       # The "Evolution Graph"
│   │   │   └── Contact/        # Conversion Page
│   │   └── admin/              # Restricted Pages (CMS)
│   │       ├── Dashboard/      # Stats & Quick Actions
│   │       ├── Roles/          # "Persona" Editor
│   │       └── Achievements/   # "Post a Milestone" Interface
│   │
│   ├── features/               # BUSINESS LOGIC (State & Transformations)
│   │   ├── roles/              # Logic for switching Personas (useRoles.js)
│   │   ├── skills/             # Logic for Skill visualization
│   │   └── achievements/       # Logic for filtering timeline feeds
│   │
│   ├── components/             # REUSABLE UI BLOCKS
│   │   ├── ui/                 # Atomic Components (Button, Card, Badge)
│   │   ├── timeline/           # Specialized Timeline/Feed components
│   │   ├── forms/              # Reusable Form Logic (Inputs, Validation)
│   │   └── feedback/           # Modals, Toasts, Spinners
│   │
│   ├── hooks/                  # GLOBAL HOOKS
│   │   ├── useAuth.js          # Authentication logic
│   │   ├── useTheme.js         # The Engine behind the "Persona Switch"
│   │   └── useActiveRole.js    # Fetches current active persona
│   │
│   ├── styles/                 # GLOBAL STYLING SYSTEM
│   │   ├── base/               # Resets & Typography
│   │   ├── themes/             # THEME DEFINITIONS
│   │   │   ├── developer.css   # Blue/Clean theme
│   │   │   ├── cyber.css       # Green/Terminal theme
│   │   │   └── ai.css          # Purple/Futuristic theme
│   │   └── globals.css         # Utility classes
│   │
│   ├── utils/                  # HELPERS
│   │   ├── date.js             # Date formatting
│   │   ├── permissions.js      # Role-based access control
│   │   └── constants.js        # Config constants
│   │
│   ├── error/                  # ERROR HANDLING
│   │   ├── ErrorBoundary.jsx   # React Error Boundary
│   │   └── logger.js           # Error reporting
│   │
│   └── assets/                 # LOCAL ASSETS
│       ├── icons/
│       └── certificates/
│
├── docs/                       # PROJECT DOCUMENTATION
│   ├── ARCHITECTURE.md
│   └── FOLDER_GUIDE.md
│
└── package.json
```

---

## 3. Key Patterns & Principles

- **Feature-Sliced Design:** Keeps codebase scalable, testable, and easy to extend as persona/mode system adds complexity.
- **API Layer:** Abstracted calls to backend, supporting flexible endpoint config and future API platform changes.
- **App Providers:** Global context—theme, authentication, API, etc.—wired up once for use throughout the app.
- **Layouts:** Separate shells for the public portfolio and admin dashboard to enable distinct branding and security.
- **Theme System:** Easily swap personas and themes; dedicated themes for each role.
- **Global Hooks:** Simple utilities for authentication, theming, and role management.

---

## 4. Usage Notes

- **Public Pages** (`pages/public/`) never import admin or CMS logic/assets.
- **Admin Logic** and CMS UI are protected by authenticated routes and security-aware hooks.
- **Feature Modules** (in `features/`) manage their own state and API sync as much as possible.
- **Error boundaries** and error logger patterns ensure runtime resilience for both public and admin sides.

---

## 5. Useful References

- [Feature-Sliced Design](https://feature-sliced.design/)
- [React Project Structure Best Practices (2026)](https://react.dev/learn/project-structure)
- [Atomic Design Pattern](https://bradfrost.com/blog/post/atomic-web-design/)

---

_Last updated: 2026-01-26 (includes full support for Chameleon Mode, admin CMS separation, and persona-driven themes)_