import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

/**
 * Gig Slice - Redux State Management for Gigs
 */

const initialState = {
    gigs: [],
    currentGig: null,
    loading: false,
    error: null
};

// Fetch all gigs
export const fetchGigs = createAsyncThunk(
    'gig/fetchGigs',
    async (params = {}, { rejectWithValue }) => {
        try {
            const { search, status } = params;
            const queryParams = new URLSearchParams();

            if (search) queryParams.append('search', search);
            if (status) queryParams.append('status', status);

            const response = await api.get(`/api/gigs?${queryParams.toString()}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch gigs');
        }
    }
);

// Fetch single gig
export const fetchGigById = createAsyncThunk(
    'gig/fetchGigById',
    async (gigId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/api/gigs/${gigId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch gig');
        }
    }
);

// Create gig
export const createGig = createAsyncThunk(
    'gig/createGig',
    async (gigData, { rejectWithValue }) => {
        try {
            const response = await api.post('/api/gigs', gigData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create gig');
        }
    }
);

const gigSlice = createSlice({
    name: 'gig',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearCurrentGig: (state) => {
            state.currentGig = null;
        }
    },
    extraReducers: (builder) => {
        // Fetch gigs
        builder.addCase(fetchGigs.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchGigs.fulfilled, (state, action) => {
            state.loading = false;
            state.gigs = action.payload.gigs;
        });
        builder.addCase(fetchGigs.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // Fetch single gig
        builder.addCase(fetchGigById.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchGigById.fulfilled, (state, action) => {
            state.loading = false;
            state.currentGig = action.payload.gig;
        });
        builder.addCase(fetchGigById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // Create gig
        builder.addCase(createGig.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(createGig.fulfilled, (state, action) => {
            state.loading = false;
            state.gigs.unshift(action.payload.gig);
        });
        builder.addCase(createGig.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    }
});

export const { clearError, clearCurrentGig } = gigSlice.actions;
export default gigSlice.reducer;
