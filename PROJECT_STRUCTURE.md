# UniTracker Project Structure

## Directory Tree

```
Final-Unitracker/
├── 📄 README.md                      # Main project documentation
├── 📄 SETUP.md                       # Detailed setup instructions
├── 📄 CONTRIBUTING.md                # Guide for adding modules
├── 📄 IMPLEMENTATION_SUMMARY.md      # Complete project overview
├── 📄 .gitignore                     # Git ignore rules
├── 📦 package.json                   # Root package configuration
│
├── 📁 frontend/                      # React + Vite Frontend
│   ├── 📦 package.json              # Frontend dependencies
│   ├── ⚙️  vite.config.js           # Vite configuration
│   ├── ⚙️  tailwind.config.js       # Tailwind CSS config
│   ├── ⚙️  postcss.config.js        # PostCSS config
│   ├── 📄 index.html                # HTML entry point
│   │
│   └── 📁 src/
│       ├── 📄 main.jsx              # React entry point
│       ├── 📄 App.jsx               # Main app with routing
│       ├── 🎨 index.css             # Global styles
│       │
│       ├── 📁 components/           # Reusable components
│       │   ├── 📄 ModuleLayout.jsx  # Shared layout for modules
│       │   └── 📁 ui/               # ShadCN UI components
│       │       ├── 📄 button.jsx
│       │       ├── 📄 card.jsx
│       │       ├── 📄 input.jsx
│       │       └── 📄 label.jsx
│       │
│       ├── 📁 pages/                # Main pages
│       │   ├── 📄 LandingPage.jsx   # Landing page
│       │   ├── 📄 AuthPage.jsx      # Login/Signup
│       │   └── 📄 DashboardPage.jsx # Dashboard
│       │
│       ├── 📁 modules/              # Feature modules (5 complete)
│       │   ├── 📁 courses/          # ✅ Course management
│       │   │   └── 📄 CoursesModule.jsx
│       │   ├── 📁 lostFound/        # ✅ Lost & Found
│       │   │   └── 📄 LostFoundModule.jsx
│       │   ├── 📁 feedback/         # ✅ Faculty Feedback
│       │   │   └── 📄 FeedbackModule.jsx
│       │   ├── 📁 projects/         # ✅ Project Ideas
│       │   │   └── 📄 ProjectsModule.jsx
│       │   ├── 📁 gradeAppeal/      # ✅ Grade Appeals
│       │   │   └── 📄 GradeAppealModule.jsx
│       │   ├── 📁 timetable/        # 🚧 API ready
│       │   ├── 📁 quiz/             # 🚧 API ready
│       │   └── 📁 bus/              # 🚧 API ready
│       │
│       ├── 📁 utils/                # Utility functions
│       │   ├── 📄 api.js            # API calls (Axios)
│       │   └── 📄 AuthContext.jsx   # Auth context
│       │
│       ├── 📁 hooks/                # Custom React hooks
│       └── 📁 lib/                  # Library utilities
│           └── 📄 utils.js          # Helper functions
│
├── 📁 backend/                       # Express + MongoDB Backend
│   ├── 📦 package.json              # Backend dependencies
│   ├── ⚙️  .env.example             # Environment template
│   ├── 📄 server.js                 # Express server entry
│   ├── 📄 seed.js                   # Database seeding
│   │
│   ├── 📁 models/                   # Mongoose models (9 models)
│   │   ├── 📄 User.js               # User authentication
│   │   ├── 📄 Course.js             # Courses
│   │   ├── 📄 Timetable.js          # Timetables
│   │   ├── 📄 Quiz.js               # Quizzes & Results
│   │   ├── 📄 Feedback.js           # Faculty Feedback
│   │   ├── 📄 LostFound.js          # Lost & Found items
│   │   ├── 📄 Project.js            # Project submissions
│   │   ├── 📄 Bus.js                # Bus routes & bookings
│   │   └── 📄 GradeAppeal.js        # Grade appeals
│   │
│   ├── 📁 routes/                   # API routes (9 route files)
│   │   ├── 📄 auth.js               # Authentication
│   │   ├── 📄 courses.js            # Course CRUD
│   │   ├── 📄 timetable.js          # Timetable management
│   │   ├── 📄 quizzes.js            # Quiz management
│   │   ├── 📄 feedback.js           # Feedback submission
│   │   ├── 📄 lostFound.js          # Lost & Found
│   │   ├── 📄 projects.js           # Project ideas
│   │   ├── 📄 bus.js                # Bus reservations
│   │   └── 📄 gradeAppeals.js       # Grade appeals
│   │
│   ├── 📁 middleware/               # Express middleware
│   │   └── 📄 auth.js               # JWT authentication
│   │
│   └── 📁 config/                   # Configuration files
│
└── 📁 [Original Modules]/           # Original separate modules
    ├── 📁 college-management/       # Original landing + auth
    ├── 📁 course-crud/              # Original course module
    ├── 📁 College_Timetable_Management_System/
    ├── 📁 Quiz_Management_Module/
    ├── 📁 faculty-feedback/
    ├── 📁 lost-and-found-app/
    ├── 📁 project-idea-submission/
    ├── 📁 bus-reservation-final/
    └── 📁 grade-appeal-final/
```

## Module Status Legend

- ✅ **Complete**: Fully implemented with frontend UI and backend API
- 🚧 **API Ready**: Backend complete, frontend UI pending
- 📦 **Original**: Original separate module (reference)

## Key Files

### Configuration
- `package.json` (root) - Monorepo scripts
- `frontend/vite.config.js` - Vite configuration
- `frontend/tailwind.config.js` - Tailwind CSS setup
- `backend/.env.example` - Environment variables template

### Entry Points
- `frontend/src/main.jsx` - Frontend entry
- `backend/server.js` - Backend entry
- `frontend/src/App.jsx` - React router setup

### Documentation
- `README.md` - Main documentation
- `SETUP.md` - Setup instructions
- `CONTRIBUTING.md` - Development guide
- `IMPLEMENTATION_SUMMARY.md` - Project overview

### Development Tools
- `backend/seed.js` - Database seeding
- `.gitignore` - Git ignore rules

## API Endpoints Summary

### Authentication (`/api/auth`)
- POST `/signup` - Register user
- POST `/login` - Login user
- GET `/me` - Get current user

### Courses (`/api/courses`)
- GET `/` - List all courses
- GET `/:id` - Get course details
- POST `/` - Create course (Admin)
- PUT `/:id` - Update course (Admin)
- DELETE `/:id` - Delete course (Admin)

### Timetable (`/api/timetable`)
- GET `/` - Get timetable
- POST `/` - Create/update timetable (Admin)
- DELETE `/` - Delete timetable (Admin)

### Quizzes (`/api/quizzes`)
- GET `/` - List all quizzes
- GET `/:id` - Get quiz details
- POST `/` - Create quiz (Admin)
- PUT `/:id` - Update quiz (Admin)
- DELETE `/:id` - Delete quiz (Admin)
- POST `/:id/submit` - Submit answers
- GET `/:id/results` - Get user results
- GET `/results/all` - Get all results (Admin)

### Feedback (`/api/feedback`)
- GET `/` - View all feedback (Admin)
- POST `/` - Submit feedback

### Lost & Found (`/api/lost-found`)
- GET `/` - List all items
- GET `/:id` - Get item details
- POST `/` - Report item
- PUT `/:id` - Update item (Owner)
- DELETE `/:id` - Delete item (Owner)

### Projects (`/api/projects`)
- GET `/` - List projects (filtered by role)
- GET `/:id` - Get project details
- POST `/` - Submit project
- PUT `/:id/status` - Update status (Admin)

### Bus (`/api/bus`)
- GET `/routes` - List all routes
- GET `/bookings` - List bookings (filtered by role)
- POST `/bookings` - Create booking
- DELETE `/bookings/:id` - Cancel booking
- POST `/routes` - Create route (Admin)

### Grade Appeals (`/api/grade-appeals`)
- GET `/` - List appeals (filtered by role)
- GET `/:id` - Get appeal details
- POST `/` - Submit appeal
- PUT `/:id/status` - Update status (Admin)

## Database Collections

1. **users** - User accounts with roles
2. **courses** - Course catalog
3. **timetables** - Class schedules
4. **quizzes** - Quiz definitions
5. **quizresults** - Quiz submissions
6. **feedbacks** - Faculty feedback
7. **lostfounds** - Lost & found items
8. **projects** - Project proposals
9. **busroutes** - Bus routes
10. **busbookings** - Bus reservations
11. **gradeappeals** - Grade appeal requests

## Technology Stack

### Frontend
- **Vite 5.1** - Build tool
- **React 18.2** - UI framework
- **React Router 6.22** - Routing
- **Tailwind CSS 3.4** - Styling
- **ShadCN UI** - Component library
- **Axios 1.6** - HTTP client
- **React Icons 5.0** - Icons

### Backend
- **Node.js 16+** - Runtime
- **Express 4.18** - Web framework
- **MongoDB** - Database
- **Mongoose 8.0** - ODM
- **JWT** - Authentication
- **bcryptjs 2.4** - Password hashing

### Development
- **Nodemon** - Auto-restart
- **Concurrently** - Parallel scripts
- **ESLint** - Code quality

## Quick Commands

```bash
# Install everything
npm run install:all

# Run frontend and backend
npm run dev

# Run frontend only
npm run dev:frontend

# Run backend only
npm run dev:backend

# Seed database
npm run seed

# Build for production
npm run build
```

## Port Configuration

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5001
- **MongoDB**: mongodb://localhost:27017/unitracker

---

**Last Updated**: January 2025
**Status**: Production-Ready (91% Complete)
