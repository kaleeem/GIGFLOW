# GigFlow - Single Deployment

**Production-ready freelance marketplace with unified frontend/backend deployment**

## 🚀 Quick Start

### Development
```bash
# Start MongoDB locally
mongod

# Terminal 1 - Run backend (serves API + frontend)
cd backend
npm install
npm run build    # Builds frontend and copies to public/
npm start        # Starts server on port 5000

# Access app at http://localhost:5000
```

### Production Deployment

**Deploy to Render/Railway/Heroku:**

1. **Build Command**: 
   ```bash
   cd backend && npm install && npm run build
   ```

2. **Start Command**:
   ```bash
   cd backend && npm start
   ```

3. **Environment Variables**:
   - `MONGODB_URI` - MongoDB connection string
   - `JWT_SECRET` - Secret key for JWT (64+ chars)
   - `NODE_ENV=production`
   - `PORT` - Auto-set by platform

## ✨ Features

- ✅ User authentication (HttpOnly cookies)
- ✅ Post and browse freelance gigs
- ✅ Submit bids on gigs
- ✅ **Transaction-safe hiring** (MongoDB transactions)
- ✅ **Real-time notifications** (Socket.io)
- ✅ Single deployment
- ✅ Premium UI/UX

## 📁 Architecture

```
gigflow/
├── backend/              # Node.js + Express
│   ├── public/          # Built frontend (auto-generated)
│   ├── src/
│   │   ├── config/
│   │   ├── models/
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── server.js
│   └── scripts/
│       └── copy-frontend.js
│
└── frontend/            # React source (for development)
    └── src/
```

## 🔧 How It Works

1. Frontend uses **relative API paths** (`/api/*`)
2. Backend serves frontend as **static files**
3. **SPA fallback**: All non-API routes → `index.html`
4. **No CORS needed**: Same origin for everything
5. **Socket.io** connects to same server

## 📡 API Endpoints

- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `GET /api/gigs` - List gigs
- `POST /api/gigs` - Create gig
- `POST /api/bids` - Submit bid
- `PATCH /api/bids/:id/hire` - Hire (transaction-safe)

## 🌐 What Gets Deployed

One Node.js service serves:
- React frontend
- Express API
- Socket.io
- Static assets

**Deployment URL**: `https://your-app.onrender.com`
- Frontend: `https://your-app.onrender.com`
- API: `https://your-app.onrender.com/api/*`
- Socket.io: Same origin, automatic

## 🔐 Security

- HttpOnly cookies for JWT
- Helmet.js security headers
- Environment-based configuration
- Atomic MongoDB transactions

## 📚 Documentation

- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)

---

**One Command. One Deployment. Production Ready.**
