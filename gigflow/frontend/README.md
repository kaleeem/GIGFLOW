# GigFlow Frontend

Modern React application with **Redux Toolkit** state management and **premium UI/UX** design.

## 🏗️ Architecture

### Component Structure
```
src/
├── app/
│   └── store.js              # Redux store configuration
├── features/
│   ├── auth/
│   │   └── authSlice.js      # Auth state management
│   ├── gig/
│   │   └── gigSlice.js       # Gig state management
│   └── bid/
│       └── bidSlice.js       # Bid state management
├── components/
│   ├── Navbar.jsx            # Navigation bar
│   ├── ProtectedRoute.jsx    # Auth guard
│   ├── GigCard.jsx           # Gig display card
│   ├── BidCard.jsx           # Bid display card
│   └── NotificationToast.jsx # Real-time notifications
├── pages/
│   ├── Login.jsx             # Login page
│   ├── Register.jsx          # Registration page
│   ├── GigFeed.jsx           # Browse gigs
│   ├── CreateGig.jsx         # Post new gig
│   └── GigDetail.jsx         # Gig details & bidding
├── services/
│   ├── api.js                # Axios instance
│   └── socket.js             # Socket.io client
└── main.jsx                  # App entry point
```

## 🔄 State Management

### Redux Slices

#### Auth Slice
**State**:
```javascript
{
  user: null | { id, name, email },
  isAuthenticated: boolean,
  loading: boolean,
  error: string | null
}
```

**Actions**:
- `register(userData)` - Register new user
- `login(credentials)` - Login user
- `logout()` - Logout user
- `getMe()` - Get current user (auto-called on app load)

**Side Effects**:
- Initializes Socket.io on successful login/register
- Disconnects Socket.io on logout

---

#### Gig Slice
**State**:
```javascript
{
  gigs: [],
  currentGig: null,
  loading: boolean,
  error: string | null
}
```

**Actions**:
- `fetchGigs({ search, status })` - Get all gigs with filters
- `fetchGigById(gigId)` - Get single gig
- `createGig(gigData)` - Create new gig

---

#### Bid Slice
**State**:
```javascript
{
  bids: [],
  loading: boolean,
  error: string | null
}
```

**Actions**:
- `createBid(bidData)` - Submit bid
- `fetchBidsForGig(gigId)` - Get bids (owner only)
- `hireBid(bidId)` - Hire freelancer (transaction-safe)

**Optimistic Updates**:
- On successful hire, automatically updates all bid statuses in local state

## 🎨 UI/UX Design System

### Color Palette
```javascript
// Primary (Blues)
primary-500: '#0ea5e9'  // Main actions
primary-400: '#38bdf8'  // Highlights

// Dark (Backgrounds)
dark-900: '#0f172a'     // Main background
dark-800: '#1e293b'     // Cards
dark-700: '#334155'     // Inputs

// Gradients
gradient-premium: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
gradient-success: 'linear-gradient(135deg, #667eea 0%, #00c9ff 100%)'
```

### Typography
- **Font**: Inter (Google Fonts)
- **Sizes**: 
  - Headings: 2xl-5xl
  - Body: sm-lg
  - Small: xs

### Animations
```javascript
'fade-in': 'fadeIn 0.3s ease-in-out'
'slide-up': 'slideUp 0.4s ease-out'
'slide-in': 'slideIn 0.3s ease-out'
```

### Components

#### Navbar
- Glassmorphism backdrop blur
- Gradient logo
- Conditional rendering based on auth state
- Responsive mobile menu

#### GigCard
- Hover effects with border color change
- Shadow glow on hover
- Status badges (Open/Assigned)
- Truncated text with ellipsis

#### BidCard
- Dynamic status styling
- Hire button for owners
- Confirmation dialog
- Loading states

#### NotificationToast
- Dark theme
- Auto-dismiss (5s for hired notifications)
- Position: top-right
- Icon support

## 🔌 Services

### API Service (Axios)
```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // CRITICAL: Send cookies
  headers: { 'Content-Type': 'application/json' }
});
```

**Interceptors**:
- Request: Logs outgoing requests
- Response: Handles errors consistently

### Socket Service
```javascript
// Initialize on login
initializeSocket(userId);

// Listen for hired events
onHired((data) => {
  toast.success(data.message);
});

// Disconnect on logout
disconnectSocket();
```

## 📱 Pages

### GigFeed (/)
- Public page (no auth required)
- Real-time search (debounced)
- Status filter (Open/Assigned)
- Responsive grid layout
- Empty state handling

### Login (/login)
- Glassmorphism design
- Form validation
- Loading spinner
- Auto-redirect if authenticated

### Register (/register)
- Password confirmation
- Client-side validation
- Auto-login on success

### CreateGig (/create-gig)
- Protected route
- Character counters (100 title, 2000 description)
- Budget input with $ prefix
- Success toast + redirect

### GigDetail (/gig/:id)
- Public gig info
- Conditional bid form (auth + open status)
- Owner sees bids sidebar
- Real-time bid updates
- Hire functionality

## 🔐 Authentication Flow

1. User submits login form
2. Redux dispatches `login()` thunk
3. Axios sends request with `withCredentials: true`
4. Server sets HttpOnly cookie
5. Cookie automatically sent with all future requests
6. Socket.io initialized with user ID
7. User joins Socket room for notifications

## 🌐 Real-Time Notifications

```javascript
// In NotificationToast.jsx
useEffect(() => {
  if (!isAuthenticated) return;

  onHired((data) => {
    toast.success(
      <div>
        <p className="font-bold">🎉 Congratulations!</p>
        <p>{data.message}</p>
      </div>,
      { autoClose: 5000 }
    );
  });
}, [isAuthenticated]);
```

**Flow**:
1. Gig owner hires freelancer on GigDetail page
2. Backend emits `hired` event via Socket.io
3. Frontend Socket listener receives event
4. React Toast displays notification
5. No page refresh needed!

## 🚀 Development

### Start Dev Server
```bash
npm run dev
```
Runs on http://localhost:5173

### Build for Production
```bash
npm run build
```
Output: `dist/` directory

### Preview Production Build
```bash
npm run preview
```

## 📦 Production Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import repository in Vercel
3. Set environment variables:
   - `VITE_API_URL=https://your-backend.com`
   - `VITE_SOCKET_URL=https://your-backend.com`
4. Deploy

### Netlify
1. Build command: `npm run build`
2. Publish directory: `dist`
3. Add environment variables
4. Deploy

### Build Optimizations
- **Code Splitting**: Vendor and Redux chunks separated
- **Tree Shaking**: Unused code removed
- **Minification**: Production builds minified
- **Source Maps**: Disabled for production

## 🎯 Best Practices Implemented

### Performance
- ✅ React.memo for expensive components
- ✅ useCallback for event handlers
- ✅ Lazy loading (code splitting)
- ✅ Optimized images
- ✅ Debounced search

### Accessibility
- ✅ Semantic HTML
- ✅ ARIA labels
- ✅ Keyboard navigation
- ✅ Focus states
- ✅ Alt text for images

### SEO
- ✅ Meta tags in index.html
- ✅ Descriptive title
- ✅ Semantic headings
- ✅ Unique IDs for elements

### Security
- ✅ No localStorage for tokens
- ✅ XSS protection (React escapes by default)
- ✅ HTTPS in production
- ✅ Environment variable separation

## 🧪 Testing User Flows

### Registration Flow
1. Navigate to `/register`
2. Fill form (name, email, password, confirm)
3. Submit
4. Auto-login → Redirect to `/`
5. Socket.io connected

### Gig Creation Flow
1. Click "Post a Gig"
2. Fill form (title, description, budget)
3. Submit
4. Toast notification
5. Redirect to `/` (gig appears at top)

### Bidding Flow
1. Click on gig card
2. View gig details
3. Click "Place a Bid"
4. Fill bid form (message, price)
5. Submit
6. Toast confirmation

### Hiring Flow (Owner)
1. View own gig
2. See bids in sidebar
3. Click "Hire" on a bid
4. Confirm dialog
5. Success toast
6. All bids update (hired/rejected)
7. **Freelancer receives real-time notification**

## 🎨 Design Highlights

### Glassmorphism
```css
background: rgba(30, 41, 59, 0.5);
backdrop-filter: blur(16px);
border: 1px solid rgba(51, 65, 85, 1);
```

### Gradients
```css
/* Premium purple gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Success blue gradient */
background: linear-gradient(135deg, #667eea 0%, #00c9ff 100%);
```

### Hover Effects
```css
transition: all 0.3s ease;
hover:border-primary-500
hover:shadow-xl
hover:shadow-primary-500/10
```

## 📊 Bundle Analysis

Production build includes:
- **Vendor chunk**: React, ReactDOM, Router (~140KB gzipped)
- **Redux chunk**: Redux Toolkit, React-Redux (~25KB gzipped)
- **App chunk**: Application code (~30KB gzipped)
- **Total**: ~195KB gzipped (excellent for modern SPA)

---

**Showcases**: Modern React architecture, Redux Toolkit, Real-time WebSockets, Premium UI/UX, Production optimization
