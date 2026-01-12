const Gig = require('../models/Gig');

/**
 * Gig Controller
 * Handles gig creation, listing, and search functionality
 */

/**
 * @route   POST /api/gigs
 * @desc    Create new gig
 * @access  Private
 */
const createGig = async (req, res, next) => {
    try {
        const { title, description, budget } = req.body;

        if (!title || !description || !budget) {
            return res.status(400).json({
                success: false,
                message: 'Please provide title, description, and budget'
            });
        }

        const gig = await Gig.create({
            title,
            description,
            budget,
            ownerId: req.user._id
        });

        await gig.populate('ownerId', 'name email');

        res.status(201).json({
            success: true,
            message: 'Gig created successfully',
            gig
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   GET /api/gigs
 * @desc    Get all gigs with optional search
 * @access  Public
 */
const getGigs = async (req, res, next) => {
    try {
        const { search, status } = req.query;
        let query = {};

        if (search) {
            query.$text = { $search: search };
        }

        if (status) {
            query.status = status;
        }

        const gigs = await Gig.find(query)
            .populate('ownerId', 'name email')
            .sort({ createdAt: -1 })
            .lean();

        res.status(200).json({
            success: true,
            count: gigs.length,
            gigs
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   GET /api/gigs/:id
 * @desc    Get single gig by ID
 * @access  Public
 */
const getGigById = async (req, res, next) => {
    try {
        const gig = await Gig.findById(req.params.id)
            .populate('ownerId', 'name email')
            .lean();

        if (!gig) {
            return res.status(404).json({
                success: false,
                message: 'Gig not found'
            });
        }

        res.status(200).json({
            success: true,
            gig
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { createGig, getGigs, getGigById };
