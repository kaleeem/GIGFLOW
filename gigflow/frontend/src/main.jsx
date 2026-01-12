import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './app/store';
import { getMe } from './features/auth/authSlice';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import GigFeed from './pages/GigFeed';
import CreateGig from './pages/CreateGig';
import GigDetail from './pages/GigDetail';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import NotificationToast from './components/NotificationToast';

// Styles
import './index.css';

/**
 * App Component
 * Main application with routing and auth initialization
 */

const App = () => {
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        // Try to get current user on app load
        dispatch(getMe());
    }, [dispatch]);

    return (
        <>
            <NotificationToast />
            <Routes>
                <Route path="/" element={<GigFeed />} />
                <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
                <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Register />} />
                <Route
                    path="/create-gig"
                    element={
                        <ProtectedRoute>
                            <CreateGig />
                        </ProtectedRoute>
                    }
                />
                <Route path="/gig/:id" element={<GigDetail />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </>
    );
};

/**
 * Root Render
 */

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>
    </React.StrictMode>
);
