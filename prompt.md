# Hotel Booking System

Act as  Senior Full Stack Developer and create a feature-rich Hotel Booking System that offers a modern user interface, a scalable backend, secure authentication, seamless animation, and live booking processes.
The system should make it easy for users to search for hotels, view the rooms available, check hotel availability, book a hotel, make online payments and get confirmation of bookings via email notifications.

The application should be focused on the following:

High performance
Responsive design
Secure transactions
Interactive user experience
Scalability
Accessibility
Production-level code quality

## Objective

Easily search and filter hotels.
Displays the hotel information, hotel rate, hotel rating, hotel amenity, room gallery and other information.
Dynamically displays available room slots.Provides live room availability.
Allows the users to book and cancel rooms safely.
Supports online payments using Razorpay.
Offers history of bookings and reservation management.
Replies automatically with email confirmations and reminders of appointments.
Uses smooth animations and transitions with Framer Motion.
Uses safe APIs, authentication, validation, and database management.

## UI and Animation Requirements 

Create a Website that allows you to book a hotel with:

Banners that span the whole width on homepage with hotel background images.
Larger search area for location, check-in, check-out dates and guest selection.
Sticky navigation bar with logo, menu items, log in/sign up buttons and mobile hamburger menu.
Hotel cards with hotel image, hotel name, ratings, location, amenities, price per night, and a button to book the hotel.
Responsive design for mobile, tablet and desktop devices.
Round cards, good spacing, legible type and gentle shadow effects.
Click on the hotel cards, buttons and images to get a hover animation.
Making smooth page transitions and scroll-triggered animation with Framer Motion.
Hotel page with image gallery, hotel room preview slideshow, hotel amenities, hotel reviews, and a booking section.
Animated booking form with date picker, guest selection and booking summary.
Fetches while loading skeletons/loading animations.
Notification messages for the success and error caused in the booking, payment and authentication action.
Semantic HTML, ARIA labels, keyboard navigation and SEO-friendly structure.

## Framer Motion Animations 

Smooth page transitions
Scroll-triggered animations
Fade-in / fade-up effect, slide-up effect
Animated hotel cards
Staggered list animations
Show hover interactions for hotel and room card booking.
Authentication/Booking flow modal animations.

## Core Features 

Use secure authentication via:

User registration
Login/logout functionality
JWT authentication
Protected routes
Password hashing
Session management
The Forgot Password and Reset Password function are supported.

Authentication pages must include:
Login and signup forms with clear validation messages
A button to toggle password visibility
animated form transitions
A remember me option
Forgot password functionality
A responsive form design that works on both mobile and desktop devices
A loading state that appears during authentication
Notifications, for success and error messages

## Hotel Search and Discovery

Users should be able to use to:

### Filter by:

Price
Ratings
Amenities
Room type
Availability

### Sort hotels by:

Price
Popularity
Rating

## Hotel Details Page

The following information should be included on each hotel page:

Hotel images gallery
Hotel description
Ratings and reviews
Amenities list
Available rooms
Room pricing
Availability status
Animated image previews

## Booking System

Use a secure reservation workflow:

Check-in and Check-out date selections.
Real-time room availability
Room reservation system
Booking overview page
Summary of the bookings, prior to payment
Cancel booking functionality
The booking history dashboard for users.

The booking workflow should take users through the booking process step-by-step from room selection until they are paid.

Booking UI should include:
 Calendar for selecting check-in and check-out dates
 Guest dropdowns and room dropdowns.
 Instant availability of rooms
 Card summarizing the hotel booking and total nights, total taxes, and total amount.
 When you can confirm booking, there will be a loading animation.
 Success page for successful booking.
 Error message when room is not available or payment is not accepted

## Payment Integration

Use secure online payments with:

Razorpay

The payment process should involve the following:

Secure payment processing
Payment verification
Transaction status handling
Failed payment recovery
Once the payment is successful, it will be displayed as a booking confirmation.

Payment UI  look like:
A Secure payment popup  done using Razorpay
Booking amount should be broken down according to requirement.
Payment processing loader during transaction.
Successful or unsuccessful messages after payments
When successful payment is made, the booking is automatically confirmed.
The transaction ID is visible in the booking history, along with the payment status.

## Email Notification System

Send automated e-mails for:

Booking confirmation
Booking cancellation
Payment confirmation
Reservation updates

Emails should include:

User details
Booking ID
Hotel details
Check-in/check-out dates
Payment status
Timestamp

Use:

Nodemailer or transactional email API
Secure SMTP configuration

## Contact and Support System

Add a “Contact Support”/“Get Help” modal that has:

Name
Email
Phone number
Message

Requirements:

Client side and server side validation
Framer Motion modal animations
Structured JSON responses
The concepts of success and failure states
Provide email alerts to admin/support team

## Backend Requirements

Create secure and scalable APIs with:

Node.js
Express.js or Next.js API Routes.

Implement:

RESTful API architecture
JWT-based authentication
Middleware for authorization
Rate limiting
Request validation
Error handling middleware
Logging system

## Database Requirements

Use PostgreSQL for:

Users
Hotels
Rooms
Reservations
Payments
Booking history
Reviews (optional)

Database requirements:

Proper schema relationships
Optimized queries
Secure transactions
Prevent double booking
Connection pooling

## Validation and Security

Implement strong security practices:

Input sanitization
XSS prevention
SQL injection prevention
Rate limiting
Environment variable protection
Secure password hashing

Validation for:
Email
Phone number
Dates
Payment requests

## Error Handling

Catch and respond to all front and back end errors gracefully:

Loading states
API failure handling
Payment failure states
Booking conflicts
Authentication errors
Validation messages
Structured JSON error responses.

### Example API Response Format:

```json
{
  "success": true,
  The message is: "Booking completed successfully".
}
```

### Error format:

```json
{
  "success": false,
  The response from the server is "message": "Room is no longer available"
}
```

## Performance and Scalability

Optimize system for production:

Lazy-load heavy components
Optimize images
Reduce bundle size
Employ caching as required.
Prevent unnecessary re-renders
Debounce search/filter interactions
Ensure quick responses to queries through APIs.
Make sure it is scalable to high traffic.

## Accessibility and SEO

Ensure:

Semantic HTML
ARIA labels
Keyboard accessibility
Proper contrast ratios
SEO-friendly metadata
Responsive image handling

## Technology Stack

### Frontend

Next.js
React
Tailwind CSS
Framer Motion

### Backend

Node.js
Express.js or Next.js API Routes 
JWT Authentication
Nodemailer

### Database

PostgreSQL

### Payment Gateway

Razorpay

## Documentation Requirements

Provide:

Folder structure explanation
Setup instructions
Environment variable configuration
Database setup guide
API documentation
Deployment steps
Production optimization recommendations

## Expected Output

The system to be delivered should include:

A 100% responsive Hotel Booking System.
Elegant and seamless UI animations.
Provide secure authentication and booking processes.
Real-time reservation management
Online Razorpay payment integration
Automated email notifications
Secure REST APIs
Architecture scalable PostgreSQL database.
Frontend and backend code is developed and ready for production.
Correct validation, security and error handling
