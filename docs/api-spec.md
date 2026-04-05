# UniXchange Backend API Specification (v1)

Base URL: /api/v1

## Auth
- POST /auth/signup
- POST /auth/verify-otp
- POST /auth/resend-otp
- POST /auth/login
- POST /auth/logout
- GET /auth/me

## Users
- GET /users/me
- PATCH /users/me
- PATCH /users/me/avatar
- GET /users/me/dashboard
- GET /users/:id/public

## Listings
- POST /listings
- GET /listings
- GET /listings/:id
- PATCH /listings/:id
- DELETE /listings/:id
- POST /listings/:id/wishlist
- DELETE /listings/:id/wishlist

## Rent/Bookings
- POST /bookings
- GET /bookings/me
- PATCH /bookings/:id/status

## Chat (Polling)
- POST /chats/conversations
- GET /chats/conversations
- GET /chats/conversations/:id/messages
- POST /chats/conversations/:id/messages

## Lost & Found
- POST /lost-found
- GET /lost-found
- GET /lost-found/:id
- PATCH /lost-found/:id
- POST /lost-found/:id/match

## Reports & Moderation
- POST /reports
- GET /admin/reports
- PATCH /admin/reports/:id/status
- PATCH /admin/listings/:id/moderate
- PATCH /admin/lost-found/:id/moderate

## Notifications (Bonus)
- GET /notifications
- PATCH /notifications/:id/read

Response format:
{
  "success": true,
  "message": "Optional message",
  "data": {}
}
