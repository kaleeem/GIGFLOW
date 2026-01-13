# Single-Deployment Deployment Guide

## 🎯 Quick Deployment

### Option 1: Render

1. **Create New Web Service**
   - Connect your GitHub repository
   - Select the `main` branch

2. **Configuration**:
   - **Build Command**: `cd backend && npm install && npm run build`
   - **Start Command**: `cd backend && npm start`
   - **Root Directory**: Leave empty (or `/`)

3. **Environment Variables**:
   ```
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/gigflow
   JWT_SECRET=your_super_secure_random_string_min_64_characters_long
   NODE_ENV=production
   ```

4. **Deploy**: Click "Create Web Service"

### Option 2: Railway

1. **New Project** → Deploy from GitHub
2. **Settings**:
   - **Build Command**: `cd backend && npm install && npm run build`
   - **Start Command**: `cd backend && npm start`

3. **Environment Variables**: Same as above

### Option 3: Heroku

```bash
# Login to Heroku
heroku login

# Create app
heroku create gigflow-app

# Set environment variables
heroku config:set MONGODB_URI="your_mongodb_uri"
heroku config:set JWT_SECRET="your_secret_key"
heroku config:set NODE_ENV=production

# Add buildpack
heroku buildpacks:set heroku/nodejs

# Deploy
git push heroku main
```

## 🔧 Local Production Test

```bash
# Build frontend + copy to backend
cd backend
npm run build

# Start in production mode
NODE_ENV=production PORT=5000 npm start

# Test
open http://localhost:5000
```

## ✅ Post-Deployment Checklist

- [ ] App loads at deployment URL
- [ ] Login/Register works
- [ ] Create gig works
- [ ] Submit bid works
- [ ] Hire bid → real-time notification appears
- [ ] Page refresh doesn't cause 404
- [ ] All routes work correctly

## 🐛 Troubleshooting

### Frontend Doesn't Load
- Check `backend/public/` exists and has files
- Run `npm run build` in backend
- Check server logs for errors

### API Returns 404
- Ensure routes start with `/api`
- Check request network tab in browser
- Verify API routes are registered in `app.js`

### Socket.io Not Connecting
- Check browser console for errors
- Ensure WebSocket/polling enabled
- Verify no firewall blocking WebSockets

### Cookies Not Working
- Ensure `NODE_ENV=production` is set
- Check `secure` flag in cookie options
- Verify HTTPS is enabled (required for production)

## 📊 Performance

Single deployment benefits:
- ✅ Lower latency (no cross-origin requests)
- ✅ Single SSL certificate needed
- ✅ Simpler DNS configuration
- ✅ Lower hosting costs
- ✅ Easier monitoring

---

**Your app is now production-ready! 🎉**
