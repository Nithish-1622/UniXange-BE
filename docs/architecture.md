# UniXchange Backend Architecture

## 1. System Overview

UniXchange is a campus-restricted marketplace backend built with Node.js, Express, and MongoDB (Mongoose) using a modular MVC-inspired structure.

Goals:
- Restrict access to verified college email domains.
- Support buy/sell/rent listings.
- Provide lost and found workflows.
- Enable user-to-user chat.
- Include trust and safety moderation paths.

## 2. High-Level Components

- API Layer (Express Routes)
- Controller Layer (request orchestration)
- Service Layer (OTP generation, fraud heuristics, search helpers)
- Data Layer (Mongoose models)
- Middleware Layer (auth, validation, errors, role checks)

## 3. Request Flow

1. Request enters route.
2. Validation middleware checks payload and query params.
3. Auth middleware validates JWT when required.
4. Controller executes business flow.
5. Services are called for side workflows (OTP, fraud scoring, pagination).
6. Data persisted/fetched via Mongoose models.
7. Standard JSON response returned.
8. Errors are centralized in global error middleware.

## 4. Security Design

- Password hashing with bcrypt.
- JWT access tokens for authenticated APIs.
- Strict email domain allowlist via environment variable.
- Input validation with express-validator.
- HTTP hardening with helmet, hpp, and mongo-sanitize.
- Basic rate limiting on auth and API routes.
- CORS control using allowed origins.

## 5. Scalability Considerations

- Modular folders by concern (models/controllers/routes/services).
- Pagination on list endpoints.
- MongoDB indexes for frequent search/filter fields.
- Stateless auth (JWT), suitable for horizontal scaling.
- Chat endpoints designed for polling now, WebSocket-ready later.

## 6. Future Extensions

- Redis for OTP/session throttle.
- Socket.IO for realtime chat.
- AI service integration for semantic search/fraud/lost-found match.
- Object storage (S3/Azure Blob) for image uploads.
- Queue-based notifications for scale.
