# HopeOps

HopeOps is a full-stack platform for animal welfare NGOs. It handles donations through Razorpay, lets people report animals in distress, and manages animal adoption listings end to end. NGOs get their own dashboard to respond to rescue reports, track donations, and manage their animals.

**Live demo:** https://hopeops-frontend.onrender.com/

## Features

- **Donations** - Razorpay checkout with server-side signature verification, payment retry, guest and logged-in donations, donation history for users, and a donation dashboard for NGO admins.
- **Rescue reporting** - Users file animal emergency reports with location and description. NGO admins see pending reports, respond to them, and update response status. A rescue operations view splits reports into available, ongoing, and completed.
- **Adoption** - NGOs list animals (species, age, photos, status), users browse and submit adoption requests, and NGO admins approve or reject them.
- **NGO management** - NGO registration with a verification status flow, an NGO dashboard, and subscription plans billed through Razorpay.
- **Auth and roles** - JWT sessions (cookie or Bearer token), bcrypt password hashing, and role-based access control with USER, NGO_ADMIN, and SUPER_ADMIN roles.
- **Chatbot** - A Botpress webchat widget embedded in the frontend.

## Tech stack

**Frontend** (`NGO Frontend-main/`)
- React 18, Vite 6, Tailwind CSS 3
- React Router 6, axios (shared instance with credentials and Bearer token)
- React Hook Form + Yup, Framer Motion, React GTM Module, Botpress Webchat

**Backend** (`NGO_backend-main/`)
- Node.js (ESM), Express 4
- Prisma 6 with MongoDB
- JWT (jsonwebtoken) + bcrypt, cookie-parser, CORS with credentials
- Razorpay SDK for orders, subscriptions, and webhook signature checks
- Helmet, express-rate-limit (200 requests per 15 minutes per IP), input sanitization, Joi/Zod request validation

## Architecture

```
HopeOps/
├── NGO Frontend-main/          # React SPA
│   └── src/
│       ├── components/         # UI, layout, animals, admin, chatbot
│       ├── pages/              # Home, Donation, PaymentForm, AdoptionForm,
│       │                       # IncidentReporting, Profile, AdminDashboard,
│       │                       # ngoAdmin/ (Dashboard, RescueOperations...)
│       ├── context/            # AuthContext, AnimalsContext
│       ├── routes/             # ProtectedRoute
│       ├── loaders/            # Route data loaders for rescue views
│       └── utils/              # axios instance (apifile.js), GTM
│
└── NGO_backend-main/           # Express API
    ├── index.js                # App entry: middleware stack + router mounting
    ├── routes/                 # 10 mounted routers
    ├── controllers/            # Route handlers
    ├── middleware/             # auth (verifyToken, requireRole), security,
    │                           # validation, payment webhook verify, errors
    ├── lib/prismaclient.js     # Shared Prisma client
    └── prisma/                 # schema.prisma + seed scripts
```

The frontend talks to the backend through one axios instance pointed at `{VITE_Backend_URL}/api`, sending cookies and (when present) a Bearer token from localStorage. The backend is a single Express app: security middleware first (Helmet, CORS, rate limit, sanitization), then JSON/cookie parsing, then the routers, then a central error handler.

The Prisma schema models users, NGOs and their admins, subscription plans and subscriptions, donations, emergencies and NGO responses, animals, adoption requests, rescues, and webhook events.

## API overview

48 route declarations across 10 routers, all mounted under `/api`:

**`/api/auth`** - register, login, logout
- `POST /register`, `POST /login`, `POST /logout`

**`/api/user`** and **`/api/users`** - profile management
- `GET /profile`, `PUT /profile`, `DELETE /profile`
- `PUT /role` (`/api/users` only)

**`/api/ngos`** - NGO records and dashboards
- `GET /`, `POST /`, `PUT /:id`
- `GET /dashboard`, `GET /dashboard/:id` (NGO_ADMIN)

**`/api/animals`** - adoption listings
- `GET /`, `GET /:id` (public)
- `GET /ngo/animals`, `POST /`, `PUT /:id`, `DELETE /:id` (NGO_ADMIN)

**`/api/adoptions`** - adoption requests
- `POST /request`, `GET /user-requests`
- `GET /ngo-requests`, `PUT /request/:id` (NGO_ADMIN)

**`/api/emergencies`** - rescue reports
- `GET /`, `POST /`, `GET /:EmergencyId`
- `GET /pending`, `POST /:EmergencyId/respond`, `PATCH /:emergencyId/response/:responseId` (NGO_ADMIN)

**`/api/donations`** - Razorpay donations
- `POST /order`, `POST /verify` (public payment verification), `POST /retry/:donationId`
- `GET /user` (own donations)
- `GET /admin`, `POST /cleanup` (NGO_ADMIN)

**`/api/subscriptions`** - NGO subscription plans via Razorpay
- `GET /plans`, `POST /create`, `POST /verify`, `GET /getSubscriptiondetailById/:subscriptionId`

**`/api/test`** - auth and role-check probe endpoints
- `GET /public`, `GET /should-be-logged-in`, `GET /should-be-user`, `GET /should-be-ngo-admin`, `GET /should-be-super-admin`, `GET /should-be-any-admin`
- `POST /create-ngo-admin` (SUPER_ADMIN)

## Getting started

You need Node.js and a MongoDB connection string (MongoDB Atlas works; Prisma's MongoDB connector requires a replica set, which Atlas provides by default).

### Backend

```bash
cd NGO_backend-main
npm install
```

Create a `.env` file:

```
PORT=3000
CLIENT_URL=http://localhost:5173
DATABASE_URL=<your MongoDB connection string>
JWT_SECRET=<a long random string>
RAZORPAY_KEY_ID=<your Razorpay key id>
RAZORPAY_KEY_SECRET=<your Razorpay key secret>
RAZORPAY_WEBHOOK_SECRET=<your Razorpay webhook secret>
NODE_ENV=development
```

Then:

```bash
npx prisma generate
npm run dev        # nodemon on http://localhost:3000
```

Optional scripts: `npm run seed` and `npm run seed-ngo-admin` seed the database. The scripts under `scripts/` (used for NGO admin testing) additionally read `API_URL`, `SUPER_ADMIN_EMAIL`, `SUPER_ADMIN_PASSWORD`, and `TEST_USER_ID`.

### Frontend

```bash
cd "NGO Frontend-main"
npm install
```

Create a `.env` file:

```
VITE_Backend_URL=http://localhost:3000
VITE_RAZORPAY_KEY_ID=<your Razorpay key id>
VITE_GTM_CONTAINER_ID=<optional, Google Tag Manager container>
```

Then:

```bash
npm run dev        # Vite dev server
npm run build      # production build
```

## Roadmap

- Image uploads for animals and NGO logos moving to a CDN (the schema already stores CDN URLs)
- Email receipts for donations and status updates for adoption requests
- Automated tests and CI
- Docker setup for one-command local development
