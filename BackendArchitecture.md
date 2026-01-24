# Backend Architecture Documentation

## 1. Overview
This document outlines the architectural structure of the Node.js/Express backend for the **Dynamic Portfolio System**.

The architecture follows a **Feature-Based Modular Pattern**. Unlike standard MVC frameworks that group files by type (e.g., all controllers together), this system groups files by **Domain Feature** (e.g., `auth`, `skills`, `achievements`).

This structure is critical for supporting the project's unique "Chameleon Mode," allowing the user to switch professional personas (e.g., Software Developer ↔ Cyber Analyst) without code refactoring.

---

## 2. Directory Structure
The codebase is organized to separate infrastructure from business logic.

```text
backend/
│
├── src/
│   ├── server.js               # Entry point: Loads app, starts HTTP server
│   ├── app.js                  # Express setup: Middlewares, Routes, Error Handling
│   │
│   ├── config/                 # GLOBAL CONFIGURATION
│   │   ├── env.js              # Environment variable loader & validation
│   │   ├── database.js         # PostgreSQL connection logic
│   │   ├── cors.js             # Security: CORS settings
│   │   └── logger.js           # Winston/Morgan logger config
│   │
│   ├── database/               # DATABASE MANAGEMENT
│   │   ├── index.js            # DB Interface (Pool/Client)
│   │   ├── migrations/         # SQL scripts for schema changes
│   │   └── seeds/              # Initial data (e.g., Default Persona)
│   │
│   ├── modules/                # DOMAIN FEATURES (The Core Logic)
│   │   ├── auth/               # Admin Login & JWT Management
│   │   ├── roles/              # Persona Management (The "Mode Switcher")
│   │   ├── skills/             # Skill Tree management
│   │   ├── achievements/       # Dynamic Feed (Certs, Projects, Jobs)
│   │   ├── activity/           # Tracking updates/logs
│   │   └── contact/            # Public Contact Form logic
│   │
│   ├── middlewares/            # SHARED MIDDLEWARE
│   │   ├── auth.middleware.js  # Protects Admin routes
│   │   ├── error.middleware.js # Centralized Error Handling
│   │   ├── rateLimiter.js      # DDOS protection
│   │   └── upload.middleware.js# Multer config for file uploads
│   │
│   ├── services/               # INFRASTRUCTURE SERVICES
│   │   ├── mailer.service.js   # Email sending logic
│   │   ├── cloudStorage.service.js # S3/Cloudinary integration
│   │   └── notification.service.js # Admin alerts (Telegram/Slack)
│   │
│   ├── utils/                  # HELPERS
│   │   ├── response.js         # Standardized API Response formatter
│   │   ├── pagination.js       # Helper for paged results
│   │   └── constants.js        # Global Enums & Magic Strings
│   │
│   ├── errors/                 # CUSTOM ERROR CLASSES
│   │   ├── NotFoundError.js
│   │   └── ValidationError.js
│   │
│   └── routes.js               # Main Router (Aggregates module routes)
│
├── storage/                    # Local temporary storage for uploads
├── logs/                       # Application logs
├── tests/                      # Unit & Integration tests
├── docs/                       # API & Dev Documentation
└── package.json