import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import gigReducer from '../features/gig/gigSlice';
import bidReducer from '../features/bid/bidSlice';

/**
 * Redux Store Configuration
 */

export const store = configureStore({
    reducer: {
        auth: authReducer,
        gig: gigReducer,
        bid: bidReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        }),
    devTools: import.meta.env.MODE !== 'production'
});
