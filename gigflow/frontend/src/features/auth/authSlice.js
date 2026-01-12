import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { initializeSocket, disconnectSocket } from '../../services/socket';

/**
 * Auth Slice - Redux State Management for Authentication
 */

const initialState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null
};

// Register user
export const register = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await api.post('/api/auth/register', userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Registration failed');
        }
    }
);

// Login user
export const login = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await api.post('/api/auth/login', credentials);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    }
);

// Get current user
export const getMe = createAsyncThunk(
    'auth/getMe',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/api/auth/me');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to get user');
        }
    }
);

// Logout user
export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.post('/api/auth/logout');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Logout failed');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        // Register
        builder.addCase(register.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(register.fulfilled, (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
            // Initialize socket on successful registration
            if (action.payload.user?.id) {
                initializeSocket(action.payload.user.id);
            }
        });
        builder.addCase(register.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // Login
        builder.addCase(login.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(login.fulfilled, (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
            // Initialize socket on successful login
            if (action.payload.user?.id) {
                initializeSocket(action.payload.user.id);
            }
        });
        builder.addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // Get Me
        builder.addCase(getMe.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getMe.fulfilled, (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
            // Initialize socket
            if (action.payload.user?.id) {
                initializeSocket(action.payload.user.id);
            }
        });
        builder.addCase(getMe.rejected, (state) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.user = null;
        });

        // Logout
        builder.addCase(logout.fulfilled, (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
            // Disconnect socket on logout
            disconnectSocket();
        });
    }
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
