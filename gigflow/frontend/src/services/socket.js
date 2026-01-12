import { io } from 'socket.io-client';

/**
 * Socket.io Client Service
 * Manages real-time connections for notifications
 */

let socket = null;

export const initializeSocket = (userId) => {
    if (!socket) {
        socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
            withCredentials: true,
            transports: ['websocket', 'polling']
        });

        socket.on('connect', () => {
            console.log('✅ Socket connected:', socket.id);
            if (userId) {
                socket.emit('join', userId);
            }
        });

        socket.on('disconnect', () => {
            console.log('🔌 Socket disconnected');
        });

        socket.on('connect_error', (error) => {
            console.error('❌ Socket connection error:', error);
        });
    }

    return socket;
};

export const getSocket = () => {
    if (!socket) {
        throw new Error('Socket not initialized. Call initializeSocket first.');
    }
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
        console.log('👋 Socket disconnected');
    }
};

export const onHired = (callback) => {
    const socketInstance = getSocket();
    socketInstance.on('hired', callback);
};

export const offHired = () => {
    const socketInstance = getSocket();
    socketInstance.off('hired');
};
