# UniTracker - College Management System

A comprehensive full-stack monorepo integrating 10 different college management modules into a single unified application with role-based access control, built using modern web technologies and RESTful API architecture.

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Architecture](#-architecture)
- [Technology Stack](#-technology-stack)
- [Modules & Backend Implementation](#-modules--backend-implementation)
- [Database Architecture](#-database-architecture)
- [Authentication & Authorization](#-authentication--authorization)
- [API Endpoints](#-api-endpoints)
- [Getting Started](#-getting-started)
- [Development](#-development)
- [Deployment](#-deployment)

---

## 🎯 Project Overview

UniTracker is a monorepo that consolidates 10 separate college management modules into a unified, modern web application. The project follows a **client-server architecture** with a React-based frontend and Express-based backend, connected through RESTful APIs.

### Key Features
- **Unified Authentication**: Single sign-on for all modules using JWT
- **Role-Based Access Control**: Admin, Professor, Student, Canteen Staff, and Bus Staff roles
- **Modular Architecture**: Each module is independently developed but integrated seamlessly
- **Modern UI**: Responsive design using Tailwind CSS and ShadCN UI components
- **RESTful API**: Clean, consistent API design following REST principles
- **Real-time Validation**: Form validation on both client and server sides

---

## 🏛️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Layer                           │
│  (React 18 + Vite + React Router + Tailwind CSS)          │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/REST API
┌─────────────────────────────────────────────────────────────┐
│                   Application Layer                         │
│        (Node.js + Express.js + Middleware)                 │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   Auth       │  │  Business    │  │   Routes     │    │
│  │  Middleware  │→ │   Logic      │→ │  Handlers    │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            ↕ Mongoose ODM
┌─────────────────────────────────────────────────────────────┐
│                    Database Layer                           │
│              (MongoDB - NoSQL Database)                     │
│                                                             │
│   Collections: Users, Courses, Quizzes, Timetables,       │
│   Feedback, LostFound, Projects, GradeAppeals,            │
│   BusRoutes, BusBookings, MenuItems, Bookings             │
└─────────────────────────────────────────────────────────────┘
```

### Project Structure

```
Final-Unitracker/
├── frontend/                      # React Frontend Application
│   ├── src/
│   │   ├── components/            # Reusable UI components
│   │   │   └── ui/               # ShadCN UI components (Button, Card, Input, etc.)
│   │   ├── pages/                # Main pages
│   │   │   ├── Landing.jsx       # Landing page
│   │   │   ├── Auth.jsx          # Login/Signup page
│   │   │   └── Dashboard.jsx     # Main dashboard
│   │   ├── modules/              # Feature modules (each represents a module)
│   │   │   ├── courses/          # Course management UI
│   │   │   ├── feedback/         # Faculty feedback UI
│   │   │   ├── lostFound/        # Lost & Found UI
│   │   │   ├── projects/         # Project submission UI
│   │   │   ├── gradeAppeal/      # Grade appeals UI
│   │   │   ├── timetable/        # Timetable UI
│   │   │   ├── quiz/             # Quiz management UI
│   │   │   ├── bus/              # Bus reservation UI
│   │   │   └── canteen/          # Canteen ordering UI
│   │   ├── utils/
│   │   │   ├── api.js            # Axios API configuration & endpoints
│   │   │   └── AuthContext.jsx   # Authentication context provider
│   │   ├── App.jsx               # Main app with routing
│   │   └── main.jsx              # React entry point
│   ├── vite.config.js            # Vite configuration
│   ├── tailwind.config.js        # Tailwind CSS configuration
│   └── package.json
│
├── backend/                       # Express Backend Application
│   ├── models/                    # Mongoose data models
│   │   ├── User.js               # User model (authentication)
│   │   ├── Course.js             # Course model
│   │   ├── Timetable.js          # Timetable model
│   │   ├── Quiz.js               # Quiz and QuizResult models
│   │   ├── Feedback.js           # Feedback model
│   │   ├── LostFound.js          # Lost & Found items model
│   │   ├── Project.js            # Project submission model
│   │   ├── Bus.js                # Bus routes and bookings models
│   │   ├── GradeAppeal.js        # Grade appeal model
│   │   └── Menu.js               # Canteen menu and bookings
│   ├── routes/                    # API route handlers
│   │   ├── auth.js               # Authentication routes
│   │   ├── courses.js            # Course CRUD operations
│   │   ├── timetable.js          # Timetable management
│   │   ├── quizzes.js            # Quiz CRUD and submissions
│   │   ├── feedback.js           # Feedback submission
│   │   ├── lostFound.js          # Lost & Found operations
│   │   ├── projects.js           # Project submission & approval
│   │   ├── bus.js                # Bus route & booking management
│   │   ├── gradeAppeals.js       # Grade appeal submission & review
│   │   └── canteen.js            # Canteen menu & orders
│   ├── middleware/
│   │   └── auth.js               # JWT verification & role-based middleware
│   ├── server.js                 # Express server entry point
│   ├── seed.js                   # Database seeding script
│   ├── .env.example              # Environment variables template
│   └── package.json
│
└── package.json                   # Root package.json for monorepo scripts
```

---

## 🛠️ Technology Stack

### Frontend Technologies

| Technology | Version | Purpose | Key Concepts Used |
|-----------|---------|---------|-------------------|
| **React** | 18.2.0 | UI Library | Component-based architecture, Hooks (useState, useEffect, useContext), Virtual DOM, Event handling |
| **Vite** | 5.1.0 | Build Tool & Dev Server | Hot Module Replacement (HMR), Fast build times, ES modules |
| **React Router** | 6.22.0 | Client-side Routing | Protected routes, Navigate component, useNavigate hook |
| **Axios** | 1.6.7 | HTTP Client | Interceptors for token injection, Request/response transformation |
| **Tailwind CSS** | 3.4.1 | Styling Framework | Utility-first CSS, Responsive design, JIT compiler |
| **ShadCN UI** | Latest | Component Library | Radix UI primitives, Accessible components, Customizable via Tailwind |
| **React Icons** | 5.0.1 | Icon Library | SVG icons as React components |
| **Recharts** | 2.12.0 | Data Visualization | Chart components for analytics |
| **React Hook Form** | 7.50.0 | Form Management | Controlled forms, Validation, Performance optimization |
| **Zod** | 3.22.4 | Schema Validation | Type-safe form validation |

### Backend Technologies

| Technology | Version | Purpose | Key Concepts Used |
|-----------|---------|---------|-------------------|
| **Node.js** | v16+ | Runtime Environment | Event-driven architecture, Non-blocking I/O, CommonJS/ES modules |
| **Express.js** | 4.18.2 | Web Framework | Middleware pattern, Routing, Request/response handling |
| **MongoDB** | Latest | NoSQL Database | Document-oriented storage, Flexible schemas, Scalability |
| **Mongoose** | 8.0.3 | ODM (Object Document Mapper) | Schema definition, Model creation, Query building, Validation, Middleware hooks |
| **JWT** | 9.0.2 | Authentication | Token-based authentication, Stateless sessions, Payload encryption |
| **bcryptjs** | 2.4.3 | Password Hashing | Salt generation, Hash comparison, One-way encryption |
| **cors** | 2.8.5 | Cross-Origin Resource Sharing | Allow frontend-backend communication |
| **dotenv** | 16.3.1 | Environment Configuration | Environment variable management |
| **nodemon** | 3.0.2 | Development Tool | Auto-restart server on file changes |

### Key Backend Concepts & Patterns Used

1. **RESTful API Design**
   - Resource-based URLs (`/api/courses`, `/api/quizzes`)
   - HTTP methods (GET, POST, PUT, DELETE)
   - Status codes (200, 201, 400, 401, 403, 404, 500)
   - JSON request/response format

2. **Middleware Pattern**
   - Authentication middleware (`authenticateToken`)
   - Authorization middleware (`isAdmin`, `isProfessor`)
   - Error handling middleware
   - CORS middleware

3. **MVC Architecture** (Modified)
   - Models: Mongoose schemas defining data structure
   - Controllers: Route handlers with business logic
   - (Views replaced by React frontend)

4. **JWT Authentication Flow**
   - User login → Server validates credentials
   - Server generates JWT with user payload
   - Token sent to client
   - Client stores token (localStorage)
   - Client sends token in Authorization header
   - Server verifies token on protected routes

5. **Mongoose ODM Concepts**
   - Schema definition with types and validation
   - Model creation and exports
   - CRUD operations (Create, Read, Update, Delete)
   - Population (similar to SQL joins)
   - Timestamps (automatic createdAt/updatedAt)
   - Virtual fields
   - Schema validation

6. **Role-Based Access Control (RBAC)**
   - User roles stored in database
   - Middleware checks user role
   - Routes protected based on role requirements
   - Frontend components conditionally rendered by role

---

## 📦 Modules & Backend Implementation

### Module 1: Authentication System

**Purpose**: Secure user registration, login, and session management

**Backend Implementation**:
- **Model**: `User.js`
  - Fields: name, email, password (hashed), role, status
  - Roles: admin, professor, student, canteen, bus
  - Status: pending, approved, rejected (for admin approval)
- **Concepts Used**:
  - Password hashing with bcrypt (salt rounds: 10)
  - JWT token generation with 24-hour expiry
  - Token payload includes: userId, email, role
- **API Endpoints**:
  - `POST /api/auth/signup` - User registration
  - `POST /api/auth/login` - User authentication
  - `GET /api/auth/me` - Get current user (protected)
  - `GET /api/auth/access-requests` - Get pending users (admin only)
  - `PUT /api/auth/access-requests/:userId` - Approve/reject users (admin only)
- **Security Features**:
  - Passwords never stored in plain text
  - Tokens expire automatically
  - Role-based route protection
  - Admin approval workflow for new users

### Module 2: Course Management

**Purpose**: CRUD operations for academic courses

**Backend Implementation**:
- **Model**: `Course.js`
  - Fields: courseName, courseCode, department, credits, instructor, description
  - Timestamps: createdAt, updatedAt
- **Concepts Used**:
  - Full CRUD implementation
  - Role-based access (admin can create/edit/delete, others read-only)
  - Input validation (required fields)
- **API Endpoints**:
  - `GET /api/courses` - Get all courses (protected)
  - `GET /api/courses/:id` - Get single course (protected)
  - `POST /api/courses` - Create course (admin only)
  - `PUT /api/courses/:id` - Update course (admin only)
  - `DELETE /api/courses/:id` - Delete course (admin only)
- **Business Logic**:
  - Course code must be unique
  - Credits must be positive integer
  - Department field for filtering

### Module 3: Timetable Management

**Purpose**: Create and view class schedules

**Backend Implementation**:
- **Model**: `Timetable.js`
  - Fields: day, timeSlot, subject, classroom, instructor
  - Schema: Array of schedule entries grouped by day
- **Concepts Used**:
  - Nested document structure (days → time slots → classes)
  - Update or insert (upsert) operations
  - Query filtering by user role
- **API Endpoints**:
  - `GET /api/timetable` - Get all timetables (protected)
  - `POST /api/timetable` - Create/update timetable (admin only)
  - `DELETE /api/timetable/:id` - Delete timetable entry (admin only)
- **Business Logic**:
  - Prevent time slot conflicts
  - Admin creates, all users can view
  - Organized by day of week

### Module 4: Quiz Management

**Purpose**: Create quizzes, take quizzes, and track results

**Backend Implementation**:
- **Models**: 
  - `Quiz.js` - Quiz details with questions array
    - Fields: title, description, duration, questions[], createdBy
    - Question structure: questionText, options[], correctAnswer
  - `QuizResult.js` - Student quiz attempts
    - Fields: quizId, userId, answers[], score, completedAt
- **Concepts Used**:
  - Embedded documents (questions in quiz)
  - Referenced documents (quiz-to-user relationship)
  - Score calculation on server side
  - Population to get quiz and user details
- **API Endpoints**:
  - `GET /api/quizzes` - Get all quizzes (protected)
  - `GET /api/quizzes/:id` - Get single quiz (protected)
  - `POST /api/quizzes` - Create quiz (admin/professor only)
  - `PUT /api/quizzes/:id` - Update quiz (admin/professor only)
  - `DELETE /api/quizzes/:id` - Delete quiz (admin/professor only)
  - `POST /api/quizzes/:id/submit` - Submit quiz answers (protected)
  - `GET /api/quizzes/:id/results` - Get user's results (protected)
  - `GET /api/quizzes/results/all` - Get all results (admin only)
- **Business Logic**:
  - Auto-calculate score based on correct answers
  - Store both questions and answers
  - Track completion time
  - Prevent multiple submissions

### Module 5: Faculty Feedback

**Purpose**: Students submit feedback about faculty, admins review

**Backend Implementation**:
- **Model**: `Feedback.js`
  - Fields: facultyName, subject, rating (1-5), comments, submittedBy
  - References: User model for submitter
- **Concepts Used**:
  - Rating system (1-5 scale)
  - Anonymous feedback option
  - Populate submitter details
  - Filtered queries based on role
- **API Endpoints**:
  - `GET /api/feedback` - Get all feedback (admin only)
  - `GET /api/feedback/:id` - Get single feedback (admin only)
  - `POST /api/feedback` - Submit feedback (protected)
- **Business Logic**:
  - Students can only submit
  - Admin can view all feedback
  - Average rating calculation
  - Date-based filtering

### Module 6: Lost & Found

**Purpose**: Report and track lost/found items

**Backend Implementation**:
- **Model**: `LostFound.js`
  - Fields: itemName, description, type (lost/found), location, date, contactInfo, status, reportedBy
  - Type enum: ['lost', 'found']
  - Status enum: ['active', 'claimed', 'returned']
- **Concepts Used**:
  - Enum validation for type and status
  - User ownership tracking
  - Search and filter functionality
  - Status workflow
- **API Endpoints**:
  - `GET /api/lost-found` - Get all items (protected)
  - `GET /api/lost-found/:id` - Get single item (protected)
  - `POST /api/lost-found` - Report item (protected)
  - `PUT /api/lost-found/:id` - Update item (owner only)
  - `DELETE /api/lost-found/:id` - Delete item (owner only)
- **Business Logic**:
  - Users can only edit their own reports
  - Status transitions: active → claimed → returned
  - Search by item name or location
  - Filter by type (lost/found)

### Module 7: Project Submission

**Purpose**: Students submit project ideas, admins approve/reject

**Backend Implementation**:
- **Model**: `Project.js`
  - Fields: title, description, teamMembers[], technologies[], submittedBy, status, adminFeedback
  - Status enum: ['pending', 'approved', 'rejected']
- **Concepts Used**:
  - Array fields (teamMembers, technologies)
  - Approval workflow
  - Admin feedback system
  - Filtered queries by role and status
- **API Endpoints**:
  - `GET /api/projects` - Get projects (filtered by role)
  - `GET /api/projects/:id` - Get single project (protected)
  - `POST /api/projects` - Submit project (protected)
  - `PUT /api/projects/:id/status` - Update status (admin only)
- **Business Logic**:
  - Students see only their projects
  - Admins see all projects
  - Status workflow: pending → approved/rejected
  - Admin can provide feedback with status change

### Module 8: Grade Appeals

**Purpose**: Students appeal grades, admins review and respond

**Backend Implementation**:
- **Model**: `GradeAppeal.js`
  - Fields: studentId, courseName, currentGrade, expectedGrade, reason, status, adminResponse
  - Status enum: ['pending', 'under_review', 'approved', 'rejected']
- **Concepts Used**:
  - Multi-step workflow
  - Two-way communication (student reason, admin response)
  - Population of student details
  - Status-based filtering
- **API Endpoints**:
  - `GET /api/grade-appeals` - Get appeals (filtered by role)
  - `GET /api/grade-appeals/:id` - Get single appeal (protected)
  - `POST /api/grade-appeals` - Submit appeal (protected)
  - `PUT /api/grade-appeals/:id/status` - Update appeal (admin only)
- **Business Logic**:
  - Students see only their appeals
  - Admins see all appeals
  - Multi-step status workflow
  - Admin provides response with decision

### Module 9: Bus Reservation

**Purpose**: Manage bus routes and bookings

**Backend Implementation**:
- **Models**:
  - `BusRoute.js` - Bus route details
    - Fields: routeName, from, to, departureTime, availableSeats, fare
  - `BusBooking.js` - Booking records
    - Fields: routeId, userId, date, seatsBooked, status
    - Status enum: ['confirmed', 'cancelled']
- **Concepts Used**:
  - Relational design (routes and bookings)
  - Seat availability tracking
  - Booking status management
  - Populate route and user details
- **API Endpoints**:
  - `GET /api/bus/routes` - Get all routes (protected)
  - `POST /api/bus/routes` - Create route (admin only)
  - `PUT /api/bus/routes/:id` - Update route (admin only)
  - `DELETE /api/bus/routes/:id` - Delete route (admin only)
  - `GET /api/bus/bookings` - Get bookings (filtered by role)
  - `POST /api/bus/bookings` - Create booking (protected)
  - `DELETE /api/bus/bookings/:id` - Cancel booking (protected)
- **Business Logic**:
  - Check seat availability before booking
  - Update available seats on booking/cancellation
  - Users see only their bookings
  - Admins see all bookings

### Module 10: Canteen Management

**Purpose**: Manage menu items and food orders

**Backend Implementation**:
- **Models**:
  - `MenuItem.js` - Menu items
    - Fields: name, category, price, description, availability
  - `Booking.js` - Food orders
    - Fields: userId, items[], totalPrice, status, orderDate
    - Status enum: ['pending', 'preparing', 'ready', 'delivered']
- **Concepts Used**:
  - Menu item management
  - Order tracking
  - Order status workflow
  - Price calculation
- **API Endpoints**:
  - `GET /api/canteen/menu` - Get menu items (protected)
  - `POST /api/canteen/menu` - Add menu item (admin only)
  - `PUT /api/canteen/menu/:id` - Update menu item (admin only)
  - `DELETE /api/canteen/menu/:id` - Delete menu item (admin only)
  - `GET /api/canteen/booking` - Get orders (filtered by role)
  - `POST /api/canteen/booking` - Create order (protected)
  - `PUT /api/canteen/booking/:id` - Update order status (admin/canteen only)
- **Business Logic**:
  - Menu items have categories (breakfast, lunch, snacks, beverages)
  - Orders go through status workflow
  - Price calculated from menu items
  - Users see their orders, staff see all orders

---

## 🗄️ Database Architecture

### MongoDB Collections

UniTracker uses MongoDB, a NoSQL document database. Each module has one or more collections (tables in SQL terms).

#### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique, lowercase),
  password: String (bcrypt hashed),
  role: Enum['student', 'professor', 'admin', 'canteen', 'bus'],
  status: Enum['pending', 'approved', 'rejected'],
  createdAt: Date,
  updatedAt: Date
}
```

#### Courses Collection
```javascript
{
  _id: ObjectId,
  courseName: String (required),
  courseCode: String (required, unique),
  department: String,
  credits: Number,
  instructor: String,
  description: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### Timetables Collection
```javascript
{
  _id: ObjectId,
  day: String (Monday-Friday),
  timeSlot: String,
  subject: String,
  classroom: String,
  instructor: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### Quizzes Collection
```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String,
  duration: Number (minutes),
  questions: [{
    questionText: String,
    options: [String],
    correctAnswer: Number (index)
  }],
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

#### QuizResults Collection
```javascript
{
  _id: ObjectId,
  quizId: ObjectId (ref: Quiz),
  userId: ObjectId (ref: User),
  answers: [Number],
  score: Number,
  totalQuestions: Number,
  completedAt: Date,
  createdAt: Date
}
```

#### Feedback Collection
```javascript
{
  _id: ObjectId,
  facultyName: String (required),
  subject: String,
  rating: Number (1-5, required),
  comments: String,
  submittedBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

#### LostFound Collection
```javascript
{
  _id: ObjectId,
  itemName: String (required),
  description: String,
  type: Enum['lost', 'found'],
  location: String,
  date: Date,
  contactInfo: String,
  status: Enum['active', 'claimed', 'returned'],
  reportedBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

#### Projects Collection
```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String (required),
  teamMembers: [String],
  technologies: [String],
  submittedBy: ObjectId (ref: User),
  status: Enum['pending', 'approved', 'rejected'],
  adminFeedback: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### GradeAppeals Collection
```javascript
{
  _id: ObjectId,
  studentId: ObjectId (ref: User),
  courseName: String (required),
  currentGrade: String (required),
  expectedGrade: String (required),
  reason: String (required),
  status: Enum['pending', 'under_review', 'approved', 'rejected'],
  adminResponse: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### BusRoutes Collection
```javascript
{
  _id: ObjectId,
  routeName: String (required),
  from: String (required),
  to: String (required),
  departureTime: String (required),
  availableSeats: Number (required),
  fare: Number (required),
  createdAt: Date,
  updatedAt: Date
}
```

#### BusBookings Collection
```javascript
{
  _id: ObjectId,
  route: ObjectId (ref: BusRoute),
  user: ObjectId (ref: User),
  date: Date (required),
  seatsBooked: Number (default: 1),
  status: Enum['confirmed', 'cancelled'],
  createdAt: Date,
  updatedAt: Date
}
```

#### MenuItems Collection (Canteen)
```javascript
{
  _id: ObjectId,
  name: String (required),
  category: String (required),
  price: Number (required),
  description: String,
  availability: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### Bookings Collection (Canteen Orders)
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  items: [{
    menuItem: ObjectId (ref: MenuItem),
    quantity: Number
  }],
  totalPrice: Number,
  status: Enum['pending', 'preparing', 'ready', 'delivered'],
  orderDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Database Relationships

- **Users ↔ Multiple Collections**: User ID is referenced in most collections to track ownership/creation
- **BusRoutes ↔ BusBookings**: One-to-many (one route can have many bookings)
- **Quizzes ↔ QuizResults**: One-to-many (one quiz can have many results)
- **MenuItems ↔ Bookings**: Many-to-many through embedded items array

---

## 🔐 Authentication & Authorization

### JWT (JSON Web Token) Authentication

**How It Works**:

1. **User Registration/Login**:
   ```
   Client → POST /api/auth/signup (name, email, password, role)
   Server → Hash password with bcrypt
   Server → Save user to database
   Server → Return success message
   
   Client → POST /api/auth/login (email, password)
   Server → Find user by email
   Server → Compare password with bcrypt
   Server → Generate JWT token
   Server → Return token + user data
   ```

2. **JWT Token Structure**:
   ```javascript
   {
     header: { alg: 'HS256', typ: 'JWT' },
     payload: {
       userId: '507f1f77bcf86cd799439011',
       email: 'student@unitracker.com',
       role: 'student',
       iat: 1609459200,  // Issued at
       exp: 1609545600   // Expires in 24 hours
     },
     signature: 'encrypted_signature'
   }
   ```

3. **Token Storage & Usage**:
   ```
   Client → Receives token
   Client → Stores in localStorage
   Client → Sends token in Authorization header for protected routes
   
   Request Header:
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

4. **Token Verification**:
   ```javascript
   // Middleware: authenticateToken
   Server → Extract token from Authorization header
   Server → Verify token with JWT secret
   Server → Decode payload
   Server → Attach user data to request object
   Server → Call next() to proceed
   ```

### Role-Based Access Control (RBAC)

**Authorization Middleware**:

```javascript
// authenticateToken - Verifies JWT token
export const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'No token' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // { userId, email, role }
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Invalid token' });
  }
};

// isAdmin - Checks if user is admin
export const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Admin only' });
  }
  next();
};

// isProfessor - Checks if user is professor or admin
export const isProfessor = (req, res, next) => {
  if (req.user.role !== 'professor' && req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Professor or Admin only' });
  }
  next();
};
```

**Route Protection Examples**:

```javascript
// Public route - no authentication
router.post('/signup', signupHandler);

// Protected route - authentication required
router.get('/courses', authenticateToken, getCourses);

// Admin-only route - authentication + admin role
router.post('/courses', authenticateToken, isAdmin, createCourse);

// Professor or Admin route
router.post('/quizzes', authenticateToken, isProfessor, createQuiz);
```

**Role Permissions Matrix**:

| Feature | Admin | Professor | Student | Canteen | Bus |
|---------|-------|-----------|---------|---------|-----|
| View Courses | ✅ | ✅ | ✅ | ❌ | ❌ |
| Create/Edit Courses | ✅ | ❌ | ❌ | ❌ | ❌ |
| Create Quizzes | ✅ | ✅ | ❌ | ❌ | ❌ |
| Take Quizzes | ✅ | ✅ | ✅ | ❌ | ❌ |
| View All Feedback | ✅ | ❌ | ❌ | ❌ | ❌ |
| Submit Feedback | ❌ | ❌ | ✅ | ❌ | ❌ |
| Approve Projects | ✅ | ❌ | ❌ | ❌ | ❌ |
| Submit Projects | ❌ | ❌ | ✅ | ❌ | ❌ |
| Manage Bus Routes | ✅ | ❌ | ❌ | ❌ | ❌ |
| Book Bus Tickets | ✅ | ✅ | ✅ | ❌ | ✅ |
| Manage Canteen Menu | ✅ | ❌ | ❌ | ✅ | ❌ |
| Order Food | ✅ | ✅ | ✅ | ✅ | ❌ |

---

## 📡 API Endpoints

All API endpoints are prefixed with `/api` and return JSON responses.

### Authentication Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/api/auth/signup` | ❌ | - | Register new user |
| POST | `/api/auth/login` | ❌ | - | Login user |
| GET | `/api/auth/me` | ✅ | All | Get current user |
| GET | `/api/auth/access-requests` | ✅ | Admin | Get pending access requests |
| PUT | `/api/auth/access-requests/:id` | ✅ | Admin | Approve/reject user |

### Course Management Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/api/courses` | ✅ | All | Get all courses |
| GET | `/api/courses/:id` | ✅ | All | Get single course |
| POST | `/api/courses` | ✅ | Admin | Create course |
| PUT | `/api/courses/:id` | ✅ | Admin | Update course |
| DELETE | `/api/courses/:id` | ✅ | Admin | Delete course |

### Timetable Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/api/timetable` | ✅ | All | Get all timetables |
| POST | `/api/timetable` | ✅ | Admin | Create/update timetable |
| DELETE | `/api/timetable/:id` | ✅ | Admin | Delete timetable |

### Quiz Management Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/api/quizzes` | ✅ | All | Get all quizzes |
| GET | `/api/quizzes/:id` | ✅ | All | Get single quiz |
| POST | `/api/quizzes` | ✅ | Admin/Prof | Create quiz |
| PUT | `/api/quizzes/:id` | ✅ | Admin/Prof | Update quiz |
| DELETE | `/api/quizzes/:id` | ✅ | Admin/Prof | Delete quiz |
| POST | `/api/quizzes/:id/submit` | ✅ | All | Submit quiz answers |
| GET | `/api/quizzes/:id/results` | ✅ | All | Get user's results |
| GET | `/api/quizzes/results/all` | ✅ | Admin | Get all results |

### Faculty Feedback Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/api/feedback` | ✅ | Admin | Get all feedback |
| GET | `/api/feedback/:id` | ✅ | Admin | Get single feedback |
| POST | `/api/feedback` | ✅ | Student | Submit feedback |

### Lost & Found Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/api/lost-found` | ✅ | All | Get all items |
| GET | `/api/lost-found/:id` | ✅ | All | Get single item |
| POST | `/api/lost-found` | ✅ | All | Report item |
| PUT | `/api/lost-found/:id` | ✅ | Owner | Update item |
| DELETE | `/api/lost-found/:id` | ✅ | Owner | Delete item |

### Project Submission Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/api/projects` | ✅ | All | Get projects (filtered) |
| GET | `/api/projects/:id` | ✅ | All | Get single project |
| POST | `/api/projects` | ✅ | Student | Submit project |
| PUT | `/api/projects/:id/status` | ✅ | Admin | Update project status |

### Bus Reservation Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/api/bus/routes` | ✅ | All | Get all routes |
| POST | `/api/bus/routes` | ✅ | Admin | Create route |
| PUT | `/api/bus/routes/:id` | ✅ | Admin | Update route |
| DELETE | `/api/bus/routes/:id` | ✅ | Admin | Delete route |
| GET | `/api/bus/bookings` | ✅ | All | Get bookings (filtered) |
| POST | `/api/bus/bookings` | ✅ | All | Create booking |
| DELETE | `/api/bus/bookings/:id` | ✅ | Owner | Cancel booking |

### Grade Appeal Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/api/grade-appeals` | ✅ | All | Get appeals (filtered) |
| GET | `/api/grade-appeals/:id` | ✅ | All | Get single appeal |
| POST | `/api/grade-appeals` | ✅ | Student | Submit appeal |
| PUT | `/api/grade-appeals/:id/status` | ✅ | Admin | Update appeal status |

### Canteen Management Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/api/canteen/menu` | ✅ | All | Get menu items |
| POST | `/api/canteen/menu` | ✅ | Admin | Add menu item |
| PUT | `/api/canteen/menu/:id` | ✅ | Admin | Update menu item |
| DELETE | `/api/canteen/menu/:id` | ✅ | Admin | Delete menu item |
| GET | `/api/canteen/booking` | ✅ | All | Get orders (filtered) |
| POST | `/api/canteen/booking` | ✅ | All | Create order |
| PUT | `/api/canteen/booking/:id` | ✅ | Admin/Canteen | Update order |
| DELETE | `/api/canteen/booking/:id` | ✅ | Owner | Cancel order |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v16 or higher
- **MongoDB** (local installation or MongoDB Atlas account)
- **npm** or **yarn** package manager
- **Git** for version control

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/manumittu/Final-Unitracker.git
   cd Final-Unitracker
   ```

2. **Install all dependencies**:
   ```bash
   # Option 1: Install all at once (recommended)
   npm run install:all
   
   # Option 2: Install separately
   npm install              # Root dependencies
   cd frontend && npm install   # Frontend dependencies
   cd ../backend && npm install # Backend dependencies
   ```

3. **Configure environment variables**:
   ```bash
   cd backend
   cp .env.example .env
   nano .env  # Edit with your values
   ```
   
   Required environment variables:
   ```env
   PORT=5001
   MONGODB_URI=mongodb://localhost:27017/unitracker
   # OR for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/unitracker
   JWT_SECRET=your-super-secret-key-change-this-in-production
   NODE_ENV=development
   ```

4. **Start MongoDB** (if using local):
   ```bash
   # On macOS/Linux
   mongod
   
   # On Windows
   "C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe"
   
   # Or use MongoDB Atlas (cloud) - no local installation needed
   ```

5. **Seed the database** (optional but recommended):
   ```bash
   npm run seed
   ```
   
   This creates:
   - 3 test users (admin, student, professor) with password: `password123`
   - 5 sample courses
   - 3 bus routes
   - 4 sample quizzes with questions:
     - Introduction to Computer Science (5 questions)
     - Mathematics Fundamentals (6 questions)
     - General Knowledge Quiz (7 questions)
     - Physics Basics (5 questions)

6. **Start the application**:
   ```bash
   # From root directory - starts both frontend and backend
   npm run dev
   ```
   
   Or run separately:
   ```bash
   # Terminal 1: Backend
   cd backend && npm run dev
   
   # Terminal 2: Frontend
   cd frontend && npm run dev
   ```

7. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001
   - API Health Check: http://localhost:5001/api

### Default User Credentials (After Seeding)

| Role | Email | Password | Access |
|------|-------|----------|--------|
| Admin | admin@unitracker.com | password123 | Full access to all modules |
| Student | student@unitracker.com | password123 | Limited access (view/submit) |
| Professor | professor@unitracker.com | password123 | Teaching capabilities |

---

## 💻 Development

### Available Scripts

**Root Directory**:
```bash
npm run dev              # Start frontend + backend concurrently
npm run install:all      # Install all dependencies
npm run seed             # Seed database with sample data
npm run build            # Build frontend for production
```

**Frontend Directory** (`/frontend`):
```bash
npm run dev              # Start Vite dev server (port 3000)
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint
```

**Backend Directory** (`/backend`):
```bash
npm run dev              # Start with nodemon (auto-restart)
npm start                # Start in production mode
npm run seed             # Seed database
```

### Adding a New Module

To add a new module to UniTracker, follow these steps:

1. **Create Mongoose Model** (`backend/models/YourModule.js`):
   ```javascript
   import mongoose from 'mongoose';
   
   const schema = new mongoose.Schema({
     field1: { type: String, required: true },
     // ... other fields
   }, { timestamps: true });
   
   export default mongoose.model('YourModule', schema);
   ```

2. **Create API Routes** (`backend/routes/yourModule.js`):
   ```javascript
   import express from 'express';
   import YourModule from '../models/YourModule.js';
   import { authenticateToken, isAdmin } from '../middleware/auth.js';
   
   const router = express.Router();
   
   router.get('/', authenticateToken, async (req, res) => {
     // Handle GET request
   });
   
   export default router;
   ```

3. **Register Routes** in `backend/server.js`:
   ```javascript
   import yourModuleRoutes from './routes/yourModule.js';
   app.use('/api/your-module', yourModuleRoutes);
   ```

4. **Create Frontend API Functions** in `frontend/src/utils/api.js`:
   ```javascript
   export const yourModuleAPI = {
     getAll: () => api.get('/your-module'),
     create: (data) => api.post('/your-module', data),
   };
   ```

5. **Create React Component** in `frontend/src/modules/yourModule/`:
   ```javascript
   import React, { useState, useEffect } from 'react';
   import ModuleLayout from '../../components/ModuleLayout';
   import { yourModuleAPI } from '../../utils/api';
   
   const YourModule = () => {
     // Component logic
   };
   ```

6. **Add Route** in `frontend/src/App.jsx`:
   ```javascript
   <Route path="/your-module" element={<YourModule />} />
   ```

7. **Add Module Card** to Dashboard (`frontend/src/pages/Dashboard.jsx`)

### Development Best Practices

- ✅ Always use environment variables for sensitive data
- ✅ Implement error handling in all routes
- ✅ Validate input on both client and server
- ✅ Use loading states in React components
- ✅ Follow RESTful API conventions
- ✅ Write meaningful commit messages
- ✅ Test API endpoints before frontend integration
- ✅ Use meaningful variable and function names
- ✅ Keep components small and focused
- ✅ Avoid hardcoding values

### Code Style

- **JavaScript**: ES6+ syntax, arrow functions, async/await
- **React**: Functional components with hooks
- **CSS**: Tailwind utility classes
- **Naming**: camelCase for variables, PascalCase for components
- **Formatting**: 2 spaces indentation, single quotes

---

## 🌐 Deployment

### Two-Part Deployment Architecture

UniTracker requires separate deployment of frontend and backend:

1. **Frontend** → Static hosting (GitHub Pages, Netlify, Vercel)
2. **Backend** → Node.js hosting (Render, Railway, Heroku)
3. **Database** → MongoDB Atlas (cloud)

### Frontend Deployment (GitHub Pages)

1. **Build the frontend**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Configure GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: Deploy from branch `main`
   - Folder: `/docs`
   - Save

3. **Update API URL**:
   ```javascript
   // frontend/src/utils/api.js
   const API_BASE_URL = 'https://your-backend-url.onrender.com/api';
   ```

4. **Access**:
   - Your site: `https://username.github.io/Final-Unitracker/`

### Backend Deployment (Render)

1. **Create Render account**: https://render.com

2. **Create Web Service**:
   - Connect GitHub repository
   - Root directory: `backend`
   - Build command: `npm install`
   - Start command: `npm start`

3. **Environment Variables**:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/unitracker
   JWT_SECRET=production-secret-key-change-this
   NODE_ENV=production
   PORT=5001
   ```

4. **Deploy**: Render will auto-deploy on every push to main branch

### Database Setup (MongoDB Atlas)

1. **Create MongoDB Atlas account**: https://www.mongodb.com/cloud/atlas

2. **Create Cluster**:
   - Choose free tier (M0)
   - Select region closest to your backend

3. **Create Database User**:
   - Username and password
   - Note credentials for connection string

4. **Configure Network Access**:
   - Add IP: `0.0.0.0/0` (allow from anywhere)

5. **Get Connection String**:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/unitracker?retryWrites=true&w=majority
   ```

6. **Update Backend `.env`**:
   ```env
   MONGODB_URI=<your-connection-string>
   ```

### Deployment Checklist

#### Backend
- ✅ Environment variables configured
- ✅ MongoDB Atlas connection string
- ✅ JWT secret set (different from development)
- ✅ CORS configured for frontend domain
- ✅ Error logging enabled
- ⚠️ Rate limiting (recommended)
- ⚠️ API monitoring (optional)

#### Frontend
- ✅ Build successful
- ✅ API URL points to production backend
- ✅ Environment variables set
- ✅ 404 page configured
- ⚠️ Analytics (optional)
- ⚠️ PWA support (optional)

#### Database
- ✅ Backup strategy
- ✅ Indexes created for performance
- ✅ Connection pooling configured
- ⚠️ Monitoring alerts

### Post-Deployment Testing

1. **Test Authentication**:
   - Signup new user
   - Login with credentials
   - Verify token persistence

2. **Test Each Module**:
   - Create, read, update, delete operations
   - Role-based access restrictions
   - Error handling

3. **Performance Testing**:
   - Page load times
   - API response times
   - Database query performance

---

## 🎓 Key Concepts Summary

### Backend Concepts Implemented

1. **RESTful API Design**
   - Resource-based URLs
   - HTTP methods (GET, POST, PUT, DELETE)
   - Status codes
   - JSON format

2. **Authentication & Authorization**
   - JWT token-based authentication
   - Password hashing with bcrypt
   - Role-based access control
   - Middleware pattern for auth

3. **Database Design**
   - NoSQL document model
   - Mongoose ODM
   - Schema validation
   - Referenced relationships

4. **Middleware Pattern**
   - Request/response pipeline
   - Authentication middleware
   - Authorization middleware
   - Error handling middleware

5. **Async/Await Pattern**
   - Promise-based async operations
   - Try-catch error handling
   - Non-blocking I/O

6. **CORS (Cross-Origin Resource Sharing)**
   - Allow frontend-backend communication
   - Security headers

7. **Environment Configuration**
   - dotenv for environment variables
   - Different configs for dev/prod

### Module Integration Approach

Each module follows the same integration pattern:
1. Database model (Mongoose schema)
2. API routes (Express router)
3. Middleware protection (JWT + role-based)
4. Frontend API calls (Axios)
5. React components (UI)
6. Dashboard integration (module cards)

This consistent pattern makes the codebase:
- **Scalable**: Easy to add new modules
- **Maintainable**: Clear structure and separation of concerns
- **Testable**: Each layer can be tested independently
- **Secure**: Authentication/authorization at every level

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Manu Mittu**
- GitHub: [@manumittu](https://github.com/manumittu)
- Repository: [Final-Unitracker](https://github.com/manumittu/Final-Unitracker)

---

## 🙏 Acknowledgments

- **React Team** - For the excellent UI library
- **Express Team** - For the minimal and flexible web framework
- **MongoDB** - For the scalable NoSQL database
- **ShadCN UI** - For beautiful, accessible components
- **Tailwind CSS** - For the utility-first CSS framework

---

## 📞 Support

For support, questions, or contributions:
- Open an issue on GitHub
- Email: support@unitracker.com

---

**Note**: This project integrates 10 separate modules into a unified monorepo with consistent architecture, modern tech stack, and comprehensive backend implementation following industry best practices.
