const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const errorHandler = require('./middlewares/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const gigRoutes = require('./routes/gig');
const bidRoutes = require('./routes/bid');

/**
 * Express Application Configuration
 * Serves both API and frontend in single deployment
 */

const app = express();

// Security headers - configured for serving static files
app.use(helmet({
    contentSecurityPolicy: false, // Allow inline scripts for React
    crossOriginEmbedderPolicy: false
}));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser());

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// API Routes - these take priority over static files
app.use('/api/auth', authRoutes);
app.use('/api/gigs', gigRoutes);
app.use('/api/bids', bidRoutes);

// Serve static files from frontend build
// This serves index.html, assets/, etc.
app.use(express.static(path.join(__dirname, '../public')));

// SPA fallback - serve index.html for any non-API routes
// This allows React Router to handle client-side routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Error handling middleware (must be last)
app.use(errorHandler);

module.exports = app;
