const express = require('express');
const { createBid, getBidsForGig, hireBid } = require('../controllers/bidController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

/**
 * Bid Routes
 */

router.post('/', protect, createBid);  // Create new bid

router.get('/:gigId', protect, getBidsForGig);  // Get bids for gig (owner only)

router.patch('/:bidId/hire', protect, hireBid);  // Hire bid (owner only, transaction-safe)

module.exports = router;
