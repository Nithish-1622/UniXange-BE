# UniXchange Backend

Production-oriented backend for UniXchange campus marketplace.

## Stack
- Node.js + Express.js
- MongoDB + Mongoose
- JWT auth
- MVC-like modular architecture

## Features Implemented
- College-email-only authentication with OTP verification
- User profile and dashboard
- Marketplace listings (buy/sell/rent) with filters and search
- Rent booking workflow
- Polling-based chat system
- Lost and Found reporting and matching
- Report abuse endpoints + admin moderation
- Wishlist and notifications (bonus)

## Folder Structure

```text
backend/
  src/
    config/
    controllers/
    middlewares/
    models/
    routes/
    services/
    utils/
    validators/
    scripts/
  docs/
  .env.example
```

## Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Copy env:
```bash
cp .env.example .env
```

3. Update .env values.

4. Run server:
```bash
npm run dev
```

API base URL: `http://localhost:5000/api/v1`

## Admin Seed

Set these env vars and run:

```bash
ADMIN_EMAIL=admin@college.edu ADMIN_PASSWORD=StrongPass123 ADMIN_NAME="Campus Admin" npm run seed-admin
```

On Windows PowerShell:

```powershell
$env:ADMIN_EMAIL="admin@college.edu"
$env:ADMIN_PASSWORD="StrongPass123"
$env:ADMIN_NAME="Campus Admin"
npm run seed-admin
```

## Security Controls
- Password hash with bcrypt
- JWT auth middleware
- Domain allowlist checks
- Input validation (express-validator)
- Helmet, rate limit, hpp, mongo sanitize, CORS

## Key API Groups
- `/auth`
- `/users`
- `/listings`
- `/bookings`
- `/chats`
- `/lost-found`
- `/reports`
- `/admin`
- `/notifications`

See detailed API design in `docs/api-spec.md`.
See architecture notes in `docs/architecture.md`.
See API testing checklist in `docs/postman-checklist.md`.
