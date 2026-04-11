<div align="center">

# 📦 Full-Stack Inventory Management System

<p align="center">
  <em>A production-ready, secure, and modern web application for managing product inventory and users — built with FastAPI & Vanilla JS.</em>
</p>

<p align="center">
  <a href="https://www.python.org/downloads/release/python-3110/">
    <img src="https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python 3.11+"/>
  </a>
  <a href="https://fastapi.tiangolo.com/">
    <img src="https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI"/>
  </a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript">
    <img src="https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript ES6+"/>
  </a>
  <a href="https://getbootstrap.com/">
    <img src="https://img.shields.io/badge/Bootstrap-5.x-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white" alt="Bootstrap 5"/>
  </a>
  <a href="https://www.postgresql.org/">
    <img src="https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL"/>
  </a>
  <a href="https://sqlite.org/">
    <img src="https://img.shields.io/badge/SQLite-Local_Dev-003B57?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite"/>
  </a>
  <a href="https://render.com/">
    <img src="https://img.shields.io/badge/Render-Backend-46E3B7?style=for-the-badge&logo=render&logoColor=white" alt="Render"/>
  </a>
  <a href="https://www.netlify.com/">
    <img src="https://img.shields.io/badge/Netlify-Frontend-00C7B7?style=for-the-badge&logo=netlify&logoColor=white" alt="Netlify"/>
  </a>
</p>

<p align="center">
  <a href="https://your-app.netlify.app" target="_blank">
    <img src="https://img.shields.io/badge/🌐 Live Demo-Frontend-success?style=for-the-badge" alt="Live Frontend"/>
  </a>
  <a href="https://inventory-management-system-cjr4.onrender.com" target="_blank">
    <img src="https://img.shields.io/badge/⚙️ Live API-Backend-blue?style=for-the-badge" alt="Live Backend API"/>
  </a>
  <a href="https://inventory-management-system-cjr4.onrender.com/docs" target="_blank">
    <img src="https://img.shields.io/badge/📖 Swagger-API Docs-orange?style=for-the-badge" alt="Swagger Docs"/>
  </a>
  <a href="https://inventory-management-system-cjr4.onrender.com/redoc" target="_blank">
    <img src="https://img.shields.io/badge/📘 ReDoc-API Docs-lightgrey?style=for-the-badge" alt="ReDoc"/>
  </a>
</p>

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Live Demo](#-live-demo)
- [Tech Stack](#-tech-stack)
- [Key Features](#-key-features)
- [Project Structure](#-project-structure)
- [Local Setup](#-local-setup)
- [Environment Configuration](#-environment-configuration)
- [Database Setup](#-database-setup)
- [API Reference](#-api-reference)
- [Deployment Guide](#-deployment-guide)
- [License](#-license)

---

## 🔍 Overview

The **Full-Stack Inventory Management System** is a complete, production-ready web application that provides businesses with a centralized platform to manage their product catalog and team users. It features a secure JWT-based authentication system with role-based access control, a rich admin dashboard, and a clean, responsive UI with dark/light mode support.

The backend is powered by **FastAPI** for high-performance async API serving, **SQLAlchemy** for database ORM, and **Pydantic v2** for strict data validation. The frontend is built with pure **HTML5, CSS3, and Vanilla JavaScript (ES6+)**, using **Bootstrap 5** for responsive design — with no heavy frontend framework required.

---

## 🌐 Live Demo

| Service | URL |
|---|---|
| 🖥️ Frontend (Netlify) | [https://inventorymanagr.netlify.app](https://inventorymanagr.netlify.app/) |
| ⚙️ Backend API (Render) | [https://inventory-management-system-cjr4.onrender.com](https://inventory-management-system-cjr4.onrender.com) |
| 📖 Swagger UI | [https://inventory-management-system-cjr4.onrender.com/docs](https://inventory-management-system-cjr4.onrender.com/docs) |
| 📘 ReDoc | [https://inventory-management-system-cjr4.onrender.com/redoc](https://inventory-management-system-cjr4.onrender.com/redoc) |

> **Note:** The backend is hosted on Render's free tier and may spin down after a period of inactivity. The first request after a cold start may take **30–60 seconds** to respond. Subsequent requests will be fast.

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Language** | Python 3.11+ | Backend runtime |
| **API Framework** | FastAPI | High-performance async REST API |
| **ORM** | SQLAlchemy | Database abstraction and query building |
| **Validation** | Pydantic v2 | Request/response schema validation |
| **Authentication** | python-jose (JWT) | Stateless token generation and verification |
| **Password Hashing** | passlib (Bcrypt) | Secure, salted credential storage |
| **Database (Dev)** | SQLite | Zero-config local development database |
| **Database (Prod)** | Neon PostgreSQL | Scalable serverless production database |
| **Frontend** | HTML5, CSS3, Vanilla JS (ES6+) | Core UI layer — no framework overhead |
| **UI Framework** | Bootstrap 5 | Responsive, mobile-first component library |
| **Backend Hosting** | Render | Cloud compute for the FastAPI service |
| **Frontend Hosting** | Netlify | Static site hosting with global CDN |

---

## ✨ Key Features

- 🔐 **Secure JWT Authentication** — Stateless login and registration using JSON Web Tokens with Bcrypt-hashed passwords and configurable token expiry.
- 👥 **Role-Based Access Control (RBAC)** — Two-tier permission model: `Admin` users can create, update, and delete products and manage all users; the `User` role is restricted to read-only inventory access.
- 🛡️ **User Management Panel** — Dedicated admin dashboard (`admin.html`) to view all registered user profiles, inspect roles, and permanently remove accounts.
- 📦 **Full CRUD Operations** — Complete Create, Read, Update, and Delete for inventory products, plus `PATCH` support for efficient partial field updates.
- 🔎 **Real-time Search & Pagination** — Live client-side product search combined with server-side pagination for performant handling of large inventories.
- ✅ **Strict Dual-Layer Validation** — Pydantic v2 schemas enforce data integrity on the backend; HTML5 constraint attributes provide immediate feedback on the frontend.
- 🎨 **Glassmorphism UI** — Frosted-glass card design with smooth CSS transitions, modal forms, animated loading spinners, and toast notifications for a polished UX.
- 🌙 **Dark / Light Mode Toggle** — Persistent theme preference saved to `localStorage` for a personalized, session-resilient experience.
- 🗂️ **Custom Exception Handling** — Global exception handlers in `exceptions.py` return consistent, structured JSON error responses across all endpoints.
- 📝 **Structured Logging** — Custom logger via `logging_config.py` provides readable, consistent output for debugging and production monitoring.
- 📄 **Auto-generated API Docs** — Interactive Swagger UI (`/docs`) and ReDoc (`/redoc`) always in sync with the codebase — zero manual maintenance.

---

## 🗂 Project Structure

```
inventory-management-system/
│
├── backend/                        # FastAPI application
│   ├── routes/                     # Modular API route handlers
│   │   ├── auth.py                 # /auth      — Login & Register endpoints
│   │   ├── products.py             # /products  — Full CRUD endpoints
│   │   └── users.py                # /users     — User management endpoints
│   │
│   ├── main.py                     # App entry point: FastAPI init, CORS, router registration
│   ├── database.py                 # SQLAlchemy engine, session factory, Base declaration
│   ├── models.py                   # ORM table models (User, Product)
│   ├── schemas.py                  # Pydantic v2 request/response schemas
│   ├── auth_config.py              # JWT creation/verification, Bcrypt hashing, route guards
│   ├── logging_config.py           # Custom structured logger configuration
│   ├── exceptions.py               # Global custom exception handlers
│   └── enums.py                    # Shared enumerations (e.g., UserRole)
│
├── frontend/                       # Static frontend — no build step required
│   ├── index.html                  # Main inventory dashboard (authenticated users)
│   ├── admin.html                  # Admin user management panel (admin-only)
│   ├── login.html                  # Login & Register page
│   ├── about.html                  # About page
│   ├── contact.html                # Contact page
│   ├── script.js                   # Dashboard: inventory CRUD, search, pagination logic
│   ├── admin.js                    # Admin panel: user list & deletion logic
│   ├── auth.js                     # JWT storage, login/register handlers, route guards
│   └── style.css                   # Glassmorphism design, dark/light mode, animations
│
├── requirements.txt                # Python package dependencies
├── netlify.toml                    # Netlify deployment & SPA redirect configuration
├── .env                            # Local environment variables (never commit this file)
└── README.md
```

---

## 🚀 Local Setup

Follow these steps to get the full application running on your local machine.

### Prerequisites

- **Python 3.11+** — [Download here](https://www.python.org/downloads/)
- **pip** and **venv** — bundled with Python 3.11+
- **Git** — [Download here](https://git-scm.com/)

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/GitbyShantanu/Inventory-Management-System.git
cd inventory-management-system
```

### Step 2 — Create and Activate a Virtual Environment

```bash
# Create the virtual environment
python -m venv venv
```

```bash
# macOS / Linux
source venv/bin/activate

# Windows — PowerShell
.\venv\Scripts\Activate.ps1

# Windows — Command Prompt
venv\Scripts\activate.bat
```

Your terminal prompt should now be prefixed with `(venv)`.

### Step 3 — Install Backend Dependencies

```bash
pip install -r requirements.txt
```

### Step 4 — Configure Environment Variables

Create a `.env` file in the project root and populate it with your values. See the full reference in the [Environment Configuration](#-environment-configuration) section below.

```bash
# If an example file is provided:
cp .env.example .env

# Then open .env in your editor and fill in your values
```

### Step 5 — Start the Backend Server

```bash
uvicorn backend.main:app --reload
```

The API will be live at:

| Interface | URL |
|---|---|
| API Root | `http://127.0.0.1:8000` |
| Swagger UI | `http://127.0.0.1:8000/docs` |
| ReDoc | `http://127.0.0.1:8000/redoc` |

### Step 6 — Serve the Frontend

Open `frontend/login.html` directly in your browser, **or** use a local HTTP server to avoid CORS and path-resolution issues:

```bash
# Using Python's built-in HTTP server (recommended)
cd frontend
python -m http.server 5500
```

Then navigate to `http://localhost:5500/login.html` in your browser.

---

## 🔑 Environment Configuration

Create a `.env` file in the **project root** with the following variables:

```ini
# ── Security ──────────────────────────────────────────────────────────────────
# Generate a strong key: python -c "import secrets; print(secrets.token_hex(32))"
SECRET_KEY=your-super-secret-key-replace-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# ── Database ──────────────────────────────────────────────────────────────────
# SQLite for local development (zero setup required)
DATABASE_URL=sqlite:///./inventory.db

# Neon PostgreSQL for production — uncomment and replace:
# DATABASE_URL=postgresql://user:password@ep-xxxx.us-east-2.aws.neon.tech/neondb?sslmode=require

# ── CORS ──────────────────────────────────────────────────────────────────────
# Comma-separated list of allowed frontend origins
ALLOWED_ORIGINS=http://localhost:5500,https://your-app.netlify.app
```

> ⚠️ **Security Notice:** The `.env` file contains sensitive credentials and must **never** be committed to version control. Verify that `.env` is listed in your `.gitignore` before your first `git push`.

---

## 🗄 Database Setup

### Local Development — SQLite

No setup required. On first launch, SQLAlchemy reads `DATABASE_URL` from `.env` and automatically creates an `inventory.db` file in the project root, initializing all tables defined in `backend/models.py` via `Base.metadata.create_all()`.

### Production — Neon PostgreSQL

1. Create a free account at [neon.tech](https://neon.tech).
2. Create a new **Project**, then a **Database** within it.
3. From the Neon dashboard, open **Connection Details** and copy the full connection string.
4. Set it as `DATABASE_URL` in your production environment (Render dashboard → Environment Variables):
   ```
   DATABASE_URL=postgresql://user:password@ep-xxxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
5. On first startup, SQLAlchemy will run `create_all()` and provision the full schema automatically — no manual migrations needed.

---

## 📡 API Reference

All endpoints are relative to the base URL (`http://127.0.0.1:8000` locally, or the Render URL in production). Protected routes require a valid JWT passed as a `Bearer` token in the `Authorization` header.

### 🔐 Authentication — `/auth`

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `POST` | `/auth/register` | ❌ Public | Register a new user account |
| `POST` | `/auth/login` | ❌ Public | Authenticate and receive a JWT access token |

### 📦 Products — `/products`

| Method | Endpoint | Auth Required | Role | Description |
|---|---|---|---|---|
| `GET` | `/products` | ✅ Yes | Any | List all products — supports `?search=` and `?page=` |
| `GET` | `/products/{id}` | ✅ Yes | Any | Retrieve a single product by ID |
| `POST` | `/products` | ✅ Yes | Admin | Create a new inventory product |
| `PUT` | `/products/{id}` | ✅ Yes | Admin | Fully replace an existing product record |
| `PATCH` | `/products/{id}` | ✅ Yes | Admin | Partially update specific fields of a product |
| `DELETE` | `/products/{id}` | ✅ Yes | Admin | Permanently delete a product |

### 👥 Users — `/users`

| Method | Endpoint | Auth Required | Role | Description |
|---|---|---|---|---|
| `GET` | `/users` | ✅ Yes | Admin | Retrieve all registered users |
| `GET` | `/users/me` | ✅ Yes | Any | Get the currently authenticated user's profile |
| `DELETE` | `/users/{id}` | ✅ Yes | Admin | Permanently remove a user account |

> 📖 For full interactive request/response schemas, parameter details, and live API testing, visit the **[Swagger UI](https://inventory-management-system-cjr4.onrender.com/docs)**.

---

## ☁️ Deployment Guide

### Backend → Render (Web Service)

1. Push your repository to GitHub.
2. Log in to [render.com](https://render.com) and click **New → Web Service**.
3. Select **Connect a repository** and authorize access to your GitHub repo.
4. Configure the service with the following settings:

   | Setting | Value |
   |---|---|
   | **Language / Environment** | `Python 3` |
   | **Branch** | `main` |
   | **Root Directory** | *(leave blank)* |
   | **Build Command** | `pip install -r requirements.txt` |
   | **Start Command** | `uvicorn backend.main:app --host 0.0.0.0 --port $PORT` |

5. Under **Environment Variables**, add each key from your `.env`. At minimum, configure:

   | Key | Value |
   |---|---|
   | `SECRET_KEY` | A strong random secret (see `.env` guide above) |
   | `DATABASE_URL` | Your Neon PostgreSQL connection string |
   | `ALLOWED_ORIGINS` | Your Netlify frontend URL |

6. Click **Create Web Service**. Render will build and deploy automatically on every push to `main`.
7. Copy your live service URL (e.g., `https://inventory-management-system-cjr4.onrender.com`) for use in the frontend configuration.

---

### Frontend → Netlify (Static Site)

1. **Before deploying**, update the API base URL constant in `frontend/auth.js` and `frontend/script.js` to your live Render URL:
   ```javascript
   const API_BASE_URL = "https://inventory-management-system-cjr4.onrender.com";
   ```
2. Log in to [netlify.com](https://netlify.com) and click **Add new site → Import an existing project**.
3. Connect to your GitHub repository.
4. Configure the deploy settings:

   | Setting | Value |
   |---|---|
   | **Base directory** | `frontend` |
   | **Build command** | *(leave empty — no build step needed)* |
   | **Publish directory** | `frontend` |

5. Click **Deploy site**. Netlify will publish the static files to its global CDN in seconds.

The `netlify.toml` in the repository root handles SPA-style redirects so all routes resolve correctly without 404 errors:

```toml
# netlify.toml
[[redirects]]
  from   = "/*"
  to     = "/index.html"
  status = 200
```

6. *(Optional)* Configure a custom domain under **Site configuration → Domain management**.

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for full details.

---

<div align="center">

**Built with ❤️ using FastAPI & Vanilla JS**

*If this project was useful or interesting to you, please consider giving it a ⭐ on GitHub — it helps a lot!*

</div>