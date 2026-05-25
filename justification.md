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
# Building a full-stack, responsive Hotel Booking System using the specified Next.js, Node.js, PostgreSQL, and Razorpay stack requires a modular, scalable architecture.

Below is the comprehensive blueprint, database schema, API design, and core implementation code to build this system.

# 1. System Architecture & Database Schema

To handle high concurrency (like preventing double-booking of rooms), we will design a relational schema in PostgreSQL. We use standard primary keys, foreign keys, and status enums to keep the data clean.

## PostgreSQL Database Schema (SQL)

```sql
-- Enums for structured status fields
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- 1. Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Hotels Table
CREATE TABLE hotels (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255) NOT NULL,
    rating DECIMAL(2,1) CHECK (rating >= 1.0 AND rating <= 5.0),
    images TEXT[] NOT NULL, -- Array of image URLs
    amenities TEXT[] NOT NULL, -- Array of amenities (e.g., ['WiFi', 'Pool'])
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Rooms Table
CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    hotel_id INT REFERENCES hotels(id) ON DELETE CASCADE,
    room_type VARCHAR(100) NOT NULL, -- e.g., 'Deluxe Suite', 'Standard Room'
    price_per_night DECIMAL(10, 2) NOT NULL,
    capacity INT NOT NULL,
    total_inventory INT NOT NULL, -- Total rooms of this type available in the hotel
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Bookings Table
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    room_id INT REFERENCES rooms(id) ON DELETE CASCADE,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status booking_status DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_dates CHECK (check_out_date > check_in_date)
);

-- 5. Payments Table
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    booking_id INT REFERENCES bookings(id) ON DELETE CASCADE,
    razorpay_order_id VARCHAR(255) UNIQUE NOT NULL,
    razorpay_payment_id VARCHAR(255),
    amount DECIMAL(10, 2) NOT NULL,
    status payment_status DEFAULT 'pending',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance Optimization
CREATE INDEX idx_bookings_dates ON bookings (check_in_date, check_out_date);
CREATE INDEX idx_rooms_hotel ON rooms (hotel_id);
```

---

# 2. Backend Implementation (Next.js API Routes / Node.js)

These backend routes are structured using Next.js App Router style handlers (/app/api/...), securing APIs against injection, validating data, and managing state securely.

## Security Utilities (/lib/auth.js & /lib/db.js)

First, initialize the PostgreSQL pool client (pg) and standard JWT helper utilities.

### lib/db.js

```javascript
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export const query = (text, params) => pool.query(text, params);
```

### lib/auth.js

```javascript
import jwt from 'jsonwebtoken';

export function verifyJWT(req) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Unauthorized');
  }
  const token = authHeader.split(' ')[1];
  return jwt.verify(token, process.env.JWT_SECRET);
}
```

---

# Room Availability & Booking Logic (/app/api/bookings/route.js)

This route handles secure inventory validation using a PostgreSQL Transaction to prevent double-booking issues during concurrent checkouts.

```javascript
import { query } from '@/lib/db';
import { verifyJWT } from '@/lib/auth';
import Razorpay from 'razorpay';
import { NextResponse } from 'next/server';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  try {
    const user = verifyJWT(req);
    const { roomId, checkIn, checkOut } = await req.json();

    // 1. Server-side validation
    if (!roomId || !checkIn || !checkOut) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Calculate total days
    const totalDays = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
    if (totalDays <= 0) {
      return NextResponse.json({ error: 'Invalid dates selected' }, { status: 400 });
    }

    // 2. Room Availability Check (Transactional Integrity)
    // Counts active concurrent bookings for the selected room type during the target timeline
    const availabilityCheck = await query(
      `SELECT r.price_per_night, r.total_inventory, COALESCE(COUNT(b.id), 0) as booked_count
       FROM rooms r
       LEFT JOIN bookings b ON b.room_id = r.id 
         AND b.status = 'confirmed'
         AND NOT (b.check_out_date <= $2 OR b.check_in_date >= $3)
       WHERE r.id = $1
       GROUP BY r.price_per_night, r.total_inventory`,
      [roomId, checkIn, checkOut]
    );

    if (availabilityCheck.rows.length === 0) {
      return NextResponse.json({ error: 'Room type not found' }, { status: 404 });
    }

    const { price_per_night, total_inventory, booked_count } = availabilityCheck.rows[0];

    if (parseInt(booked_count) >= total_inventory) {
      return NextResponse.json({ error: 'Room is fully booked for selected dates' }, { status: 400 });
    }

    const totalPrice = price_per_night * totalDays;

    // 3. Initialize Razorpay Order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalPrice * 100), // Razorpay handles currency in minor units (paise)
      currency: 'INR',
      receipt: `rcpt_room_${roomId}_${Date.now()}`,
    });

    // 4. Save Pending Booking and Payment Order metadata inside a single DB Transaction
    await query('BEGIN');
    
    const bookingResult = await query(
      `INSERT INTO bookings (user_id, room_id, check_in_date, check_out_date, total_price, status)
       VALUES ($1, $2, $3, $4, $5, 'pending') RETURNING id`,
      [user.id, roomId, checkIn, checkOut, totalPrice]
    );

    const bookingId = bookingResult.rows[0].id;

    await query(
      `INSERT INTO payments (booking_id, razorpay_order_id, amount, status)
       VALUES ($1, $2, $3, 'pending')`,
      [bookingId, razorpayOrder.id, totalPrice]
    );

    await query('COMMIT');

    return NextResponse.json({
      bookingId,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    }, { status: 201 });

  } catch (error) {
    await query('ROLLBACK');
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
```

---

# Payment Verification & Email Webhook (/app/api/payments/verify/route.js)

Verifies cryptographic signatures generated by Razorpay checkout and dispatches notification emails via Nodemailer.

```javascript
import { query } from '@/lib/db';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(req) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = await req.json();

    // 1. Verify Payment Webhook Signature
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid transaction signature' }, { status: 400 });
    }

    // 2. Update Database Order Records
    await query('BEGIN');

    await query(
      `UPDATE payments SET razorpay_payment_id = $1, status = 'completed', updated_at = NOW()
       WHERE razorpay_order_id = $2`,
      [razorpay_payment_id, razorpay_order_id]
    );

    const bookingUpdate = await query(
      `UPDATE bookings SET status = 'confirmed' WHERE id = $1 RETURNING user_id, total_price`,
      [bookingId]
    );

    const { user_id, total_price } = bookingUpdate.rows[0];
    
    // Fetch user details for confirmation email
    const userRes = await query(`SELECT name, email FROM users WHERE id = $1`, [user_id]);
    const user = userRes.rows[0];

    await query('COMMIT');

    // 3. Asynchronously trigger Confirmation Email
    await transporter.sendMail({
      from: '"Grand Horizon Stay" <bookings@grandhorizon.com>',
      to: user.email,
      subject: 'Booking Confirmed! 🏨',
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eaeaea;">
          <h2>Hello, ${user.name} 👋</h2>
          <p>Your booking has been successfully finalized and securely processed.</p>
          <p><strong>Booking Reference ID:</strong> #GHS-${bookingId}</p>
          <p><strong>Total Paid:</strong> ₹${total_price}</p>
          <p>We are preparing for your arrival!</p>
        </div>
      `,
    });

    return NextResponse.json({ message: 'Payment verified and booking confirmed successfully' });

  } catch (error) {
    await query('ROLLBACK');
    return NextResponse.json({ error: 'Verification Engine Error' }, { status: 500 });
  }
}
```

---

# 3. Frontend Implementation (Next.js + Tailwind + Framer Motion)

The client application includes interactive dashboard cards, smooth layout transitions, and seamless Razorpay integration hooks.

## Dynamic Room Card Component

```javascript
'use client';

// components/RoomCard.jsx

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function RoomCard({ room, onBook }) {
  const [loading, setLoading] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-md overflow-hidden border border-slate-100 flex flex-col md:flex-row w-full mb-6"
    >
      {/* Visual Gallery Layout */}
      <div className="relative w-full md:w-2/5 h-64 md:h-auto min-h-[240px]">
        <Image 
          src={room.images?.[0] || 'https://images.unsplash.com/photo-1571896349842-33c89424de2d'} 
          alt={room.room_type}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 40vw"
        />
      </div>

      {/* Structured Copy Area */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-slate-800">{room.room_type}</h3>
              <p className="text-sm text-slate-500 mt-1">{room.location || 'Premium Wing'}</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-indigo-600">₹{room.price_per_night}</span>
              <p className="text-xs text-slate-400">/ night</p>
            </div>
          </div>

          {/* Clean Flex Badges for Amenities */}
          <div className="flex flex-wrap gap-2 mt-4">
            {room.amenities?.map((amenity, idx) => (
              <span key={idx} className="bg-slate-50 text-slate-600 text-xs px-2.5 py-1 rounded-full font-medium border border-slate-200">
                {amenity}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="text-sm">
            <span className="font-semibold text-emerald-600">Available Now</span>
            <p className="text-xs text-slate-400">Max Capacity: {room.capacity} Adults</p>
          </div>
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              await onBook(room.id);
              setLoading(false);
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Reserve Room'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
```

---

# Checkout UI & Gateway Integration

This component initializes Razorpay's client library and opens the checkout window.

```javascript
'use client';

// app/rooms/page.jsx

import { useEffect } from 'react';
import RoomCard from '@/components/RoomCard';
import { useRouter } from 'next/navigation';

export default function RoomsPage() {
  const router = useRouter();

  // Dynamically attach Razorpay Script Native SDK Checkout Client
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleBookingInit = async (roomId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return router.push('/login');

      // 1. Call Backend to create Order
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          roomId,
          checkIn: '2026-06-01', // Example dates
          checkOut: '2026-06-05'
        })
      });

      const orderData = await res.json();
      if (!res.ok) throw new Error(orderData.error);

      // 2. Open Razorpay Modal Interface
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Grand Horizon Stay',
        description: 'Secure Room Reservation Payment',
        order_id: orderData.orderId,
        handler: async function (response) {
          // 3. Send Payment Details to Verification API
          const verifyRes = await fetch('/api/payments/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: orderData.bookingId
            })
          });

          const verifyData = await verifyRes.json();
          if (verifyRes.ok) {
            router.push(`/bookings/confirmation?id=${orderData.bookingId}`);
          } else {
            alert('Payment Verification Failed: ' + verifyData.error);
          }
        },
        theme: { color: '#4F46E5' }
      };

      const paymentWindow = new window.Razorpay(options);
      paymentWindow.open();

    } catch (err) {
      alert(err.message || 'Booking process encountered an error');
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-black text-slate-900 mb-2">Find Your Perfect Stay</h2>
      <p className="text-slate-500 mb-8">Compare real-time availability and book premium stays instantly.</p>
      
      {/* Mocking a populated array iteration for rendering */}
      <RoomCard 
        room={{
          id: 1,
          room_type: 'Executive Oceanfront Suite',
          price_per_night: 8499.00,
          capacity: 2,
          amenities: ['Ocean View', 'Complimentary High-speed WiFi', 'Private Balcony', '24/7 Room Service'],
          images: ['https://images.unsplash.com/photo-1566665797739-1674de7a421a']
        }}
        onBook={handleBookingInit}
      />
    </main>
  );
}
```

---

# 4. Crucial Security & Reliability checklist

To ensure this deployment is ready for production, implement these configuration steps:

- Database Connection Pooling: Next.js Serverless deployments can exhaust database resources quickly. Limit database connections in production by setting max pool configurations on the Pool client or using a connection pooler like PgBouncer.

- API Rate Limiting: Protect your auth and checkout routes from brute-force attempts. Use express-rate-limit (if building a separate Express backend) or Vercel middleware Edge rate-limiting for Next.js endpoints.

- Double-Booking Prevention: Always verify inventory count inside a transactional environment block (BEGIN / COMMIT) just before generating payment tokens, as shown in the API design above.

- Input Sanitization: Use libraries like zod to validate inbound payload bodies on the API layer before passing arguments into SQL parameterized execution lines.

---

# Ratings & Evaluations(RLHF)

- D1 Correctness (4.5/5): Actual working code throughout. The PostgreSQL transaction block (BEGIN/COMMIT/ROLLBACK) is correctly implemented. Razorpay HMAC signature verification using crypto.createHmac is the correct production pattern. JWT Bearer extraction is correct. The RoomCard component is valid JSX with proper Framer Motion syntax. One deduction: using localStorage for JWT tokens in the frontend is an XSS vulnerability — HTTP-only cookies are the safer pattern. Minor but real.

- Relevance (5/5): Every requirement from the prompt is addressed with working code, not just mentioned. Auth middleware, booking with check-in/out, availability check, Razorpay integration, email confirmation, form validation, parameterized SQL (injection protection), rate limiting mentioned in checklist, env variables used throughout. Full coverage with implementation evidence.

- Completeness (4.5/5): Delivers schema, backend API routes, payment verification, email dispatch, and a full frontend component. The production checklist covers PgBouncer, double-booking prevention, input sanitization with Zod, and rate limiting. Small deductions: no explicit cancellation API route shown, no booking history dashboard code, no admin panel implementation.

- Style & Presentation (4/5): Code is clean, well-commented at key logic points, and consistently named across files. The inline comments explaining non-obvious decisions (e.g., "Razorpay handles currency in minor units") add real value. Slight density compared to ChatGPT's cleaner visual layout, but density is earned by actual content.

- Coherence (5/5): This is Gemini's strongest dimension. The bookingId flows correctly from the POST booking route → Razorpay order → payment verification route → email confirmation. Variable names are consistent across files (razorpay_order_id, bookingId). The schema ENUMs match the values inserted in the API code ('pending', 'confirmed', 'cancelled'). End-to-end logical integrity is solid.

- Helpfulness (5/5): A developer can copy this code, add .env variables, and have a running skeleton. The production checklist at the end directly addresses real deployment concerns a developer would face. The availability query with concurrency logic, the HMAC verification pattern, and the transactional booking insert are all patterns that would otherwise take hours of research to arrive at independently.

- Creativity (4/5): The concurrent booking prevention using a single transactional SQL availability check (counting overlapping confirmed bookings against total_inventory) is a genuinely elegant solution to a hard problem. The payments table as a separate entity from bookings (enabling refund tracking) shows good architectural thinking. The capacity and total_inventory separation on the rooms table is a non-obvious but correct design. Doesn't reinvent anything, but applies advanced patterns purposefully.

# Likert Score — 6

# Final Verdict

Response B (Gemini) is better than Response A (ChatGPT). Response B delivers actual working implementation code covering every major requirement — a transactional PostgreSQL booking route with BEGIN/COMMIT/ROLLBACK to prevent double-booking, correct Razorpay HMAC signature verification using crypto.createHmac, a functional JWT Bearer middleware, a Nodemailer dispatch handler, and a complete animated RoomCard JSX component with Framer Motion — while Response A produces only a planning document with tables, bullet lists, and folder structures that describe what should be built without building any of it.

Response A's SQL schemas omit ENUMs, CHECK constraints, and performance indexes that Response B includes, meaning Response A's database layer would fail under concurrent bookings. Response A's Razorpay section is a 3-line stub with no order creation, no signature verification, and no error handling, directly failing prompt requirement 7.

Response A also presents a Future Improvements section listing AI recommendations and Google Maps integration that adds zero deliverable value to the current prompt.

Response B further demonstrates superior architectural thinking by separating a payments table from bookings to enable refund tracking, adding total_inventory and capacity as distinct room fields, and including production-critical guidance on PgBouncer connection pooling and Edge rate limiting.

The only dimension where Response A leads is visual presentation — its tables and heading hierarchy are cleaner — but structural neatness cannot compensate for the absence of a working system.

The prompt explicitly instructs "Act as a Full Stack Developer" and "Develop" the system; Response B answers that brief, Response A answers a softer brief of outlining how one might develop it.
