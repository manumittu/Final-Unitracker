# 🚀 Deployment Quick Reference Card

## The Issue: Login Not Working After Publishing

**Problem**: Published frontend to GitHub Pages but login fails.  
**Cause**: Backend is not deployed - frontend needs a live backend API.  
**Solution**: Deploy both frontend AND backend following steps below.

---

## ✅ Step-by-Step Deployment (30 minutes)

### Part 1: MongoDB Database (5 min)
1. Go to https://mongodb.com/cloud/atlas → Sign up (free)
2. Create cluster (M0 Free tier)
3. Add database user (remember username/password)
4. Network Access → Add IP: `0.0.0.0/0`
5. Connect → Get connection string
   ```
   mongodb+srv://username:password@cluster.mongodb.net/unitracker
   ```

### Part 2: Deploy Backend (10 min)
1. Go to https://render.com → Sign up (free)
2. **New +** → **Web Service**
3. Connect GitHub repo: `Final-Unitracker`
4. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Environment Variables (click "Advanced"):
   ```
   MONGODB_URI=mongodb+srv://...  (from Part 1)
   JWT_SECRET=supersecretkey123456
   PORT=5001
   NODE_ENV=production
   ```
6. **Create Web Service** → Wait 2-3 minutes
7. Copy URL: `https://unitracker-xxxx.onrender.com`

### Part 3: Seed Database (2 min)
In Render dashboard:
1. Click your service → **Shell** tab
2. Run: `npm run seed`
3. Should see: ✅ Created users with default credentials

### Part 4: Connect Frontend (5 min)
On your computer:

```bash
# 1. Create frontend/.env file
echo "VITE_API_URL=https://unitracker-xxxx.onrender.com/api" > frontend/.env

# Replace "unitracker-xxxx.onrender.com" with YOUR Render URL from Part 2

# 2. Rebuild frontend
npm run build

# 3. Commit and push
git add .
git commit -m "Configure frontend with backend URL"
git push
```

### Part 5: Update CORS (3 min)
Edit `backend/server.js`:

```javascript
// Find the line: app.use(cors());
// Replace with:
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://manumittu.github.io'  // Your GitHub username
  ],
  credentials: true
}));
```

Commit and push - Render will auto-deploy.

### Part 6: Enable GitHub Pages (2 min)
On GitHub:
1. Repository → **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: **main** → Folder: **/docs**
4. **Save**
5. Wait 2-3 minutes
6. Visit: `https://manumittu.github.io/Final-Unitracker/`

---

## 🎯 Test Login

1. Go to: `https://manumittu.github.io/Final-Unitracker/`
2. Click **Login**
3. Credentials:
   ```
   Email: admin@unitracker.com
   Password: password123
   ```
4. Should redirect to Dashboard ✅

---

## 🔧 Troubleshooting

### Login still fails?

**Check 1: Is backend running?**
- Visit: `https://your-render-url.onrender.com`
- Should see: `{"message":"UniTracker API is running"}`
- If not: Check Render logs for errors

**Check 2: CORS error in browser?**
- F12 → Console → See CORS error?
- Fix: Update backend/server.js CORS settings (Part 5)
- Commit + push to redeploy

**Check 3: Wrong API URL?**
- Check frontend/.env has correct Render URL
- Rebuild: `npm run build`
- Commit + push

**Check 4: Database not seeded?**
- Render → Shell → `npm run seed`
- Should create admin user

### Free Tier Limitations

**Render Free Tier**:
- Backend sleeps after 15 min of inactivity
- First request after sleep takes 30-60 seconds
- This is normal - just wait a bit longer for login

**MongoDB Atlas Free Tier**:
- 512 MB storage (plenty for this app)
- Automatic backups
- No credit card required

---

## 📋 Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] Network access set to 0.0.0.0/0
- [ ] Backend deployed to Render
- [ ] Environment variables set in Render
- [ ] Database seeded (npm run seed)
- [ ] Frontend .env created with backend URL
- [ ] Frontend rebuilt (npm run build)
- [ ] CORS updated in backend
- [ ] Changes committed and pushed
- [ ] GitHub Pages enabled
- [ ] Login tested successfully

---

## 🎓 Default Credentials (After Seeding)

| Role      | Email                    | Password    |
|-----------|--------------------------|-------------|
| Admin     | admin@unitracker.com     | password123 |
| Student   | student@unitracker.com   | password123 |
| Professor | professor@unitracker.com | password123 |

---

## 📱 URLs Reference

| Service        | URL Example                                  |
|----------------|----------------------------------------------|
| Frontend       | https://manumittu.github.io/Final-Unitracker |
| Backend        | https://unitracker-xxxx.onrender.com         |
| Database       | mongodb+srv://cluster.mongodb.net/unitracker |
| GitHub Repo    | https://github.com/manumittu/Final-Unitracker |

---

## ⏱️ First-Time Setup: ~30 minutes
## ⏱️ Subsequent Updates: ~2 minutes (just rebuild + push)

**Need Help?** Open an issue on GitHub with:
- Screenshot of error
- Browser console output (F12)
- Backend logs from Render
