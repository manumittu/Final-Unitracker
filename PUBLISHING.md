# Publishing Guide - UniTracker

This guide will help you publish the UniTracker application to GitHub Pages and deploy the backend.

## 📦 Frontend Deployment (GitHub Pages)

### Prerequisites
- A GitHub account
- Your repository pushed to GitHub

### Step 1: Build the Frontend

The project is already configured to build to the `docs` folder:

```bash
# From the root directory
npm run build
```

This command will:
- Build the frontend application
- Output static files to the `docs` folder
- Include a `.nojekyll` file to prevent Jekyll processing

### Step 2: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** (top navigation)
3. Scroll down to **Pages** in the left sidebar
4. Under **Source**:
   - Select **Deploy from a branch**
   - Choose the **main** (or your default) branch
   - Select the **/docs** folder
   - Click **Save**

### Step 3: Access Your Site

After a few minutes, your site will be available at:
```
https://<your-username>.github.io/<repository-name>/
```

Example: `https://manumittu.github.io/Final-Unitracker/`

You can find the exact URL in the GitHub Pages section of your repository settings.

### Updating the Frontend

Whenever you make changes to the frontend:

1. Make your code changes
2. Run `npm run build` to rebuild the `docs` folder
3. Commit and push the changes:
   ```bash
   git add .
   git commit -m "Update frontend build"
   git push
   ```
4. GitHub Pages will automatically deploy the new version

## 🚀 Backend Deployment

The frontend is static and can be hosted on GitHub Pages, but you need to deploy the backend separately since it requires Node.js and MongoDB.

### Recommended Backend Hosting Options

#### Option 1: Render (Recommended - Free Tier Available)

1. Create an account at [render.com](https://render.com)
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `unitracker-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add environment variables:
   ```
   MONGODB_URI=<your-mongodb-connection-string>
   JWT_SECRET=<your-secret-key>
   PORT=5001
   NODE_ENV=production
   ```
6. Deploy!

#### Option 2: Railway

1. Create an account at [railway.app](https://railway.app)
2. Create a new project
3. Add your GitHub repository
4. Railway will auto-detect Node.js
5. Set the root directory to `backend`
6. Add environment variables (same as above)
7. Deploy!

#### Option 3: Heroku

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create unitracker-backend`
4. Set buildpack: `heroku buildpacks:set heroku/nodejs`
5. Configure environment variables:
   ```bash
   heroku config:set MONGODB_URI=<your-mongodb-uri>
   heroku config:set JWT_SECRET=<your-secret>
   ```
6. Deploy:
   ```bash
   git subtree push --prefix backend heroku main
   ```

### MongoDB Setup

You'll need a MongoDB database. Use MongoDB Atlas (free tier available):

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (M0 Free tier)
4. Create a database user
5. Whitelist IP addresses (use `0.0.0.0/0` for all IPs)
6. Get your connection string
7. Use this connection string in your `MONGODB_URI` environment variable

## 🔗 Connecting Frontend to Backend

Once your backend is deployed, you need to update the frontend to use the deployed backend URL.

### Update API Configuration

Edit `frontend/src/utils/api.js`:

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'https://your-backend-url.com';
```

Or create a `.env` file in the frontend directory:

```env
VITE_API_URL=https://your-backend-url.com
```

Then rebuild and push:

```bash
npm run build
git add docs/
git commit -m "Update API URL to production backend"
git push
```

### CORS Configuration

Make sure your backend allows requests from your GitHub Pages URL:

In `backend/server.js`, update CORS configuration:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://<your-username>.github.io'
  ],
  credentials: true
}));
```

## ✅ Verification Checklist

After deployment, verify:

- [ ] Frontend loads on GitHub Pages URL
- [ ] Backend is accessible and responds to API calls
- [ ] Login/Signup works correctly
- [ ] Database connections are working
- [ ] CORS is properly configured
- [ ] Environment variables are set correctly
- [ ] All modules load and function properly

## 🔧 Troubleshooting

### Frontend Issues

**Problem**: Assets not loading (404 errors)
- **Solution**: Check that `base: './'` is set in `vite.config.js`
- **Solution**: Ensure `.nojekyll` file exists in docs folder

**Problem**: Blank page
- **Solution**: Check browser console for errors
- **Solution**: Verify build was successful
- **Solution**: Check that all routes use relative paths

### Backend Issues

**Problem**: CORS errors
- **Solution**: Add your GitHub Pages URL to CORS allowed origins
- **Solution**: Check that credentials are properly configured

**Problem**: Database connection fails
- **Solution**: Verify MongoDB URI is correct
- **Solution**: Check that IP whitelist includes your hosting provider's IPs
- **Solution**: Ensure database user has proper permissions

**Problem**: Environment variables not working
- **Solution**: Verify all required env vars are set on hosting platform
- **Solution**: Check for typos in variable names
- **Solution**: Restart the backend service after adding variables

## 📱 Custom Domain (Optional)

### For GitHub Pages

1. Purchase a domain from a registrar
2. Add a `CNAME` file to the `docs` folder with your domain
3. Configure DNS records with your registrar:
   - Add A records pointing to GitHub's IPs
   - Or add a CNAME record pointing to `<username>.github.io`
4. Enable custom domain in GitHub Pages settings

### For Backend

Most hosting providers allow custom domains:
- Render: Add custom domain in settings
- Railway: Configure custom domain in project settings
- Heroku: Use `heroku domains:add yourdomain.com`

## 🎉 Success!

Your UniTracker application is now published and accessible to the world!

- Frontend: `https://<username>.github.io/<repo-name>/`
- Backend: `https://your-backend.render.com` (or your chosen hosting)

## 📞 Support

For deployment issues:
- Check the [GitHub Pages documentation](https://docs.github.com/en/pages)
- Review your hosting provider's documentation
- Open an issue on the repository

---

**Last Updated**: January 2025
