# Hotel Booking System – Full Stack Architecture & Development Plan

## Overview
A modern, scalable, and secure Hotel Booking System built using:

- Next.js
- Tailwind CSS
- Framer Motion
- Node.js
- PostgreSQL
- Razorpay
- JWT

The system supports:

- Hotel search and filtering
- Room booking and cancellation
- Razorpay payment integration
- Email notifications
- JWT authentication
- Booking history
- Responsive UI with animations
- REST API architecture
- PostgreSQL database integration

---

# 1. System Architecture

Frontend (Next.js + Tailwind + Framer Motion)  
↓  
API Layer (Next.js API Routes / Express)  
↓  
Authentication (JWT)  
↓  
Business Logic Layer  
↓  
PostgreSQL Database  
↓  
External Services  
├── Razorpay Payment Gateway  
└── Nodemailer Email Service

---

# 2. Frontend Features (Next.js)

## Pages

| Page | Purpose |
|------|----------|
| Home Page | Search hotels |
| Hotel Details | Room info, amenities, gallery |
| Login/Register | Authentication |
| Booking Page | Book room |
| Payment Page | Razorpay payment |
| Dashboard | Booking history |
| Admin Panel | Manage hotels & rooms |

## UI Features

### Responsive Design
- Mobile-first design
- Tablet optimized
- Desktop layout

### Animations using Framer Motion
- Page transitions
- Loading skeletons
- Card hover effects
- Smooth modal animations

---

# 3. Frontend Folder Structure

```plaintext
frontend/
│
├── app/
│   ├── login/
│   ├── register/
│   ├── hotels/
│   ├── booking/
│   ├── dashboard/
│
├── components/
│   ├── Navbar.jsx
│   ├── HotelCard.jsx
│   ├── RoomCard.jsx
│   ├── BookingForm.jsx
│
├── services/
│   ├── api.js
│
├── context/
│   ├── AuthContext.js
│
├── animations/
│
└── styles/
```

---

# 4. Backend Architecture

## Backend Stack
- Node.js
- Next.js API Routes
- JWT Authentication
- PostgreSQL
- Nodemailer

## API Modules

| Module | Description |
|--------|-------------|
| Auth API | Login/Register |
| Hotel API | Hotel listing |
| Room API | Room availability |
| Booking API | Reservation |
| Payment API | Razorpay integration |
| Email API | Booking confirmations |

---

# 5. Database Design (PostgreSQL)

## Users Table

```sql
CREATE TABLE users (
 id SERIAL PRIMARY KEY,
 name VARCHAR(100),
 email VARCHAR(100) UNIQUE,
 password TEXT,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Hotels Table

```sql
CREATE TABLE hotels (
 id SERIAL PRIMARY KEY,
 hotel_name VARCHAR(255),
 location VARCHAR(255),
 rating NUMERIC(2,1),
 description TEXT
);
```

## Rooms Table

```sql
CREATE TABLE rooms (
 id SERIAL PRIMARY KEY,
 hotel_id INTEGER REFERENCES hotels(id),
 room_type VARCHAR(100),
 price NUMERIC,
 available BOOLEAN DEFAULT true,
 amenities TEXT[]
);
```

## Bookings Table

```sql
CREATE TABLE bookings (
 id SERIAL PRIMARY KEY,
 user_id INTEGER REFERENCES users(id),
 room_id INTEGER REFERENCES rooms(id),
 check_in DATE,
 check_out DATE,
 status VARCHAR(50),
 payment_status VARCHAR(50)
);
```

---

# 6. Authentication System (JWT)

## Flow

User Login  
↓  
Validate Credentials  
↓  
Generate JWT Token  
↓  
Store Token in HTTP-only Cookie  
↓  
Protect APIs using Middleware

## JWT Security
- HTTP-only cookies
- Password hashing using bcrypt
- Token expiration
- Role-based access

---

# 7. Hotel Search & Filter

## Filters
- Price Range
- Hotel Rating
- Location
- Amenities
- Availability

## Example API

```http
GET /api/hotels?location=Delhi&price=5000
```

---

# 8. Booking System

## Booking Flow

Search Hotel  
↓  
Select Room  
↓  
Choose Check-in/out  
↓  
Check Availability  
↓  
Proceed to Payment  
↓  
Booking Confirmation

---

# 9. Razorpay Payment Integration

## Features
- Secure payment gateway
- Order creation
- Payment verification
- Refund support

## Payment Flow

Create Razorpay Order  
↓  
Open Razorpay Checkout  
↓  
User Pays  
↓  
Verify Signature  
↓  
Save Booking

## Install Razorpay

```bash
npm install razorpay
```

## Sample Razorpay API Route

```javascript
import Razorpay from "razorpay";

const razorpay = new Razorpay({
 key_id: process.env.RAZORPAY_KEY,
 key_secret: process.env.RAZORPAY_SECRET,
});
```

---

# 10. Email Notifications using Nodemailer

## Emails Sent
- Booking Confirmation
- Cancellation Confirmation
- Payment Receipt

## Install Nodemailer

```bash
npm install nodemailer
```

## Example

```javascript
const transporter = nodemailer.createTransport({
 service: "gmail",
 auth: {
   user: process.env.EMAIL,
   pass: process.env.EMAIL_PASS,
 },
});
```

---

# 11. Security Measures

## Backend Security

### Input Sanitization

Prevent:
- SQL Injection
- XSS attacks

### Rate Limiting

```bash
npm install express-rate-limit
```

### Environment Variables

```env
JWT_SECRET=your_secret
DATABASE_URL=your_database_url
RAZORPAY_KEY=xxxx
```

### Validation Libraries
- Zod
- Joi
- Express Validator

---

# 12. Error Handling Structure

## Standard JSON Response

```json
{
 "success": false,
 "message": "Room not available"
}
```

## Loading States

Frontend includes:
- Skeleton loaders
- Spinner animations
- Retry handling

---

# 13. Booking History Dashboard

## User Dashboard Includes
- Active bookings
- Previous bookings
- Cancel booking
- Payment status
- Invoice download

---

# 14. Admin Features

## Admin Panel
- Add/Edit/Delete hotels
- Manage rooms
- Upload room images
- Track bookings
- View analytics

---

# 15. Recommended API Endpoints

| Method | Endpoint | Purpose |
|--------|-----------|----------|
| POST | /api/auth/register | Register |
| POST | /api/auth/login | Login |
| GET | /api/hotels | List hotels |
| GET | /api/rooms/:id | Room details |
| POST | /api/bookings | Book room |
| DELETE | /api/bookings/:id | Cancel booking |
| POST | /api/payment/create-order | Razorpay order |
| POST | /api/payment/verify | Verify payment |

---

# 16. Deployment

## Frontend Deployment
- Vercel

## Database Hosting
- Supabase
- Neon

## Backend Hosting
- Railway
- Render

---

# 17. Suggested NPM Packages

```bash
npm install axios bcryptjs jsonwebtoken
npm install razorpay nodemailer
npm install react-hook-form zod
npm install framer-motion
npm install prisma @prisma/client
```

---

# 18. Future Improvements

- AI-based hotel recommendations
- Google Maps integration
- Multi-language support
- Coupons & discounts
- Real-time room availability
- OTP authentication
- Review & rating system

---

# 19. Recommended Folder Structure (Full Stack)

```plaintext
hotel-booking-system/
│
├── frontend/
├── backend/
├── prisma/
├── public/
├── components/
├── utils/
├── middleware/
└── database/
```

---

# 20. Final Tech Stack Summary

| Layer | Technology |
|------|-------------|
| Frontend | Next.js + Tailwind CSS |
| Animation | Framer Motion |
| Backend | Node.js + Next.js API |
| Database | PostgreSQL |
| Authentication | JWT |
| Payment | Razorpay |
| Email | Nodemailer |
| Deployment | Vercel + Supabase |

---

# Ratings & Evaluations(RLHF)

- Correctness (3/5): The SQL schemas are syntactically valid but lack production-grade constraints — no ENUMs, no CHECK constraints, no indexes, no ON DELETE CASCADE. The Razorpay code snippet is a stub (3 lines) with no order creation logic, no signature verification, no error handling. The JWT flow is described but no actual middleware code is shown. Functional at a skeleton level, not a working system.

- Relevance (4/5): Addresses all 15 prompt requirements at the conceptual level. Every feature is acknowledged — auth, payments, email, booking history, cancellation, filters, responsive UI. However, relevance at surface coverage ≠ relevance at implementation depth. The prompt says "Develop" not "Plan."

- Completeness (2/5): The biggest gap. About 80% of the response is headings, tables, and bullet lists describing what should be built. No working booking API, no auth middleware, no payment verification route, no email handler, no React component. Folder structure and npm install commands do not constitute implementation.

- Style & Presentation (5/5): The cleanest output structurally. Tables, numbered sections, consistent heading hierarchy, and a readable folder tree. Every section is scannable. This is ChatGPT's strongest dimension — it is excellently organized even if thinly implemented.

- Coherence (4/5): The architecture narrative is internally consistent — the tech stack in section 1 matches what appears in later sections. No contradictions. However, coherence is partially superficial since there is no real code flow to check for logical consistency between components.

- Helpfulness (3/5): Useful as a starting roadmap for a junior developer who needs a checklist. Not useful as a deliverable — a developer still needs to write every line of code. Missing deployment instructions, no .env setup guide, no testing notes. The "Future Improvements" section adds no immediate value.

- Creativity (2/5): Standard architecture outline with no novel patterns or solutions. The future improvements list (AI recommendations, Google Maps) is generic. No creative abstractions, no interesting design decisions, no architectural patterns beyond the conventional MVC layout.
