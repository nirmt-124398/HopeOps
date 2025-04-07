# 🤖 Copilot Instructions for NGO Management React Frontend

This document guides GitHub Copilot to build a fully functional frontend for a Node.js-based NGO management platform.

## 🌐 Project Summary

The app is a web-based NGO management platform. It includes:

- User authentication (login, register, logout)
- Role-based authorization (USER, NGO_ADMIN)
- NGO registration and profile management
- Emergency rescue request system for users
- NGO response handling dashboard
- Fully connected backend via REST APIs

---

## 📦 Axios Configuration (`/api/apiRequest.js`)

Create a centralized Axios instance with:

- `baseURL`: `"https://your-backend-url.com/api"`
- `withCredentials: true` to support cookie-based auth

Use this Axios instance in all API calls throughout the frontend.

---

## 🧠 Auth Context (`/context/AuthContext.js`)

Set up a `React Context` that:

- Holds `user`, `setUser`, `isAuthenticated`
- Loads user from `localStorage` on app load
- Stores user in `localStorage` on login
- Provides a `logout()` function that clears everything
- Handles 401 errors globally (optional)

---

## 🔐 Authentication Features

| Feature      | Endpoint                    | Method | Auth Required |
|--------------|-----------------------------|--------|----------------|
| Register     | `/api/auth/register`        | POST   | ❌             |
| Login        | `/api/auth/login`           | POST   | ❌             |
| Logout       | `/api/auth/logout`          | POST   | ✅             |

Show login/register forms. After login, redirect to dashboard and store user in context.

---

## 👤 User Management

| Feature        | Endpoint                    | Method |
|----------------|-----------------------------|--------|
| Get Profile    | `/api/user/me`              | GET    |
| Update Profile | `/api/user/:id`             | PATCH  |

Display and update profile information.

---

## 🏢 NGO Management

| Feature          | Endpoint             | Method |
|------------------|----------------------|--------|
| List NGOs        | `/api/ngo`           | GET    |
| Create NGO       | `/api/ngo`           | POST   |
| My NGO Profile   | `/api/ngo/me`        | GET    |
| Update NGO       | `/api/ngo/:id`       | PATCH  |

Only accessible by users with role `NGO_ADMIN`.

---

## 🚨 Emergency Operations

| Feature                  | Endpoint                   | Method |
|--------------------------|----------------------------|--------|
| Submit Emergency         | `/api/emergency`           | POST   |
| User Emergency History   | `/api/emergency/user`      | GET    |
| NGO Emergency Dashboard  | `/api/emergency/ngo`       | GET    |
| Update Emergency Status  | `/api/emergency/:id`       | PATCH  |

Role-based views: users see their history, NGOs manage all.

---

## ⚙️ Routing and Loaders

Use **React Router v6.15+ with Data Loaders** for:

- `/profile` → loads user profile
- `/ngos` → loads all NGOs
- `/emergencies` → loads user or NGO-specific emergencies

Loaders should go in `/loaders/` directory.

---

## 🛡️ Protected & Role-Based Routes

- Use `PrivateRoute.jsx` or route guards to protect dashboard routes
- Check `user.role` from context for conditional rendering (e.g., `NGO_ADMIN`)

---

## 🧩 Under Development Pages

For any unfinished feature:
- Create an `UnderDevelopment.jsx` component
- Route it as a placeholder for future pages

---

## 📁 Suggested Folder Structure


---

## 📌 UX Flow (Visual)

1. Home Page (public view for non-logged-in users)
2. Register → Login → Dashboard (based on role)
3. NGO_ADMIN → Create NGO → Manage Emergencies
4. USER → Request Emergency → View History
5. Profile can be updated at any time

---

## 🧹 Dev Guidelines

- All data must come from backend APIs (do not hardcode anything)
- Use context for auth and pass `user` to necessary components
- Always use Axios wrapper (`apiRequest.js`) for backend calls
- Implement full CRUD if possible per page
- Add spinners/placeholders while loading data
- Add toasts for success/error actions

---

## ✅ Features to Skip for Now

- WebSocket-based real-time emergency updates (not required)
- Admin-level dashboards beyond NGO-specific needs

---

Let Copilot build based on these instructions to ensure full integration with the backend.

