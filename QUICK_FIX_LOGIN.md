# Quick Fix for Login After Publishing

## Problem
After publishing the frontend to GitHub Pages, login doesn't work because the backend is not deployed.

## Solution

### Step 1: Deploy Backend First

You have several options for deploying the backend:

#### Option A: Using Render (Recommended - Free)

1. Go to [render.com](https://render.com) and sign up
2. Create a new **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add environment variables in Render:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/unitracker
   JWT_SECRET=your-very-secure-secret-key-change-this
   PORT=5001
   NODE_ENV=production
   ```
6. Click **Create Web Service**
7. Wait for deployment to complete
8. Copy your backend URL (e.g., `https://unitracker-backend.onrender.com`)

#### Option B: Using Railway

1. Go to [railway.app](https://railway.app)
2. Create new project from your GitHub repo
3. Set root directory to `backend`
4. Add the same environment variables
5. Deploy and copy your backend URL

### Step 2: Set Up MongoDB Atlas (Free)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and cluster (M0 Free tier)
3. Create a database user with username and password
4. Whitelist all IPs: `0.0.0.0/0` (for testing)
5. Get connection string: Click "Connect" → "Connect your application"
6. Copy the connection string (looks like: `mongodb+srv://username:password@...`)
7. Use this as your `MONGODB_URI` in backend deployment

### Step 3: Seed the Database

After deploying backend, seed it with default users:

**Option A: Using Render Dashboard**
1. Go to your Render service
2. Click "Shell" tab
3. Run: `npm run seed`

**Option B: Using API endpoint**
Create a seed endpoint in your backend or manually create admin user.

### Step 4: Connect Frontend to Backend

1. In your local repository, create `frontend/.env`:
   ```env
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```
   Replace `your-backend-url.onrender.com` with your actual backend URL from Step 1.

2. Rebuild the frontend:
   ```bash
   npm run build
   ```

3. Commit and push:
   ```bash
   git add .
   git commit -m "Configure frontend to use deployed backend"
   git push
   ```

### Step 5: Update Backend CORS

Make sure your backend allows requests from GitHub Pages:

Edit `backend/server.js` to update CORS:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://manumittu.github.io',  // Add your GitHub Pages URL
    'https://your-custom-domain.com'  // If you have a custom domain
  ],
  credentials: true
}));
```

Commit and push this change - your backend host will auto-deploy.

### Step 6: Test Login

1. Go to your GitHub Pages URL: `https://manumittu.github.io/Final-Unitracker/`
2. Click Login
3. Use default credentials:
   - **Email**: `admin@unitracker.com`
   - **Password**: `password123`

## Quick Checklist

- [ ] Backend deployed to Render/Railway/Heroku
- [ ] MongoDB Atlas database created
- [ ] Database seeded with `npm run seed`
- [ ] Frontend .env file created with VITE_API_URL
- [ ] Frontend rebuilt with `npm run build`
- [ ] Changes committed and pushed to GitHub
- [ ] Backend CORS updated with GitHub Pages URL
- [ ] Login tested with admin@unitracker.com

## Default Users (After Seeding)

Once you run `npm run seed` on your deployed backend:

- **Admin**: admin@unitracker.com / password123
- **Student**: student@unitracker.com / password123
- **Professor**: professor@unitracker.com / password123

## Still Not Working?

### Check Browser Console
1. Open Developer Tools (F12)
2. Go to Console tab
3. Look for errors related to API calls
4. Common issues:
   - CORS errors → Update backend CORS settings
   - 404 errors → Check VITE_API_URL is correct
   - Network errors → Backend might be down

### Verify Backend is Running
Visit your backend URL in browser:
- `https://your-backend-url.onrender.com/` 
- You should see: `{"message":"UniTracker API is running"}`

### Check Environment Variables
In Render/Railway dashboard:
- Verify all environment variables are set
- No typos in MONGODB_URI
- JWT_SECRET is set

## Alternative: Local Testing

If you want to test locally before deploying:

```bash
# Terminal 1 - Start backend
cd backend
npm run dev

# Terminal 2 - Start frontend  
cd frontend
npm run dev
```

Then visit `http://localhost:3000` and login with default credentials.
