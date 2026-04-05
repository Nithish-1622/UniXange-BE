# Postman Testing Checklist

## Authentication
- Signup with valid college email -> expect OTP initiation.
- Signup with invalid domain email -> expect 403.
- Verify OTP with wrong OTP -> expect 400.
- Login before verification -> expect 403.
- Login after verification -> expect JWT token.

## Authorization
- Access protected routes without token -> expect 401.
- Access admin routes as student -> expect 403.

## Listings
- Create listing with missing required fields -> expect 400.
- Create listing as authenticated user -> expect 201.
- Search/filter listing combinations (category, type, price range, search).
- Update/delete listing by non-owner -> expect 403.

## Booking (Rent)
- Create booking on non-rent listing -> expect 400.
- Create booking with invalid date range -> expect 400.
- Owner approves/rejects booking.
- Renter cancels booking.

## Chat
- Create conversation between two users.
- Post message and fetch messages by participant.
- Access conversation by non-participant -> expect 403.

## Lost & Found
- Create lost and found reports.
- Match two records.
- Update status tracking.

## Reports & Admin
- Report a listing/user.
- Admin fetches report queue.
- Admin resolves report and moderates target listing.
