# FixItNow 🔧

### Your Trusted Home Service Platform

FixItNow is a backend API for a home services marketplace that connects customers with skilled technicians for on-demand home services such as plumbing, electrical work, cleaning, painting, and more.

The platform provides secure authentication, role-based authorization, service discovery, technician availability management, booking workflows, payment processing, reviews, filtering, and administrative management.

---

## 🚀 Features

### 🔐 Authentication & Authorization

* Customer and Technician registration
* JWT-based authentication
* Access and Refresh Token support
* Authenticated user profile
* Role-based access control
* User ban/unban management
* Protected routes with authentication middleware

### 👤 Customer

* Browse service categories
* Browse available services
* Search and filter services
* Find available technicians
* Filter technicians by:

  * Location
  * Minimum rating
  * Maximum hourly rate
  * Minimum experience
* View technician profiles
* Create service bookings
* Track booking status
* Cancel eligible bookings
* Make payments after booking acceptance
* View payment history
* Submit reviews after completed bookings

### 🛠️ Technician

* Technician profile management
* Add skills, experience, bio, and hourly rate
* Manage availability slots
* Prevent overlapping availability slots
* View pending bookings
* Manage booking status
* Accept bookings
* Start jobs
* Complete jobs
* Automatically maintain average rating from customer reviews

### 👑 Admin

* View all users
* Ban/unban users
* View all platform bookings
* Filter bookings
* View service categories
* Create service categories

### 💳 Payment

* SSLCommerz payment integration
* Payment initialization
* Payment success callback
* Payment failure callback
* Payment status tracking
* Transaction ID management
* Payment history
* Payment verification
* Booking status update after successful payment

### ⭐ Review & Rating

* Customers can review completed bookings
* Rating from 1–5
* One review per booking
* Technician average rating is automatically recalculated

### 🔎 Filtering & Pagination

Services and technicians support filtering such as:

* Category
* Location
* Minimum rating
* Maximum price/rate
* Minimum experience

Admin booking management supports:

* Booking status
* Customer
* Technician
* Service
* Date range
* Pagination

---

# 🏗️ Architecture

FixItNow follows a modular backend architecture.

```text
    📁src
        └── 📁config
            ├── env.ts
            ├── prisma.ts
        └── 📁core
            └── 📁error
                ├── appError.ts
                ├── globalErrorHandler.ts
                ├── handlePrismaError.ts
                ├── handleZodError.ts
            └── 📁middleware
                ├── authentication.ts
                ├── validator.middleware.ts
            └── 📁utils
                ├── catchAsync.ts
                ├── getExistingUser.ts
                ├── jwt.ts
                ├── response.ts
                ├── setCookie.ts
                ├── sslComarcePayment.ts
        └── 📁modules
            └── 📁admin
                ├── admin.controller.ts
                ├── admin.route.ts
                ├── admin.service.ts
                ├── userStatus.validator.ts
            └── 📁auth
                ├── auth.controller.ts
                ├── auth.interface.ts
                ├── auth.route.ts
                ├── auth.service.ts
                ├── auth.validator.ts
            └── 📁booking
                ├── booking.controller.ts
                ├── booking.route.ts
                ├── booking.service.ts
                ├── booking.validator.ts
            └── 📁category
                ├── category.controller.ts
                ├── category.route.ts
                ├── category.service.ts
                ├── category.validator.ts
            └── 📁payment
                ├── payment.controller.ts
                ├── payment.route.ts
                ├── payment.service.ts
                ├── payment.validator.ts
            └── 📁review
                ├── review.controller.ts
                ├── review.interface.ts
                ├── review.route.ts
                ├── review.service.ts
                ├── review.validation.ts
            └── 📁service
                ├── service.controller.ts
                ├── service.route.ts
                ├── service.service.ts
                ├── service.validation.ts
            └── 📁technician
                ├── technician.controller.ts
                ├── technician.route.ts
                ├── technician.service.ts
                ├── technician.validator.ts
        └── 📁types
            ├── appError.type.ts
            ├── auth.ts
            ├── express.d.ts
            ├── jwt.ts
            ├── sendResponse.ts
        ├── app.ts
        ├── needSeed.ts
        ├── seed.ts
        ├── server.ts
    ├── .env
    ├── .gitignore
    ├── .vercelignore
    ├── package-lock.json
    ├── package.json
    ├── prisma.config.ts
    ├── tsconfig.json
    ├── tsup.config.ts
    └── vercel.json
```

Each module follows separation of responsibilities:

```text
Route
  ↓
Controller
  ↓
Service
  ↓
Prisma
  ↓
PostgreSQL
```

Validation and authentication are handled through reusable middleware.

---

# 🛠️ Tech Stack

| Technology | Purpose                       |
| ---------- | ----------------------------- |
| Node.js    | Runtime                       |
| TypeScript | Type-safe development         |
| Express.js | REST API framework            |
| PostgreSQL | Relational database           |
| Prisma ORM | Database access & type safety |
| Zod        | Request validation            |
| JWT        | Authentication                |
| bcrypt     | Password hashing              |
| SSLCommerz | Payment gateway               |
| tsup       | Production build              |
| Vercel     | Deployment                    |

---

# 🗄️ Database Design

The application uses PostgreSQL with Prisma ORM.

### Main Models

```text
└── 📁schema
            ├── availabilitySlot.prisma
            ├── booking.prisma
            ├── category.prisma
            ├── enum.prisma
            ├── payment.prisma
            ├── review.prisma
            ├── schema.prisma
            ├── service.prisma
            ├── technician.prisma
            ├── user.prisma
```

### Core Entities

* `User`
* `TechnicianProfile`
* `Category`
* `Service`
* `AvailabilitySlot`
* `Booking`
* `Payment`
* `Review`

---

# 🔄 Booking Flow

```text
Customer
   │
   ▼
Browse Services
   │
   ▼
Select Technician
   │
   ▼
Create Booking
   │
   ▼
PENDING
   │
   ├───────────────┐
   │               │
   ▼               ▼
ACCEPTED        CANCELLED
   │
   ▼
Payment
   │
   ▼
PAID
   │
   ▼
IN_PROGRESS
   │
   ▼
COMPLETED
   │
   ▼
Customer Review
```

Technicians cannot be double-booked for the same time slot, and availability is checked before creating a booking.

---

# 🔐 Role Permissions

| Feature                    | Customer | Technician | Admin |
| -------------------------- | :------: | :--------: | :---: |
| Register/Login             |     ✅    |      ✅     |   —   |
| View Services              |     ✅    |      ✅     |   ✅   |
| View Technicians           |     ✅    |      ✅     |   ✅   |
| Create Booking             |     ✅    |      ❌     |   ❌   |
| Manage Own Bookings        |     ✅    |      ❌     |   ❌   |
| Manage Availability        |     ❌    |      ✅     |   ❌   |
| Manage Technician Bookings |     ❌    |      ✅     |   ❌   |
| Create Services            |     ❌    |      ✅     |   ❌   |
| Create Categories          |     ❌    |      ❌     |   ✅   |
| Manage Users               |     ❌    |      ❌     |   ✅   |
| Manage User Status         |     ❌    |      ❌     |   ✅   |
| View All Bookings          |     ❌    |      ❌     |   ✅   |
| Create Review              |     ✅    |      ❌     |   ❌   |
| Make Payment               |     ✅    |      ❌     |   ❌   |

---

# 📡 API

### Base URL

```text
/api/v1
```

### Authentication

Protected endpoints require:

```http
Authorization: Bearer <accessToken>
```

### Main API Modules

| Module     | Endpoints |
| ---------- | --------: |
| Auth       |         3 |
| Admin      |         4 |
| Booking    |         4 |
| Category   |         2 |
| Services   |         2 |
| Technician |         6 |
| Review     |         1 |
| Payment    |         5 |
| **Total**  |    **27** |

### API Documentation

Full API documentation and request/response examples are available through Postman:

**Postman Documentation:**
https://documenter.getpostman.com/view/45059890/2sBYAsysNh

---

# 📋 Important API Examples

### Authentication

```http
POST /api/v1/auth/register
POST /api/v1/auth/login
GET  /api/v1/auth/me
```

### Services

```http
GET  /api/v1/services/
POST /api/v1/services/
```

### Technicians

```http
GET /api/v1/technician/
GET /api/v1/technician/:id
POST /api/v1/technician/
PUT /api/v1/technician/update-profile
GET /api/v1/technician/pending-booking
POST /api/v1/technician/update-booking/:id
```

### Bookings

```http
POST /api/v1/booking/
GET  /api/v1/booking/
GET  /api/v1/booking/:id
POST /api/v1/booking/cancel/:id
```

### Payments

```http
POST /api/v1/payment/
POST /api/v1/payment/success
POST /api/v1/payment/fail
GET  /api/v1/payment/
GET  /api/v1/payment/:id
```

---

# ⚙️ Environment Variables

Create a `.env` file locally:

```env
NODE_ENV=DEVELOPMENT

PORT=3000

DATABASE_URL="postgresql://..."

JWT_ACCESS_SECRET="your-access-secret"
JWT_REFRESH_SECRET="your-refresh-secret"

JWT_ACCESS_EXPIRES_IN="1d"
JWT_REFRESH_EXPIRES_IN="7d"

BCRYPT_SALT_ROUNDS=10

DEV_APP_URL="http://localhost:3000"
PROD_APP_URL="https://your-production-domain.com"

Sandbox_API_URL="..."
Live_API_URL="..."

store_id="..."
store_passwd="..."

is_live=false

success_url="..."
fail_url="..."
cancel_url="..."
ipn_url="..."
```

> Never commit `.env` or production secrets to GitHub.

---

# 📦 Installation

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd Home-Service-Platform-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create:

```text
.env
```

and add the required environment variables.

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Run database migrations

```bash
npx prisma migrate dev
```

### 6. Start development server

```bash
npm run dev
```

The API will be available at:

```text
http://localhost:3000
```

---

# 🏭 Production Build

Generate Prisma Client and build the application:

```bash
npm run build
```

Run the production build:

```bash
npm start
```

Recommended build flow:

```text
Prisma Generate
      ↓
TypeScript Build
      ↓
tsup
      ↓
dist/server.js
```

---

# 🌱 Database Seeding

The project includes seed data for development and testing.

Example seed structure:

```text
Users
├── Customers
└── Technicians

Categories
Services
Availability Slots
Bookings
Reviews
Payments
```

Seed data can be used to test filtering, pagination, booking workflows, reviews, ratings, and payment-related functionality.

---

# 🧪 Testing

The API can be tested using Postman.

Recommended testing flow:

```text
1. Register Customer
2. Register Technician
3. Login
4. Get Categories
5. Get Services
6. Get Technicians
7. Create Availability
8. Create Booking
9. Technician Accepts Booking
10. Initialize Payment
11. Complete Payment
12. Booking → IN_PROGRESS
13. Booking → COMPLETED
14. Customer Creates Review
15. Verify Technician Average Rating
```

---

# 🚀 Deployment

The application is deployable as a Node.js API on Vercel.

Production environment variables must be configured in the hosting platform.

Important production variables include:

```text
DATABASE_URL
JWT_ACCESS_SECRET
JWT_REFRESH_SECRET
JWT_ACCESS_EXPIRES_IN
JWT_REFRESH_EXPIRES_IN
NODE_ENV
PROD_APP_URL
SSLCommerz configuration
```

---

# 🔒 Security

The backend implements several security practices:

* Password hashing with bcrypt
* JWT authentication
* Role-based authorization
* Protected routes
* Request validation with Zod
* Centralized error handling
* Environment-based secrets
* Database constraints
* Unique transaction IDs
* Unique booking reviews
* Booking ownership validation
* Payment verification

---

# 📊 Project Highlights

Some of the backend concepts implemented in this project:

* RESTful API design
* Modular architecture
* JWT authentication
* Role-based authorization
* PostgreSQL relational modeling
* Prisma ORM
* Database transactions
* Query filtering
* Pagination
* Aggregate queries
* Average rating calculation
* Booking conflict detection
* Availability validation
* Payment gateway integration
* Centralized error handling
* Request validation
* Production deployment
* API documentation

---

# 🗺️ Future Improvements

Potential improvements for future versions:

* Stripe integration
* Technician search optimization
* Redis caching
* Full-text search
* Notification system
* Email/SMS notifications
* Real-time booking updates
* Advanced admin dashboard
* Technician verification workflow
* Review moderation
* Rate limiting
* API response caching
* Automated integration testing
* Docker-based deployment
* Background job processing

---

# 👨‍💻 Author

**Rakib**

Full-Stack Developer focused on Backend Engineering, scalable APIs, database architecture, and system design.

---

## 📄 License

This project is developed for educational and portfolio purposes.
