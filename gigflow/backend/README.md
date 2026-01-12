# GigFlow Backend

Production-ready Node.js/Express backend with **MongoDB transactions** and **Socket.io** real-time notifications.

## 🏗️ Architecture

### MVC Pattern
- **Models**: Mongoose schemas with validation and indexing
- **Views**: JSON API responses
- **Controllers**: Business logic and transaction handling
- **Routes**: API endpoint definitions
- **Middlewares**: Authentication and error handling

### Database Design

#### User Model
```javascript
{
  name: String (required, 2-50 chars),
  email: String (unique, required, indexed),
  password: String (bcrypt hashed, required),
  timestamps: true
}
```

#### Gig Model
```javascript
{
  title: String (required, 5-100 chars),
  description: String (required, 20-2000 chars),
  budget: Number (required, $1-$1M),
  ownerId: ObjectId (ref: User, indexed),
  status: Enum ['open', 'assigned'] (default: 'open', indexed),
  timestamps: true
}
```

#### Bid Model
```javascript
{
  gigId: ObjectId (ref: Gig, indexed),
  freelancerId: ObjectId (ref: User, indexed),
  message: String (required, 10-1000 chars),
  price: Number (required, $1-$1M),
  status: Enum ['pending', 'hired', 'rejected'] (default: 'pending'),
  timestamps: true
}
// Unique constraint: (gigId + freelancerId) - prevents duplicate bids
```

### Indexes
```javascript
// User
{ email: 1 }

// Gig
{ status: 1, createdAt: -1 }
{ ownerId: 1, status: 1 }
{ title: 'text', description: 'text' } // Full-text search

// Bid
{ gigId: 1, status: 1 }
{ freelancerId: 1, status: 1 }
{ gigId: 1, freelancerId: 1 } (unique)
```

## 🔥 Critical Implementation: Transaction-Safe Hiring

### The Problem
When multiple users try to hire different freelancers for the same gig simultaneously:
- Without transactions: Multiple bids could be marked as "hired"
- Race condition: Gig status could be inconsistent with bid statuses

### The Solution
MongoDB **Multi-Document ACID Transactions** with **Optimistic Locking**

```javascript
const hireBid = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Find bid with session
    const bid = await Bid.findById(bidId).session(session);
    
    // 2. CRITICAL: Conditional update with optimistic locking
    const gigUpdate = await Gig.findOneAndUpdate(
      { 
        _id: gig._id,
        status: 'open' // Only update if STILL open
      },
      { status: 'assigned' },
      { new: true, session }
    );

    // 3. If gigUpdate is null, another transaction won
    if (!gigUpdate) {
      await session.abortTransaction();
      return error('Already hired');
    }

    // 4. Update hired bid
    await Bid.findByIdAndUpdate(bidId, { status: 'hired' }, { session });

    // 5. Reject all other pending bids
    await Bid.updateMany(
      { gigId, _id: { $ne: bidId }, status: 'pending' },
      { status: 'rejected' },
      { session }
    );

    // 6. Commit - all or nothing
    await session.commitTransaction();
    
    // 7. Send real-time notification
    emitToUser(freelancerId, 'hired', data);

  } catch (error) {
    // Rollback on any error
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
```

### Why This Works
1. **Session**: Groups operations into atomic unit
2. **Conditional Update**: `{ status: 'open' }` acts as a lock
3. **First Transaction Wins**: Updates gig from 'open' to 'assigned'
4. **Second Transaction Fails**: Condition no longer matches, returns null
5. **Rollback**: Failed transaction undoes all changes
6. **Consistency**: Database always in valid state

## 🌐 API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register new user with automatic login.

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secure123"
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "Registration successful",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```
**Sets HttpOnly Cookie**: `token=<JWT>`

---

#### POST /api/auth/login
Login existing user.

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "secure123"
}
```

**Response** (200): Same as register  
**Sets HttpOnly Cookie**: `token=<JWT>`

---

#### POST /api/auth/logout
Logout current user.

**Response** (200):
```json
{
  "success": true,
  "message": "Logout successful"
}
```
**Clears Cookie**: Expires token immediately

---

#### GET /api/auth/me
Get current authenticated user.

**Headers**: Cookie with valid JWT required

**Response** (200):
```json
{
  "success": true,
  "user": { ... }
}
```

### Gig Endpoints

#### GET /api/gigs
Get all gigs with optional search and filters.

**Query Parameters**:
- `search` (optional): Full-text search on title/description
- `status` (optional): Filter by 'open' or 'assigned'

**Example**: `/api/gigs?search=website&status=open`

**Response** (200):
```json
{
  "success": true,
  "count": 10,
  "gigs": [...]
}
```

---

#### POST /api/gigs
Create new gig (requires auth).

**Request Body**:
```json
{
  "title": "Build React App",
  "description": "Need a responsive web app...",
  "budget": 1500
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "Gig created successfully",
  "gig": { ... }
}
```

---

#### GET /api/gigs/:id
Get single gig by ID.

**Response** (200):
```json
{
  "success": true,
  "gig": {
    "_id": "...",
    "title": "...",
    "ownerId": { "name": "...", "email": "..." },
    ...
  }
}
```

### Bid Endpoints

#### POST /api/bids
Submit bid on a gig (requires auth).

**Request Body**:
```json
{
  "gigId": "...",
  "message": "I'm perfect for this job because...",
  "price": 1200
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "Bid submitted successfully",
  "bid": { ... }
}
```

---

#### GET /api/bids/:gigId
Get all bids for a gig (gig owner only).

**Response** (200):
```json
{
  "success": true,
  "count": 5,
  "bids": [
    {
      "_id": "...",
      "freelancerId": { "name": "...", "email": "..." },
      "message": "...",
      "price": 1200,
      "status": "pending"
    }
  ]
}
```

---

#### PATCH /api/bids/:bidId/hire
**🔥 CRITICAL ENDPOINT**: Hire a freelancer (transaction-safe).

**Authorization**: Gig owner only

**Response** (200):
```json
{
  "success": true,
  "message": "John Doe has been hired successfully!",
  "bid": { ..., "status": "hired" }
}
```

**Side Effects**:
1. Updates gig status to 'assigned'
2. Updates selected bid to 'hired'
3. Rejects all other pending bids
4. Emits real-time notification to hired freelancer

**Error Response** (400) - Race Condition:
```json
{
  "success": false,
  "message": "This gig has already been assigned to another freelancer"
}
```

## 📡 Socket.io Events

### Server Emits

#### `hired`
Emitted to specific user when they are hired.

**Payload**:
```javascript
{
  message: "You have been hired for 'Build React App'!",
  gigId: "...",
  gigTitle: "Build React App",
  timestamp: "2024-01-12T..."
}
```

**Target**: `user_${userId}` room

### Client Emits

#### `join`
Client joins their user-specific room for notifications.

**Payload**: `userId`

## 🔐 Authentication Flow

1. User submits credentials to `/api/auth/login`
2. Server validates and generates JWT
3. JWT stored in **HttpOnly cookie** (browser cannot access via JavaScript)
4. Cookie sent automatically with every request
5. `protect` middleware extracts and verifies JWT
6. User object attached to `req.user`

## 🚀 Deployment

### Environment Variables
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/gigflow
JWT_SECRET=<64-char-random-string>
JWT_EXPIRE=7d
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://gigflow-frontend.vercel.app
```

### Production Checklist
- ✅ Use MongoDB Atlas or production database
- ✅ Generate secure JWT secret (min 64 chars)
- ✅ Set `NODE_ENV=production`
- ✅ Enable HTTPS (required for secure cookies)
- ✅ Configure CORS with exact frontend URL
- ✅ Enable MongoDB connection pooling
- ✅ Set up error monitoring (Sentry, etc.)

### Start Command
```bash
npm start
```

## 📊 Performance Optimizations

1. **Database Indexing**: Fast queries on common fields
2. **Lean Queries**: Return plain JavaScript objects (no Mongoose overhead)
3. **Connection Pooling**: Reuse database connections
4. **Async/Await**: Non-blocking operations
5. **Conditional Updates**: Reduce database round trips

## 🧪 Testing Concurrent Hires

Use tools like **Postman** or **Artillery** to send simultaneous requests:

```bash
# Terminal 1
curl -X PATCH http://localhost:5000/api/bids/BID_ID_1/hire \
  -H "Cookie: token=USER1_TOKEN"

# Terminal 2 (run simultaneously)
curl -X PATCH http://localhost:5000/api/bids/BID_ID_2/hire \
  -H "Cookie: token=USER1_TOKEN"
```

**Expected Result**: One succeeds, one returns "already assigned" error.

---

**Showcases**: Enterprise-grade backend architecture, ACID transactions, real-time systems, security best practices
