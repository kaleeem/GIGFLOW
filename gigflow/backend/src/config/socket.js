const { Server } = require('socket.io');

/**
 * Socket.io Configuration & Real-Time Event Management
 * Handles real-time notifications for hired freelancers
 */

let io;

const initializeSocket = (server) => {
    io = new Server(server, {
        // No CORS needed - frontend served from same origin
        pingTimeout: 60000,
        pingInterval: 25000
    });

    io.on('connection', (socket) => {
        console.log(`🔌 Socket connected: ${socket.id}`);

        // Join user-specific room for targeted notifications
        socket.on('join', (userId) => {
            socket.join(`user_${userId}`);
            console.log(`👤 User ${userId} joined their room`);
        });

        socket.on('disconnect', () => {
            console.log(`🔌 Socket disconnected: ${socket.id}`);
        });
    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
};

/**
 * Emit notification to specific user
 * @param {String} userId - Target user ID
 * @param {String} event - Event name
 * @param {Object} data - Event payload
 */
const emitToUser = (userId, event, data) => {
    const io = getIO();
    io.to(`user_${userId}`).emit(event, data);
    console.log(`📤 Emitted '${event}' to user ${userId}`);
};

module.exports = { initializeSocket, getIO, emitToUser };
