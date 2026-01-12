require('./config/env');

const http = require('http');
const app = require('./app');
const connectDB = require('./config/database');
const { initializeSocket } = require('./config/socket');

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

initializeSocket(server);

const startServer = async () => {
    try {
        await connectDB();
        server.listen(PORT, () => {
            console.log(`\n🚀 Server running in ${process.env.NODE_ENV || 'development'} mode`);
            console.log(`🔗 Server: http://localhost:${PORT}`);
            console.log(`📡 Socket.io: Ready for real-time connections`);
            console.log(`\n✨ GigFlow Marketplace API is ready!\n`);
        });
    } catch (error) {
        console.error('❌ Server failed to start:', error);
        process.exit(1);
    }
};

process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Promise Rejection:', err);
    server.close(() => process.exit(1));
});

process.on('SIGTERM', () => {
    console.log('👋 SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});

startServer();
