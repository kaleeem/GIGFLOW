const mongoose = require('mongoose');

/**
 * Bid Model
 * Represents bids submitted by freelancers on gigs
 */

const bidSchema = new mongoose.Schema({
    gigId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gig',
        required: [true, 'Gig ID is required'],
        index: true
    },
    freelancerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Freelancer ID is required'],
        index: true
    },
    message: {
        type: String,
        required: [true, 'Bid message is required'],
        trim: true,
        minlength: [10, 'Message must be at least 10 characters'],
        maxlength: [1000, 'Message cannot exceed 1000 characters']
    },
    price: {
        type: Number,
        required: [true, 'Bid price is required'],
        min: [1, 'Price must be at least $1'],
        max: [1000000, 'Price cannot exceed $1,000,000']
    },
    status: {
        type: String,
        enum: {
            values: ['pending', 'hired', 'rejected'],
            message: 'Status must be pending, hired, or rejected'
        },
        default: 'pending',
        index: true
    }
}, {
    timestamps: true
});

// Compound indexes for efficient queries
bidSchema.index({ gigId: 1, status: 1 });
bidSchema.index({ freelancerId: 1, status: 1 });

// Prevent duplicate bids from same freelancer on same gig
bidSchema.index({ gigId: 1, freelancerId: 1 }, { unique: true });

module.exports = mongoose.model('Bid', bidSchema);
