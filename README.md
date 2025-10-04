# UniTracker - College Management System

A comprehensive monorepo integrating 10 different college management modules into a single unified application with role-based access control.

> **🚀 Quick Start:** See [RUN_COMMANDS.md](RUN_COMMANDS.md) for complete instructions on how to run this application with port 5001.

## 🌟 Features

### Integrated Modules

1. **Landing Page & Authentication** - Entry point with secure JWT-based login system
2. **Course Management** - Full CRUD operations for courses (Admin), view-only for students
3. **Timetable Management** - Create and view class schedules (Coming Soon)
4. **Quiz Management** - Create quizzes and track results (Coming Soon)
5. **Faculty Feedback** - Submit feedback (Students), review all feedback (Admin)
6. **Lost & Found** - Report and track lost/found items (All users)
7. **Project Idea Submission** - Submit project ideas (Students), approve/reject (Admin)
8. **Bus Reservation** - Book transportation (Coming Soon)
9. **Grade Appeals** - Submit appeals (Students), review & respond (Admin)

### Role-Based Access Control

- **Admin**: 
  - Full CRUD access to courses
  - View all faculty feedback
  - Approve/reject project submissions
  - Review and respond to grade appeals
  - Create and manage timetables
  - Create quizzes and view all results

- **Student/Professor**: 
  - View courses
  - Submit faculty feedback
  - Report lost/found items
  - Submit project ideas
  - Submit grade appeals
  - Attend quizzes and view own results
  - View timetables

## 🏗️ Tech Stack

### Frontend
- **Vite** - Fast build tool and dev server
- **React 18** - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **ShadCN UI** - Modern component library
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📦 Project Structure

```
unitracker-monorepo/
├── frontend/                 # Vite + React frontend
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   └── ui/          # ShadCN UI components
│   │   ├── pages/           # Page components
│   │   ├── modules/         # Module-specific components
│   │   ├── utils/           # Utilities and API calls
│   │   ├── hooks/           # Custom React hooks
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/                  # Node.js + Express backend
│   ├── models/              # Mongoose models
│   ├── routes/              # API routes
│   ├── middleware/          # Auth middleware
│   ├── config/              # Configuration files
│   ├── server.js            # Entry point
│   ├── package.json
│   └── .env                 # Environment variables
│
├── package.json             # Root package.json
└── README.md
```

## 🚀 Getting Started

### Quick Start (Recommended)

```bash
# 1. Clone and navigate
git clone https://github.com/manumittu/Final-Unitracker.git
cd Final-Unitracker

# 2. Install all dependencies at once
npm run install:all

# 3. Set up environment variables
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
nano .env

# 4. Start MongoDB (if using local)
mongod

# 5. Run the application (from root directory)
cd ..
npm run dev

# 6. (Optional) Seed the database with sample data
npm run seed
```

**Sample Credentials (after seeding):**
- Admin: `admin@unitracker.com` / `password123`
- Student: `student@unitracker.com` / `password123`
- Professor: `professor@unitracker.com` / `password123`

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001

### Detailed Installation

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (running locally or connection string)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/manumittu/Final-Unitracker.git
   cd Final-Unitracker
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```
   This will install dependencies for the root, frontend, and backend.

   Or install manually:
   ```bash
   # Root dependencies
   npm install

   # Frontend dependencies
   cd frontend
   npm install

   # Backend dependencies
   cd ../backend
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5001
   MONGODB_URI=mongodb://localhost:27017/unitracker
   JWT_SECRET=your-secret-key-change-this-in-production
   NODE_ENV=development
   ```

4. **Start MongoDB**
   
   Make sure MongoDB is running on your system:
   ```bash
   # If using MongoDB locally
   mongod
   
   # Or use MongoDB Atlas connection string in .env
   ```

### Running the Application

#### Development Mode

**Option 1: Run everything together (recommended)**
```bash
npm run dev
```
This starts both frontend and backend concurrently.

**Option 2: Run separately**

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001

#### Production Build

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Start the backend:
   ```bash
   cd backend
   npm start
   ```

## 👥 Default Users

After running the seed script (`npm run seed`), you can use these test accounts:

**Admin Account:**
- Email: admin@unitracker.com
- Password: password123
- Role: Admin
- Access: Full access to all modules

**Student Account:**
- Email: student@unitracker.com
- Password: password123
- Role: Student
- Access: View courses, submit feedback, report lost items, submit projects and appeals

**Professor Account:**
- Email: professor@unitracker.com
- Password: password123
- Role: Professor
- Access: Similar to student with teaching capabilities

The seed script also creates:
- 5 sample courses (CS101, CS201, MATH101, ENG101, PHY101)
- 3 bus routes (Campus Express, City Shuttle, Hostel Line)

To reset and reseed the database, simply run `npm run seed` again.

## 📱 Usage

1. **Landing Page**: Visit http://localhost:3000 to see the landing page
2. **Sign Up**: Click "Login / Sign Up" and create a new account
3. **Login**: Use your credentials to log in
4. **Dashboard**: After login, you'll see the dashboard with available modules based on your role
5. **Access Modules**: Click on any module card to access that feature

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:
- Tokens are stored in localStorage
- Tokens expire after 24 hours
- Protected routes automatically redirect to login if not authenticated
- Role-based access control restricts features based on user role

## 🎨 UI Components

The application uses ShadCN UI components built on top of Radix UI:
- Button
- Card
- Input
- Label
- And more...

All components are customizable through Tailwind CSS classes.

## 📝 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Courses
- `GET /api/courses` - Get all courses (protected)
- `GET /api/courses/:id` - Get single course (protected)
- `POST /api/courses` - Create course (Admin only)
- `PUT /api/courses/:id` - Update course (Admin only)
- `DELETE /api/courses/:id` - Delete course (Admin only)

### Timetable
- `GET /api/timetable` - Get timetable (protected)
- `POST /api/timetable` - Create/update timetable (Admin only)
- `DELETE /api/timetable` - Delete timetable (Admin only)

### Quizzes
- `GET /api/quizzes` - Get all quizzes (protected)
- `GET /api/quizzes/:id` - Get single quiz (protected)
- `POST /api/quizzes` - Create quiz (Admin only)
- `PUT /api/quizzes/:id` - Update quiz (Admin only)
- `DELETE /api/quizzes/:id` - Delete quiz (Admin only)
- `POST /api/quizzes/:id/submit` - Submit quiz answers (protected)
- `GET /api/quizzes/:id/results` - Get user's results (protected)
- `GET /api/quizzes/results/all` - Get all results (Admin only)

### Feedback
- `GET /api/feedback` - Get all feedback (Admin only)
- `POST /api/feedback` - Submit feedback (protected)

### Lost & Found
- `GET /api/lost-found` - Get all items (protected)
- `GET /api/lost-found/:id` - Get single item (protected)
- `POST /api/lost-found` - Create item (protected)
- `PUT /api/lost-found/:id` - Update item (protected, owner only)
- `DELETE /api/lost-found/:id` - Delete item (protected, owner only)

### Projects
- `GET /api/projects` - Get all projects (protected, filtered by role)
- `GET /api/projects/:id` - Get single project (protected)
- `POST /api/projects` - Submit project (protected)
- `PUT /api/projects/:id/status` - Update project status (Admin only)

### Bus Reservations
- `GET /api/bus/routes` - Get all routes (protected)
- `GET /api/bus/bookings` - Get bookings (protected, filtered by role)
- `POST /api/bus/bookings` - Create booking (protected)
- `DELETE /api/bus/bookings/:id` - Cancel booking (protected)
- `POST /api/bus/routes` - Create route (Admin only)

### Grade Appeals
- `GET /api/grade-appeals` - Get all appeals (protected, filtered by role)
- `GET /api/grade-appeals/:id` - Get single appeal (protected)
- `POST /api/grade-appeals` - Submit appeal (protected)
- `PUT /api/grade-appeals/:id/status` - Update appeal status (Admin only)

## 🔧 Development

### Module Implementation Status

✅ **Fully Implemented:**
- Landing Page with modern design
- Authentication (Login/Signup) with JWT
- Dashboard with role-based module cards
- Courses Module (CRUD operations)
- Lost & Found Module (Report & browse items)
- Faculty Feedback Module (Submit & view feedback)
- Projects Module (Submit & approve projects)
- Grade Appeals Module (Submit & review appeals)

🚧 **In Progress:**
- Timetable Management Module
- Quiz Management Module
- Bus Reservation Module

### Adding New Modules

1. Create a new component in `frontend/src/modules/`
2. Add the route in `frontend/src/App.jsx`
3. Create necessary API endpoints in `backend/routes/`
4. Create Mongoose models in `backend/models/`
5. Update the dashboard to include the new module card

### Styling

The project uses Tailwind CSS with a custom ShadCN theme. Modify `frontend/tailwind.config.js` to customize colors, spacing, etc.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Authors

- **Manu Mittu** - [GitHub](https://github.com/manumittu)

## 🙏 Acknowledgments

- ShadCN UI for the component library
- React community for excellent documentation
- All contributors who helped build this project

## 📞 Support

For support, email support@unitracker.com or open an issue on GitHub.

---

**Note**: This is an integrated monorepo combining 10 separate modules into a unified application. Some modules are still being migrated from their original implementations.
