# UniTracker - Run Commands

This document provides clear instructions on how to run the UniTracker application.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally or connection string)
- npm

### Step-by-Step Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/manumittu/Final-Unitracker.git
   cd Final-Unitracker
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   cd backend
   cp .env.example .env
   ```
   
   The `.env` file will contain:
   ```env
   PORT=5001
   MONGODB_URI=mongodb://localhost:27017/unitracker
   JWT_SECRET=your-secret-key-change-this-in-production
   NODE_ENV=development
   ```

4. **Start MongoDB** (if using local installation)
   ```bash
   # In a new terminal
   mongod
   ```

5. **Run the application** (from root directory)
   ```bash
   cd ..
   npm run dev
   ```

6. **Access the application**
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:5001

7. **(Optional) Seed the database with sample data**
   ```bash
   npm run seed
   ```

## 📝 Available Commands

### From Root Directory

```bash
# Run both frontend and backend together (RECOMMENDED)
npm run dev

# Run frontend only
npm run dev:frontend

# Run backend only
npm run dev:backend

# Install all dependencies
npm run install:all

# Seed database with sample data
npm run seed

# Build frontend for production
npm run build
```

### From Backend Directory

```bash
cd backend

# Run backend in development mode
npm run dev

# Run backend in production mode
npm start

# Seed database
npm run seed
```

### From Frontend Directory

```bash
cd frontend

# Run frontend in development mode
npm run dev

# Build frontend for production
npm run build

# Preview production build
npm run preview
```

## 🔐 Sample Credentials (After Seeding)

- **Admin**: 
  - Email: `admin@unitracker.com`
  - Password: `password123`

- **Student**: 
  - Email: `student@unitracker.com`
  - Password: `password123`

- **Professor**: 
  - Email: `professor@unitracker.com`
  - Password: `password123`

## 🐛 Troubleshooting

### Port Already in Use

If port 3000 or 5001 is already in use:

1. **Frontend (port 3000)**:
   - Edit `frontend/vite.config.js` and change the port:
     ```js
     server: {
       port: 3001, // Change to any available port
     }
     ```

2. **Backend (port 5001)**:
   - Edit `backend/.env` and change:
     ```env
     PORT=5002
     ```
   - Also update the proxy in `frontend/vite.config.js`:
     ```js
     proxy: {
       '/api': {
         target: 'http://localhost:5002',
       }
     }
     ```

### MongoDB Connection Issues

- Make sure MongoDB is running: `mongod`
- Check the connection string in `backend/.env`
- For MongoDB Atlas, use the full connection string with credentials

### Dependencies Not Installed

```bash
# Install all dependencies from root
npm run install:all

# Or install individually
npm install              # Root dependencies
cd frontend && npm install
cd ../backend && npm install
```

## 🎯 Recommended Workflow

1. **First Time Setup**:
   ```bash
   git clone https://github.com/manumittu/Final-Unitracker.git
   cd Final-Unitracker
   npm run install:all
   cd backend && cp .env.example .env && cd ..
   npm run seed
   npm run dev
   ```

2. **Daily Development**:
   ```bash
   # Just start MongoDB and run the app
   mongod  # In one terminal
   npm run dev  # In another terminal
   ```

3. **Production Deployment**:
   ```bash
   cd frontend
   npm run build
   cd ../backend
   npm start
   ```

---

**Need more help?** Check out:
- [SETUP.md](SETUP.md) - Detailed setup guide
- [README.md](README.md) - Project overview and features
- [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - Project structure details
