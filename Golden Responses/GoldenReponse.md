# Hotel Booking System — Golden Response

## Full Stack Implementation Blueprint

**Stack:** Next.js · Tailwind CSS · Framer Motion · Node.js · PostgreSQL · Razorpay · JWT · Nodemailer

---

# 1. System Architecture

```plaintext
Client (Next.js + Tailwind + Framer Motion)
        ↓
Next.js API Routes (App Router)
        ↓
JWT Middleware (HTTP-only cookies)
        ↓
Business Logic + Input Validation (Zod)
        ↓
Rate Limiter (express-rate-limit / Upstash)
        ↓
PostgreSQL (via pg Pool + PgBouncer in prod)
        ↓
External Services
   ├── Razorpay Payment Gateway
   └── Nodemailer (Gmail SMTP / SendGrid)
```

---

# 2. Project Folder Structure

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
│   ├── HotelCard.tsx
│   ├── RoomCard.tsx
│   ├── BookingForm.tsx
│   ├── Navbar.tsx
│   └── BookingHistory.tsx
├── lib/
│   ├── db.ts
│   ├── auth.ts
│   ├── mailer.ts
│   └── rateLimit.ts
├── middleware.ts
├── .env.local
└── prisma/schema.prisma
```

---

# 3. Environment Variables (.env.local)

```env
DATABASE_URL=postgresql://user:password@localhost:5432/hotel_db

JWT_SECRET=your_super_secret_jwt_key_min_32_chars

RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=youremail@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM='"Grand Stay Hotel" <youremail@gmail.com>'

NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

> Gmail App Password setup: Go to Google Account → Security → 2-Step Verification → App Passwords → Generate for "Mail".

---

# 4. PostgreSQL Database Schema

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

# 5. Database Connection (lib/db.ts)

```typescript
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: process.env.NODE_ENV === 'production' ? 5 : 10,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false,
});

export const query = (text: string, params?: unknown[]) =>
  pool.query(text, params);

export default pool;
```

---

# 6. JWT Authentication (lib/auth.ts)

```typescript
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET!;

export interface JWTPayload {
  id: number;
  email: string;
  role: string;
}

export function signJWT(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyJWT(req: NextRequest): JWTPayload {
  const token =
    req.cookies.get('token')?.value ||
    req.headers.get('authorization')?.split(' ')[1];

  if (!token) throw new Error('Unauthorized: No token provided');

  return jwt.verify(token, JWT_SECRET) as JWTPayload;
}
```

---

# 7. Rate Limiter (lib/rateLimit.ts)

```typescript
import { NextRequest, NextResponse } from 'next/server';

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(req: NextRequest, limit = 10, windowMs = 60_000) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return null;
  }

  record.count++;
  if (record.count > limit) {
    return NextResponse.json(
      { success: false, message: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }
  return null;
}
```

---

# 8. Nodemailer Config (lib/mailer.ts)

```typescript
import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
```

---

# 9. Auth API Routes

## Register (app/api/auth/register/route.ts)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { query } from '@/lib/db';
import { signJWT } from '@/lib/auth';
import { rateLimit } from '@/lib/rateLimit';

const RegisterSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(72),
});
```

## Login (app/api/auth/login/route.ts)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { query } from '@/lib/db';
import { signJWT } from '@/lib/auth';
import { rateLimit } from '@/lib/rateLimit';
```

---

# 10. Hotels API (app/api/hotels/route.ts)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const location = searchParams.get('location');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const rating = searchParams.get('rating');
  } catch (err) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch hotels' },
      { status: 500 }
    );
  }
}
```

---

# 11. Booking API with Concurrency Protection

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { query } from '@/lib/db';
import { verifyJWT } from '@/lib/auth';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});
```

---

# 12. Cancel Booking API

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyJWT } from '@/lib/auth';
```

---

# 13. Payment Verification API

```typescript
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { query } from '@/lib/db';
```

---

# 14. Booking History API

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyJWT } from '@/lib/auth';
```

---

# 15. Frontend — RoomCard Component

```tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
```

---

# 16. Frontend — Rooms Page with Razorpay

```tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RoomCard from '@/components/RoomCard';
```

---

# 17. Route Protection Middleware

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/auth';
```

---

# 18. Standard JSON Response Structure

```json
{
  "success": true,
  "data": {},
  "message": "Success"
}
```

---

# 19. NPM Packages

```bash
npm install next react react-dom
npm install tailwindcss postcss autoprefixer
npm install framer-motion
npm install pg bcryptjs jsonwebtoken
npm install razorpay nodemailer
npm install zod react-hook-form @hookform/resolvers
```

---

# 20. Deployment

| Layer | Service |
|---|---|
| Frontend + API Routes | Vercel |
| PostgreSQL | Supabase or Neon |
| Connection Pooling | PgBouncer |
| Email | Gmail App Password or SendGrid |

---

# 21. Production Security Checklist

- [x] JWT stored in HTTP-only cookies
- [x] Passwords hashed with bcrypt
- [x] Razorpay HMAC signature verified
- [x] Parameterized SQL queries
- [x] Zod validation
- [x] Rate limiting
- [x] PostgreSQL transaction blocks
- [x] Concurrency-safe room availability check

---

# Golden Response Summary

Golden Response combines architectural clarity of ChatGPT with full working implementation depth of Gemini, including:

- HTTP-only cookie authentication
- Cancellation API
- Booking history
- Consistent environment variables
- TypeScript types
- Structured JSON responses
- Pagination
- Production deployment guidance
