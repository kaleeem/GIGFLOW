const mongoose = require('mongoose');
const Bid = require('../models/Bid');
const Gig = require('../models/Gig');
const { emitToUser } = require('../config/socket');

/**
 * Bid Controller
 * Handles bidding and transaction-safe hiring logic
 */

/**
 * @route   POST /api/bids
 * @desc    Create new bid on a gig
 * @access  Private
 */
const createBid = async (req, res, next) => {
    try {
        const { gigId, message, price } = req.body;

        if (!gigId || !message || !price) {
            return res.status(400).json({
                success: false,
                message: 'Please provide gigId, message, and price'
            });
        }

        const gig = await Gig.findById(gigId);

        if (!gig) {
            return res.status(404).json({
                success: false,
                message: 'Gig not found'
            });
        }

        if (gig.status !== 'open') {
            return res.status(400).json({
                success: false,
                message: 'This gig is no longer accepting bids'
            });
        }

        if (gig.ownerId.toString() === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: 'You cannot bid on your own gig'
            });
        }

        const bid = await Bid.create({
            gigId,
            freelancerId: req.user._id,
            message,
            price
        });

        await bid.populate([
            { path: 'freelancerId', select: 'name email' },
            { path: 'gigId', select: 'title budget status' }
        ]);

        res.status(201).json({
            success: true,
            message: 'Bid submitted successfully',
            bid
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'You have already submitted a bid for this gig'
            });
        }
        next(error);
    }
};

/**
 * @route   GET /api/bids/:gigId
 * @desc    Get all bids for a gig (owner only)
 * @access  Private
 */
const getBidsForGig = async (req, res, next) => {
    try {
        const { gigId } = req.params;
        const gig = await Gig.findById(gigId);

        if (!gig) {
            return res.status(404).json({
                success: false,
                message: 'Gig not found'
            });
        }

        if (gig.ownerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Only the gig owner can view bids'
            });
        }

        const bids = await Bid.find({ gigId })
            .populate('freelancerId', 'name email')
            .sort({ createdAt: -1 })
            .lean();

        res.status(200).json({
            success: true,
            count: bids.length,
            bids
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   PATCH /api/bids/:bidId/hire
 * @desc    Hire a freelancer (transaction-safe)
 * @access  Private
 */
const hireBid = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { bidId } = req.params;

        const bid = await Bid.findById(bidId)
            .populate('gigId')
            .populate('freelancerId', 'name email')
            .session(session);

        if (!bid) {
            throw new Error('BID_NOT_FOUND');
        }

        const gig = bid.gigId;

        if (gig.ownerId.toString() !== req.user._id.toString()) {
            throw new Error('UNAUTHORIZED');
        }

        if (gig.status === 'assigned') {
            throw new Error('ALREADY_ASSIGNED');
        }

        const gigUpdate = await Gig.findOneAndUpdate(
            { _id: gig._id, status: 'open' },
            { status: 'assigned' },
            { new: true, session }
        );

        if (!gigUpdate) {
            throw new Error('RACE_CONDITION_LOST');
        }

        await Bid.findByIdAndUpdate(bidId, { status: 'hired' }, { session });

        await Bid.updateMany(
            { gigId: gig._id, _id: { $ne: bidId }, status: 'pending' },
            { status: 'rejected' },
            { session }
        );

        await session.commitTransaction();
        try {
            emitToUser(bid.freelancerId._id.toString(), 'hired', {
                message: `You have been hired for "${gig.title}"!`,
                gigId: gig._id,
                gigTitle: gig.title,
                timestamp: new Date()
            });
        } catch (socketError) {
            console.error('Socket notification error:', socketError);
        }

        res.status(200).json({
            success: true,
            message: `${bid.freelancerId.name} has been hired successfully!`,
            bid: {
                ...bid.toObject(),
                status: 'hired'
            }
        });

    } catch (error) {
        await session.abortTransaction();
        if (error.message === 'BID_NOT_FOUND') {
            return res.status(404).json({ success: false, message: 'Bid not found' });
        }
        if (error.message === 'UNAUTHORIZED') {
            return res.status(403).json({ success: false, message: 'Only the gig owner can hire for this gig' });
        }
        if (error.message === 'ALREADY_ASSIGNED' || error.message === 'RACE_CONDITION_LOST') {
            return res.status(400).json({ success: false, message: 'This gig has already been assigned' });
        }

        console.error('Transaction error:', error);
        next(error);
    } finally {
        session.endSession();
    }
};

module.exports = { createBid, getBidsForGig, hireBid };
