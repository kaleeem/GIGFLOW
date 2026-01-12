# GigFlow - Freelance Marketplace Platform

A production-ready, full-stack freelance marketplace platform built with **senior-level architecture** and **enterprise-grade features**.

## 🌟 Key Features

### Core Functionality
- ✅ **User Authentication** - Secure HttpOnly cookie-based JWT authentication
- ✅ **Gig Management** - Post, browse, and search freelance opportunities
- ✅ **Bidding System** - Freelancers can bid on gigs with proposals
- ✅ **Real-Time Notifications** - Socket.io powered instant notifications
- ✅ **Transaction-Safe Hiring** - MongoDB transactions with race condition prevention

### Advanced Features (Production-Grade)
- 🔒 **Race Condition Handling** - Atomic transactions ensure only ONE bid can be hired per gig
- ⚡ **Real-Time Updates** - Instant notifications when hired (no page refresh needed)
- 🎯 **Optimistic Locking** - Prevents concurrent hire attempts with conditional updates
- 🏗️ **MVC Architecture** - Clean separation of concerns
- 🚀 **Optimized Queries** - Database indexing and lean queries for performance
- 🎨 **Premium UI/UX** - Modern glassmorphism design with Tailwind CSS

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (HttpOnly Cookies)
- **Real-Time**: Socket.io
- **Architecture**: Strict MVC pattern

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Real-Time**: Socket.io Client
- **Notifications**: React Toastify
- **Routing**: React Router v6

## 📁 Project Structure

```
gigflow/
├── backend/
│   ├── src/
│   │   ├── config/          # Database & Socket.io configuration
│   │   ├── models/          # Mongoose models (User, Gig, Bid)
│   │   ├── controllers/     # Business logic
│   │   ├── routes/          # API routes
│   │   ├── middlewares/     # Auth & error handling
│   │   ├── app.js           # Express app setup
│   │   └── server.js        # Server entry point
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── app/             # Redux store
│   │   ├── features/        # Redux slices
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API & Socket services
│   │   └── main.jsx         # App entry point
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
└── README.md                # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### 1. Clone & Install

```bash
# Navigate to project directory
cd gigflow

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables

**Backend** (`backend/.env`):
```env
MONGODB_URI=mongodb://localhost:27017/gigflow
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

### 3. Run the Application

**Terminal 1 - Backend**:
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend**:
```bash
cd frontend
npm run dev
```

### 4. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user (protected)

### Gigs
- `GET /api/gigs` - Get all gigs (public, with search/filter)
- `POST /api/gigs` - Create new gig (protected)
- `GET /api/gigs/:id` - Get single gig (public)

### Bids
- `POST /api/bids` - Create bid (protected)
- `GET /api/bids/:gigId` - Get bids for gig (owner only)
- `PATCH /api/bids/:bidId/hire` - Hire bid (owner only, **transaction-safe**)

## 🔥 Critical Features Explained

### 1. Transaction-Safe Hiring Logic

The hiring system uses **MongoDB transactions** to ensure data integrity:

```javascript
// Prevents race conditions with optimistic locking
const gigUpdate = await Gig.findOneAndUpdate(
  { _id: gig._id, status: 'open' }, // Conditional check
  { status: 'assigned' },
  { session } // Part of transaction
);

// If another request already hired, this returns null
if (!gigUpdate) {
  await session.abortTransaction();
  return error;
}
```

**What happens during concurrent hires:**
1. Two users try to hire different freelancers simultaneously
2. Both transactions start
3. First transaction succeeds and updates gig to 'assigned'
4. Second transaction fails the conditional check and rolls back
5. Only ONE freelancer is hired, others are rejected atomically

### 2. Real-Time Notifications

Socket.io integration provides instant updates:

```javascript
// Backend emits to specific user
emitToUser(freelancerId, 'hired', {
  message: `You have been hired for "${gigTitle}"!`,
  gigId,
  timestamp: new Date()
});

// Frontend listens and shows toast
socket.on('hired', (data) => {
  toast.success(data.message);
});
```

## 🎨 UI/UX Highlights

- **Glassmorphism Design** - Modern backdrop blur effects
- **Premium Gradients** - Custom color palettes
- **Smooth Animations** - Hover effects and transitions
- **Responsive Layout** - Mobile-first design
- **Loading States** - Skeleton screens and spinners
- **Toast Notifications** - User-friendly feedback

## 🔐 Security Features

- ✅ HttpOnly cookies (no localStorage for tokens)
- ✅ CORS configured for credentials
- ✅ Password hashing with bcrypt
- ✅ JWT expiration
- ✅ Input validation
- ✅ Protected routes
- ✅ Environment variables for secrets

## 📦 Production Deployment

### Backend (Render/Railway/AWS)

1. Set environment variables in platform dashboard
2. Deploy from Git repository
3. Ensure MongoDB URI is production instance
4. Set `NODE_ENV=production`

**Build Command**: `npm install`  
**Start Command**: `npm start`

### Frontend (Vercel/Netlify)

1. Connect Git repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variables (VITE_API_URL, VITE_SOCKET_URL)
5. Deploy

## 🧪 Testing the Application

1. **Register** a new user
2. **Login** with credentials
3. **Post a gig** with title, description, and budget
4. **Logout** and register another user
5. **Bid** on the gig you created
6. **Login** as the first user (gig owner)
7. **View bids** on your gig
8. **Hire** a freelancer (watch real-time notification)
9. Try hiring again - should fail (already assigned)

## 🎯 Production-Ready Checklist

- ✅ No hardcoded secrets
- ✅ Environment variable examples provided
- ✅ Error handling implemented
- ✅ Database connection pooling
- ✅ Graceful shutdown handling
- ✅ Optimized build configuration
- ✅ SEO meta tags
- ✅ Code splitting
- ✅ No console errors
- ✅ Clean, documented code

## 📚 Additional Documentation

- [Backend Documentation](./backend/README.md) - API details, transaction logic
- [Frontend Documentation](./frontend/README.md) - Component architecture, state management

## 🤝 Contributing

This is a showcase project demonstrating **senior-level full-stack development**. The code follows industry best practices and is **production-ready**.

## 📄 License

MIT License - Free to use for portfolio and learning purposes.

---

**Built with ❤️ by a Senior Full-Stack Engineer**

Demonstrates: **MongoDB Transactions**, **Real-Time Systems**, **Production Architecture**, **Clean Code**, **Modern UI/UX**
