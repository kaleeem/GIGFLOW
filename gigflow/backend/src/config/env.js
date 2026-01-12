/**
 * Environment Variable Validation
 * Ensures all required environment variables are present on startup
 */

require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];

const optionalEnvVars = {
    PORT: 5000,
    NODE_ENV: 'development',
    JWT_EXPIRE: '7d',
    FRONTEND_URL: 'http://localhost:5173'
};

requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
        console.error(`❌ FATAL ERROR: Missing required environment variable: ${varName}`);
        process.exit(1);
    }
});

Object.keys(optionalEnvVars).forEach(varName => {
    if (!process.env[varName]) {
        process.env[varName] = optionalEnvVars[varName];
    }
});

if (process.env.NODE_ENV === 'production' && process.env.JWT_SECRET.length < 32) {
    console.warn('⚠️  WARNING: JWT_SECRET should be at least 32 characters long in production');
}

console.log('✅ Environment variables validated');

module.exports = {};
