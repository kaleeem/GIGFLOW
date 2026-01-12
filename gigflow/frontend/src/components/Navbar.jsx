import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';

/**
 * Navigation Bar Component
 * Responsive navbar with auth state management
 */

const Navbar = () => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <nav className="bg-dark-900 border-b border-dark-700 sticky top-0 z-50 backdrop-blur-lg bg-opacity-90">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="w-10 h-10 rounded-lg bg-gradient-premium flex items-center justify-center group-hover:scale-110 transition-transform">
                            <span className="text-white font-bold text-xl">G</span>
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-purple-500 bg-clip-text text-transparent">
                            GigFlow
                        </span>
                    </Link>

                    {/* Nav Links */}
                    <div className="flex items-center space-x-6">
                        <Link
                            to="/"
                            className="text-gray-300 hover:text-white transition-colors font-medium"
                        >
                            Browse Gigs
                        </Link>

                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/create-gig"
                                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-all hover:shadow-lg hover:shadow-primary-500/50"
                                >
                                    Post a Gig
                                </Link>
                                <div className="flex items-center space-x-4">
                                    <div className="text-sm">
                                        <span className="text-gray-400">Welcome, </span>
                                        <span className="text-white font-medium">{user?.name}</span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    to="/login"
                                    className="text-gray-300 hover:text-white transition-colors font-medium"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-gradient-premium text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
