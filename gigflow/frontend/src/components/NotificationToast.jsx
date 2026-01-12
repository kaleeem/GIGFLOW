import React, { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { onHired, getSocket } from '../services/socket';
import { useSelector } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Notification Toast Component
 * Handles real-time Socket.io notifications
 */

const NotificationToast = () => {
    const { isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!isAuthenticated) return;

        try {
            // Listen for hired events
            onHired((data) => {
                toast.success(
                    <div>
                        <p className="font-bold">🎉 Congratulations!</p>
                        <p>{data.message}</p>
                    </div>,
                    {
                        position: 'top-right',
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true
                    }
                );
            });
        } catch (error) {
            console.error('Socket notification error:', error);
        }
    }, [isAuthenticated]);

    return (
        <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            className="mt-16"
        />
    );
};

export default NotificationToast;
