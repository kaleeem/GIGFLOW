const User = require('../models/User');

/**
 * Authentication Controller
 * Handles user registration, login, and logout with HttpOnly cookies
 */

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 * @access  Public
 */
const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, email, and password'
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        const user = await User.create({ name, email, password });
        const token = user.generateAuthToken();

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        };

        res
            .status(201)
            .cookie('token', token, cookieOptions)
            .json({
                success: true,
                message: 'Registration successful',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const isPasswordMatch = await user.comparePassword(password);

        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const token = user.generateAuthToken();

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        };

        res
            .status(200)
            .cookie('token', token, cookieOptions)
            .json({
                success: true,
                message: 'Login successful',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
const logout = async (req, res, next) => {
    try {
        res
            .status(200)
            .cookie('token', '', {
                httpOnly: true,
                expires: new Date(0)
            })
            .json({
                success: true,
                message: 'Logout successful'
            });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
const getMe = async (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { register, login, logout, getMe };
