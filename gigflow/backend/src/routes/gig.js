const express = require('express');
const { createGig, getGigs, getGigById } = require('../controllers/gigController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

/**
 * Gig Routes
 */

router.route('/')
    .get(getGigs)           // Public - get all gigs with optional search
    .post(protect, createGig);  // Private - create new gig

router.get('/:id', getGigById);  // Public - get single gig

module.exports = router;
