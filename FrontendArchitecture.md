# Frontend Architecture & File Structure

## 1. Overview
This document outlines the architectural structure of the React frontend for the **Dynamic Portfolio System**.

The architecture is designed to support two distinct systems within a single codebase:
1.  **Public Portfolio:** A high-performance, visually dynamic presentation layer that transforms based on the active "Persona" (e.g., Software Developer vs. Cyber Analyst).
2.  **Admin Dashboard:** A restricted, functional Content Management System (CMS) for managing the content and current mode.

---

## 2. Directory Structure
The codebase follows a **Feature-Sliced Design** pattern, separating global configuration from domain-specific business logic.

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
│   │   └── admin/              # Restricted Pages
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