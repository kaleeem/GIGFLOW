# GigFlow Backend - Single Deployment

**Production-ready backend that serves both API and React frontend**

## 🏗️ Architecture

This backend now serves:
1. **Express API** at `/api/*`
2. **React Frontend** (static files)
3. **Socket.io** (real-time notifications)
4. **SPA routing** (fallback to index.html)

All from **one server**, **one port**, **one deployment**.

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Build frontend and copy to public/
npm run build

# Start server
npm start

# Server runs on http://localhost:5000
# Frontend accessible at http://localhost:5000
# API accessible at http://localhost:5000/api/*
```

### Development Mode (with auto-reload)

```bash
npm run dev
```

## 📦 Build Process

The build process is automated:

1. **`npm run build:frontend`**: 
   - Navigates to `../frontend`
   - Installs dependencies
   - Runs Vite production build
   - Outputs to `frontend/dist/`

2. **`npm run copy:frontend`**:
   - Runs `scripts/copy-frontend.js`
   - Copies `frontend/dist/*` to `backend/public/`
   - Clears old files first

3. **`npm run build`**:
   - Runs both commands in sequence
   - **Single command for complete build**

## 🌐 Deployment

### Render / Railway / Heroku

**Build Command**:
```bash
npm install && npm run build
```

**Start Command**:
```bash
npm start
```

**Environment Variables**:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret (64+ chars)
- `NODE_ENV=production`
- `PORT` - Auto-set by platform

### What Gets Deployed

```
backend/
├── public/              # Frontend build (auto-generated)
│   ├── index.html
│   ├── assets/
│   └── ...
├── src/
│   ├── config/
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   └── server.js
└── scripts/
    └── copy-frontend.js
```

## 📡 API Endpoints

All API routes are prefixed with `/api`:

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Gigs
- `GET /api/gigs` - List all gigs (with search/filter)
- `POST /api/gigs` - Create gig (auth required)
- `GET /api/gigs/:id` - Get single gig

### Bids
- `POST /api/bids` - Create bid (auth required)
- `GET /api/bids/:gigId` - Get bids for gig (owner only)
- `PATCH /api/bids/:bidId/hire` - Hire freelancer (**transaction-safe**)

## 🔥 Critical Features

### Transaction-Safe Hiring

Uses MongoDB sessions and transactions to ensure:
- Only ONE bid can be hired per gig
- Atomic updates to gig, bid, and other bids
- Race condition prevention
- Automatic rollback on failure

### Real-Time Notifications

Socket.io runs on same server:
- No CORS configuration needed
- WebSocket + polling transports
- User-specific rooms for targeted notifications
- Hired freelancers get instant alerts

### SPA Routing

Express configuration:
1. **API routes** (`/api/*`) - highest priority
2. **Static files** (CSS, JS, images)
3. **SPA fallback** - all other routes serve `index.html`

This allows React Router to work correctly. Page refreshes don't cause 404s.

## 🔐 Security

- ✅ HttpOnly cookies (no localStorage)
- ✅ Helmet.js security headers
- ✅ No CORS needed (same origin)
- ✅ Environment-based secrets
- ✅ Password hashing (bcrypt)
- ✅ JWT expiration

## 📊 Static File Serving

```javascript
// In app.js
app.use(express.static(path.join(__dirname, '../public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});
```

## 🧪 Testing Locally

```bash
# Build everything
npm run build

# Start server
npm start

# Open browser
# http://localhost:5000 → React frontend
# http://localhost:5000/api/gigs → API (JSON)
```

Test:
1. Frontend loads correctly
2. Login/Register works
3. Create gig, submit bid
4. Hire bid → real-time notification appears
5. Refresh page → no 404 errors

## 🎯 Production Checklist

- ✅ Single deployment command
- ✅ No frontend environment variables needed
- ✅ No CORS configuration required
- ✅ Socket.io works automatically
- ✅ HttpOnly cookies work perfectly
- ✅ SPA routing works (no 404s)

---

**One Server. One Port. One Deployment.**
