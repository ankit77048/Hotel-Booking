# 🏨 Hotel Booking System

A responsive, full-stack Hotel Booking System built with **Next.js**, **PostgreSQL**, **Razorpay**, and **JWT authentication**. Users can search hotels, view room details, check availability, book securely, pay online, and receive email confirmations.

---

# 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Authentication](#-authentication)
- [Payment Integration](#-payment-integration)
- [Email Notifications](#-email-notifications)
- [Security](#-security)
- [Deployment](#-deployment)
- [Screenshots](#-screenshots)

---

# ✨ Features

- 🔍 **Search & Filter Hotels** — by location, price range, rating, and amenities
- 🏷️ **Hotel Listings** — ratings, locations, gallery, and room details
- 🛏️ **Room Availability** — real-time check with concurrency-safe booking
- 🔐 **Secure Auth** — JWT stored in HTTP-only cookies, bcrypt password hashing
- 📅 **Reservation System** — check-in/check-out selection and booking overview
- 💳 **Razorpay Payments** — order creation, checkout, and HMAC signature verification
- 📧 **Email Confirmations** — booking confirmed and cancellation emails via Nodemailer
- 📖 **Booking History** — view all past and active bookings in user dashboard
- ❌ **Cancel Bookings** — cancel with automatic email notification
- ✅ **Form Validation** — client-side (Zod + React Hook Form) and server-side (Zod)
- 🔒 **Secure REST APIs** — rate limiting, input sanitization, parameterized SQL
- 📱 **Fully Responsive** — mobile, tablet, and desktop layouts
- 🎨 **Animations** — page transitions and UI interactions via Framer Motion

---

# 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Backend | Node.js + Next.js API Routes |
| Authentication | JWT (HTTP-only cookies) |
| Database | PostgreSQL |
| ORM / Query | pg (node-postgres) |
| Payment | Razorpay |
| Email | Nodemailer (Gmail SMTP) |
| Validation | Zod + React Hook Form |
| Language | TypeScript |

---

# 🏗️ System Architecture

```plaintext
Client (Next.js + Tailwind + Framer Motion)
        ↓
Next.js API Routes (App Router)
        ↓
JWT Middleware (HTTP-only cookies)
        ↓
Business Logic + Input Validation (Zod)
        ↓
Rate Limiter
        ↓
PostgreSQL (via pg Pool)
        ↓
External Services
   ├── Razorpay Payment Gateway
   └── Nodemailer (Gmail SMTP)
```

---

# 📁 Project Structure

```plaintext
hotel-booking-system/
├── app/
│   ├── page.tsx
│   ├── hotels/
│   │   └── [id]/page.tsx
│   ├── booking/
│   │   └── [roomId]/page.tsx
│   ├── dashboard/page.tsx
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   └── api/
│       ├── auth/
│       │   ├── register/route.ts
│       │   ├── login/route.ts
│       │   └── logout/route.ts
│       ├── hotels/route.ts
│       ├── rooms/[id]/route.ts
│       ├── bookings/
│       │   ├── route.ts
│       │   └── [id]/route.ts
│       ├── payments/
│       │   ├── create-order/route.ts
│       │   └── verify/route.ts
│       └── user/bookings/route.ts
├── components/
│   ├── Navbar.tsx
│   ├── HotelCard.tsx
│   ├── RoomCard.tsx
│   ├── BookingForm.tsx
│   └── BookingHistory.tsx
├── lib/
│   ├── db.ts
│   ├── auth.ts
│   ├── mailer.ts
│   └── rateLimit.ts
├── middleware.ts
├── .env.local
└── package.json
```

---

# 🗄️ Database Schema

```sql
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE user_role AS ENUM ('user', 'admin');

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE hotels (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255) NOT NULL,
    rating DECIMAL(2,1) CHECK (rating BETWEEN 1.0 AND 5.0),
    images TEXT[] NOT NULL DEFAULT '{}',
    amenities TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    hotel_id INT REFERENCES hotels(id) ON DELETE CASCADE,
    room_type VARCHAR(100) NOT NULL,
    price_per_night DECIMAL(10,2) NOT NULL,
    capacity INT NOT NULL,
    total_inventory INT NOT NULL DEFAULT 1,
    images TEXT[] NOT NULL DEFAULT '{}',
    amenities TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    room_id INT REFERENCES rooms(id) ON DELETE CASCADE,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    status booking_status DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_dates CHECK (check_out_date > check_in_date)
);

CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    booking_id INT REFERENCES bookings(id) ON DELETE CASCADE,
    razorpay_order_id VARCHAR(255) UNIQUE NOT NULL,
    razorpay_payment_id VARCHAR(255),
    amount DECIMAL(10,2) NOT NULL,
    status payment_status DEFAULT 'pending',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_bookings_dates ON bookings (check_in_date, check_out_date);
CREATE INDEX idx_bookings_user ON bookings (user_id);
CREATE INDEX idx_rooms_hotel ON rooms (hotel_id);
CREATE INDEX idx_hotels_location ON hotels (location);
CREATE INDEX idx_hotels_rating ON hotels (rating);
```

---

# 🚀 Getting Started

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Razorpay account
- Gmail App Password

## Clone Repository

```bash
git clone https://github.com/yourusername/hotel-booking-system.git
cd hotel-booking-system
```

## Install Dependencies

```bash
npm install
```

## Setup Database

```bash
createdb hotel_db
psql -d hotel_db -f database/schema.sql
```

## Run Development Server

```bash
npm run dev
```

Open `http://localhost:3000`

---

# 🔑 Environment Variables

```env
DATABASE_URL=postgresql://user:password@localhost:5432/hotel_db

JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters

RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=youremail@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM="Grand Stay Hotel" <youremail@gmail.com>

NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

---

# 📡 API Endpoints

## Auth APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |

## Booking APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/bookings` | Create booking |
| DELETE | `/api/bookings/:id` | Cancel booking |
| GET | `/api/user/bookings` | Booking history |

## Payment APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/payments/verify` | Verify Razorpay payment |

---

# 🔐 Authentication

- JWT stored in HTTP-only cookies
- bcrypt password hashing
- Protected routes via middleware
- 7-day token expiry
- Structured JSON errors

---

# 💳 Payment Integration

1. Backend creates Razorpay order
2. Frontend opens Razorpay checkout
3. Backend verifies HMAC SHA-256 signature
4. Booking confirmed after verification

All critical writes use PostgreSQL transactions:

```sql
BEGIN;
COMMIT;
ROLLBACK;
```

---

# 📧 Email Notifications

Emails sent using Nodemailer:

- Booking confirmation
- Booking cancellation

Includes:

- Booking ID
- Hotel name
- Room type
- Dates
- Total amount

---

# 🔒 Security

| Security Measure | Implementation |
|---|---|
| JWT Storage | HTTP-only cookies |
| Password Hashing | bcrypt |
| SQL Injection Prevention | Parameterized queries |
| Validation | Zod schemas |
| Rate Limiting | Custom limiter |
| Payment Security | Razorpay HMAC verification |
| Secrets | Environment variables |

---

# 🌐 Deployment

| Layer | Service |
|---|---|
| Frontend + API | Vercel |
| Database | Supabase / Neon |
| Email | Gmail / SendGrid |
| Pooling | PgBouncer |

```bash
npm install -g vercel
vercel
```

---

# 📸 Screenshots

| Page | Screenshot |
|---|---|
| Home | add screenshot |
| Hotel Detail | add screenshot |
| Booking Checkout | add screenshot |
| Dashboard | add screenshot |

---

# 📦 NPM Packages

```bash
npm install next react react-dom
npm install tailwindcss postcss autoprefixer
npm install framer-motion
npm install pg bcryptjs jsonwebtoken
npm install razorpay nodemailer
npm install zod react-hook-form @hookform/resolvers
npm install -D typescript @types/node @types/pg
```

---

# 🔮 Future Improvements

- AI hotel recommendations
- Google Maps integration
- OTP authentication
- Coupons & discounts
- WebSocket room availability
- Reviews & ratings
- Multi-language support
- Admin panel

---

# 📄 License

MIT License

---

# 🙌 Acknowledgements

- Razorpay
- Nodemailer
- Framer Motion
- Tailwind CSS
- Zod
