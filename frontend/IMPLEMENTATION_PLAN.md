# UniXchange Frontend Product + UI Blueprint (Improvised)

This repository currently implements backend only.

## Product Vision (Upgraded)
UniXchange should feel like a private campus operating system, not just a buy/sell app.

Core positioning:
- One verified student identity for everything.
- Zero-noise local discovery for your exact campus.
- Fast trust decisions before every transaction.

North-star outcomes:
- Buy/sell/rent in under 3 minutes.
- Resolve lost-and-found in under 24 hours.
- Prevent scams before users engage.

## Experience Pillars
- Trust First: every card, profile, and chat includes verification and behavior signals.
- Hyperlocal: campus areas, hostels, gates, and blocks are primary navigation units.
- Speed: fewer taps to post, filter, contact, and close a transaction.
- Student-native UX: practical, lightweight, and context-rich.

## Planned Stack
- React + Vite
- Tailwind CSS
- Axios
- React Router
- Context API (Redux Toolkit only if state complexity increases)

## Information Architecture

```text
frontend/
  src/
    app/
      App.jsx
      providers/
      router/
    components/
      common/
      marketplace/
      chat/
      lostFound/
      trust/
    pages/
      auth/
      feed/
      listing/
      bookings/
      chat/
      lostFound/
      profile/
      admin/
    services/
      apiClient.js
      auth.service.js
      listing.service.js
      booking.service.js
      chat.service.js
      lostFound.service.js
      report.service.js
    hooks/
      useAuth.js
      usePagination.js
      useDebouncedSearch.js
      usePolling.js
    context/
      AuthContext.jsx
      NotificationContext.jsx
    utils/
      format.js
      validators.js
      constants.js
```

## Feature Set (Improvised)

### 1. Smart Campus Feed
- Personalized tabs: For You, Nearby, Urgent, New Today.
- Saved filters per user (example: Electronics + Under 3000 + Hostel A).
- Quick actions on cards: Save, Share, Report, Message.

### 2. Listing Quality Layer
- Listing completion score while posting.
- Real-time pricing hint from similar items.
- Trust badges on listing cards:
  - Verified Student
  - Fast Responder
  - Low Report Risk

### 3. Rent Flow Enhancements
- Availability calendar with blocked date visualization.
- Booking timeline: Requested -> Approved -> Active -> Completed.
- Pickup/return checklist UI to reduce disputes.

### 4. Lost & Found Enhancements
- Visual similarity cards and confidence chips.
- Campus location heat indicators for recent found reports.
- Claim flow with challenge questions (owner proof prompts).

### 5. Chat Improvements
- Conversation grouped by listing.
- Suggested message chips:
  - Is this still available?
  - Can we meet at library gate?
  - Final price?
- Safety prompts pinned in first message for first-time contacts.

### 6. Trust & Safety Layer (Visible UX)
- Public trust score (non-sensitive): response rate, successful deals, account age.
- One-tap report from listing/chat/profile.
- Soft warning banner for suspicious content patterns.

### 7. Student Utility Extras
- Wishlist collections (Semester Essentials, Hostel Setup, etc.).
- Price drop alerts for wishlisted items.
- Campus event mode: temporary category highlights during move-in/fest/exam periods.

## UI Direction (Improvised)

### Brand Personality
- Bold, energetic, practical.
- Editorial-card style with strong hierarchy.
- Dense information without visual clutter.

### Visual System
- Use a warm-neutral base with high-contrast accent colors.
- Color semantics:
  - Trust/verified: emerald tones.
  - Rent/time-sensitive: amber tones.
  - Reports/risk: red tones.
  - Lost & found: blue tones.
- Rounded cards, sharp section dividers, large readable pricing typography.

### Typography Direction
- Headline font: expressive geometric sans.
- Body font: highly legible sans optimized for dense mobile cards.
- Numeric style for prices and time should be tabular where possible.

### Motion and Interaction
- Staggered feed reveal on first load.
- Card hover and press states with subtle lift and shadow shift.
- Animated state transitions for booking timeline and report status.
- Skeleton loaders for list-heavy views.

### Mobile-first Layout
- Bottom navigation for: Feed, Sell, Chat, Lost&Found, Profile.
- Sticky quick filters and sticky CTA for posting listings.
- Thumb-zone optimized actions on listing cards.

## Page-by-Page UX Blueprint
- Auth: clear college email restriction messaging before signup.
- Feed: fast filters, sort chips, infinite scroll with smart section headers.
- Listing Detail: gallery, trust panel, seller card, CTA cluster (chat/bookmark/report).
- Post Listing: progressive form with autosave draft.
- Bookings: timeline view + status badges + action buttons.
- Chat: listing context header, read states, safety nudges.
- Lost & Found: split view (lost vs found) + match suggestions.
- Profile: trust metrics, active listings, completed deals, wishlist collections.
- Admin: moderation queue with reason clustering and quick actions.

## Integration Contract
Backend base URL:
- http://localhost:5000/api/v1

Auth token handling:
- Store access token in memory-first strategy (local fallback only if needed).
- Send Authorization header as Bearer token for protected endpoints.

## API Classes and Endpoint Map

Use one central Axios client and split features by service class.

### 1. apiClient.js
- Responsibility:
  - Set baseURL to /api/v1
  - Attach Authorization header when token exists
  - Standardize error parsing

### 2. auth.service.js
- signup(payload)
  - POST /auth/signup
  - body: fullName, email, password, campusArea(optional)
- verifyOtp(payload)
  - POST /auth/verify-otp
  - body: email, otp
- resendOtp(payload)
  - POST /auth/resend-otp
  - body: email
- login(payload)
  - POST /auth/login
  - body: email, password
- logout()
  - POST /auth/logout
- getMe()
  - GET /auth/me

### 3. user.service.js
- getMyProfile()
  - GET /users/me
- updateMyProfile(payload)
  - PATCH /users/me
  - body: fullName(optional), campusArea(optional), bio(optional)
- updateAvatar(payload)
  - PATCH /users/me/avatar
  - body: avatarUrl
- getDashboard()
  - GET /users/me/dashboard
- getPublicUser(userId)
  - GET /users/:id/public

### 4. listing.service.js
- createListing(payload)
  - POST /listings
  - body: title, description, price, category, type, images[], campusArea, rentDetails(optional)
- getListings(params)
  - GET /listings
  - query: page, limit, category, type, campusArea, minPrice, maxPrice, search
- getListingById(listingId)
  - GET /listings/:id
- updateListing(listingId, payload)
  - PATCH /listings/:id
- deleteListing(listingId)
  - DELETE /listings/:id
- addToWishlist(listingId)
  - POST /listings/:id/wishlist
- removeFromWishlist(listingId)
  - DELETE /listings/:id/wishlist

### 5. booking.service.js
- createBooking(payload)
  - POST /bookings
  - body: listingId, startDate, endDate, note(optional)
- getMyBookings(params)
  - GET /bookings/me
  - query: page, limit, status(optional)
- updateBookingStatus(bookingId, payload)
  - PATCH /bookings/:id/status
  - body: status, note(optional)

### 6. chat.service.js
- createOrGetConversation(payload)
  - POST /chats/conversations
  - body: participantId, listingId(optional)
- getMyConversations()
  - GET /chats/conversations
- getConversationMessages(conversationId)
  - GET /chats/conversations/:id/messages
- sendMessage(conversationId, payload)
  - POST /chats/conversations/:id/messages
  - body: content

### 7. lostFound.service.js
- createLostFound(payload)
  - POST /lost-found
  - body: type, title, description, images(optional), campusArea, dateOfEvent
- getLostFoundList(params)
  - GET /lost-found
  - query: page, limit, type(optional), status(optional), campusArea(optional), search(optional)
- getLostFoundById(recordId)
  - GET /lost-found/:id
- updateLostFound(recordId, payload)
  - PATCH /lost-found/:id
- matchLostFound(recordId, payload)
  - POST /lost-found/:id/match
  - body: matchedWithId, matchConfidence(optional)

### 8. report.service.js
- createReport(payload)
  - POST /reports
  - body: targetType, targetId, reason

### 9. notification.service.js
- getMyNotifications(params)
  - GET /notifications
  - query: page, limit
- markNotificationRead(notificationId)
  - PATCH /notifications/:id/read

### 10. admin.service.js
- getReports(params)
  - GET /admin/reports
  - query: page, limit, status(optional), targetType(optional)
- updateReportStatus(reportId, payload)
  - PATCH /admin/reports/:id/status
  - body: status, resolutionNote(optional)
- moderateListing(listingId, payload)
  - PATCH /admin/listings/:id/moderate
  - body: status
- moderateLostFound(recordId, payload)
  - PATCH /admin/lost-found/:id/moderate
  - body: status

### Common Response Handling Contract
- Expect server format:
  - success: boolean
  - message: string
  - data: object or array
- Standard frontend pattern:
  - Return response.data.data from services
  - Throw normalized error with message fallback from response.data.message

## Frontend Quality Checklist
- Input validation with helpful microcopy.
- Empty states for every list page.
- Retry patterns for network failures.
- Accessibility baseline: keyboard nav, contrast, focus states, aria labels.
- Pagination or infinite loading with API-aligned query params.

## Suggested Delivery Sequence
1. App shell, providers, routes, and design tokens.
2. Auth flow with protected routes and session bootstrap.
3. Feed + listing cards + search and filter engine.
4. Listing detail + create/edit listing workflow.
5. Booking workflow with timeline UI.
6. Chat conversations and polling-based messaging.
7. Lost & Found module with match suggestions UI.
8. Profile, wishlist collections, and notifications center.
9. Admin moderation console.
