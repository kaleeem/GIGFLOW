const mongoose = require('mongoose');

/**
 * Gig Model
 * Represents job postings created by clients
 */

const gigSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        minlength: [5, 'Title must be at least 5 characters'],
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        minlength: [20, 'Description must be at least 20 characters'],
        maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    budget: {
        type: Number,
        required: [true, 'Budget is required'],
        min: [1, 'Budget must be at least $1'],
        max: [1000000, 'Budget cannot exceed $1,000,000']
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Owner ID is required'],
        index: true
    },
    status: {
        type: String,
        enum: {
            values: ['open', 'assigned'],
            message: 'Status must be either open or assigned'
        },
        default: 'open',
        index: true
    }
}, {
    timestamps: true
});

// Compound index for efficient queries
gigSchema.index({ status: 1, createdAt: -1 });
gigSchema.index({ ownerId: 1, status: 1 });

// Text index for search functionality
gigSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Gig', gigSchema);
