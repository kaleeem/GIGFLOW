import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

/**
 * Bid Slice - Redux State Management for Bids
 */

const initialState = {
    bids: [],
    loading: false,
    error: null
};

// Create bid
export const createBid = createAsyncThunk(
    'bid/createBid',
    async (bidData, { rejectWithValue }) => {
        try {
            const response = await api.post('/api/bids', bidData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create bid');
        }
    }
);

// Fetch bids for a gig
export const fetchBidsForGig = createAsyncThunk(
    'bid/fetchBidsForGig',
    async (gigId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/api/bids/${gigId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch bids');
        }
    }
);

// Hire bid
export const hireBid = createAsyncThunk(
    'bid/hireBid',
    async (bidId, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/api/bids/${bidId}/hire`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to hire');
        }
    }
);

const bidSlice = createSlice({
    name: 'bid',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearBids: (state) => {
            state.bids = [];
        },
        updateBidStatus: (state, action) => {
            const { bidId, status } = action.payload;
            const bid = state.bids.find(b => b._id === bidId);
            if (bid) {
                bid.status = status;
            }
        }
    },
    extraReducers: (builder) => {
        // Create bid
        builder.addCase(createBid.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(createBid.fulfilled, (state, action) => {
            state.loading = false;
            state.bids.unshift(action.payload.bid);
        });
        builder.addCase(createBid.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // Fetch bids
        builder.addCase(fetchBidsForGig.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchBidsForGig.fulfilled, (state, action) => {
            state.loading = false;
            state.bids = action.payload.bids;
        });
        builder.addCase(fetchBidsForGig.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // Hire bid
        builder.addCase(hireBid.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(hireBid.fulfilled, (state, action) => {
            state.loading = false;
            // Update bid statuses
            const hiredBidId = action.payload.bid._id;
            state.bids = state.bids.map(bid => {
                if (bid._id === hiredBidId) {
                    return { ...bid, status: 'hired' };
                } else if (bid.status === 'pending') {
                    return { ...bid, status: 'rejected' };
                }
                return bid;
            });
        });
        builder.addCase(hireBid.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    }
});

export const { clearError, clearBids, updateBidStatus } = bidSlice.actions;
export default bidSlice.reducer;
