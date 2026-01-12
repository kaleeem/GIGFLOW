/**
 * Centralized Error Handling Middleware
 * Provides consistent error responses across the application
 */

const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    console.error('❌ Error:', err);

    if (err.name === 'CastError') {
        error.message = 'Resource not found';
        error.statusCode = 404;
    }

    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        error.message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
        error.statusCode = 400;
    }

    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        error.message = messages.join(', ');
        error.statusCode = 400;
    }

    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = errorHandler;
