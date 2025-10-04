# UniTracker Setup Guide

This guide will help you set up and run the UniTracker monorepo on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v5.0 or higher) - [Download](https://www.mongodb.com/try/download/community)
  - OR a MongoDB Atlas account for cloud database - [Sign Up](https://www.mongodb.com/cloud/atlas/register)
- **Git** - [Download](https://git-scm.com/downloads)
- **npm** (comes with Node.js)

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/manumittu/Final-Unitracker.git
cd Final-Unitracker
```

### 2. Install Dependencies

Option A: Install all dependencies at once (recommended)
```bash
npm run install:all
```

Option B: Install manually
```bash
# Root dependencies
npm install

# Frontend dependencies
cd frontend
npm install

# Backend dependencies
cd ../backend
npm install
cd ..
```

### 3. Set Up MongoDB

#### Option A: Local MongoDB

1. Start MongoDB service:
   ```bash
   # On macOS with Homebrew
   brew services start mongodb-community

   # On Windows
   net start MongoDB

   # On Linux
   sudo systemctl start mongod
   ```

2. Verify MongoDB is running:
   ```bash
   mongosh
   # You should see the MongoDB shell
   ```

#### Option B: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string

### 4. Configure Environment Variables

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

3. Edit the `.env` file with your configuration:
   ```env
   PORT=5001
   MONGODB_URI=mongodb://localhost:27017/unitracker
   # OR for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/unitracker
   
   JWT_SECRET=your-secret-key-change-this-in-production
   NODE_ENV=development
   ```

4. Return to the root directory:
   ```bash
   cd ..
   ```

### 5. Seed the Database (Optional but Recommended)

This will create sample data including test users, courses, and bus routes:

```bash
npm run seed
```

You'll see output like:
```
✅ Connected to MongoDB
🗑️  Cleared existing data
✅ Created users:
   - admin@unitracker.com (password: password123)
   - student@unitracker.com (password: password123)
   - professor@unitracker.com (password: password123)
✅ Created 5 sample courses
✅ Created 3 bus routes
🎉 Database seeded successfully!
```

### 6. Start the Application

From the root directory, run:

```bash
npm run dev
```

This will start both the frontend and backend concurrently.

You should see:
```
[backend] 🚀 Server running on port 5001
[backend] ✅ MongoDB connected
[frontend] VITE v5.x.x  ready in xxx ms
[frontend] ➜  Local:   http://localhost:3000/
```

### 7. Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001

## Test Accounts

After seeding the database, use these credentials to log in:

### Admin Account
- **Email**: admin@unitracker.com
- **Password**: password123
- **Access**: Full access to all modules

### Student Account
- **Email**: student@unitracker.com
- **Password**: password123
- **Access**: View courses, submit feedback, report items, submit projects

### Professor Account
- **Email**: professor@unitracker.com
- **Password**: password123
- **Access**: Similar to student with teaching capabilities

## Troubleshooting

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

1. **Check if MongoDB is running**:
   ```bash
   # Try connecting with mongosh
   mongosh
   ```

2. **Verify connection string**:
   - For local: `mongodb://localhost:27017/unitracker`
   - For Atlas: Make sure to replace `<password>` with your actual password
   - Remove `<>` brackets if present

3. **Check firewall settings** (for MongoDB Atlas):
   - Ensure your IP is whitelisted in Network Access

### Module Import Errors

If you see errors about missing modules:
```bash
# Clear node_modules and reinstall
rm -rf node_modules frontend/node_modules backend/node_modules
npm run install:all
```

### Build Errors

1. **Clear the cache**:
   ```bash
   cd frontend
   rm -rf node_modules/.vite
   cd ..
   ```

2. **Reinstall dependencies**:
   ```bash
   npm run install:all
   ```

## Running Individual Parts

### Frontend Only
```bash
cd frontend
npm run dev
```

### Backend Only
```bash
cd backend
npm run dev
```

### Build for Production

1. **Build the frontend**:
   ```bash
   cd frontend
   npm run build
   ```
   The built files will be in `frontend/dist/`

2. **Run the backend in production**:
   ```bash
   cd backend
   npm start
   ```

## Development Tips

### Hot Reload

Both frontend and backend support hot reload:
- Frontend: Vite will automatically reload when you save files
- Backend: Nodemon will restart the server when you save files

### Debugging

1. **Backend logs**: Check the terminal where you ran `npm run dev`
2. **Frontend errors**: Check the browser console (F12)
3. **Network requests**: Use browser DevTools Network tab

### Database Management

View your data using:
- **MongoDB Compass** - GUI tool for MongoDB
- **mongosh** - Command-line tool
- **MongoDB Atlas dashboard** - If using Atlas

```bash
# Connect to local MongoDB
mongosh

# Show all databases
show dbs

# Use the unitracker database
use unitracker

# Show all collections
show collections

# View data
db.users.find()
db.courses.find()
```

### Resetting the Database

To clear all data and reseed:
```bash
npm run seed
```

This will delete all existing data and create fresh sample data.

## Next Steps

1. **Explore the Dashboard**: Log in and explore all available modules
2. **Test Role-Based Access**: Switch between admin, student, and professor accounts
3. **Review the Code**: Check out the clean, modular structure
4. **Add New Features**: Use the existing patterns to add new modules

## Getting Help

If you encounter issues:

1. Check the main [README.md](README.md) for additional information
2. Review the [troubleshooting section](#troubleshooting) above
3. Check the console logs for error messages
4. Open an issue on GitHub with:
   - Error message
   - Steps to reproduce
   - Your environment (OS, Node version, MongoDB version)

## Useful Commands

```bash
# Install all dependencies
npm run install:all

# Run frontend and backend together
npm run dev

# Run frontend only
npm run dev:frontend

# Run backend only
npm run dev:backend

# Seed the database
npm run seed

# Build frontend for production
npm run build
```

---

Happy coding! 🚀
