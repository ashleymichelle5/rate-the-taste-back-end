const express = require('express');
const router = express.Router();
const Review = require('../models/review');
const Restaurant = require('../models/restaurant');
const verifyToken = require('../middleware/verify-token');

// Get user's reviews
router.get('/user', verifyToken, async (req, res) => {
    try {
        const reviews = await Review.find({ user: req.user._id })
            .populate('user', 'username')
            .populate('restaurant', 'name');
        res.json(reviews);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});

// Get restaurant reviews
router.get('/restaurant/:restaurantId/reviews', async (req, res) => {
    try {
        const reviews = await Review.find({ restaurant: req.params.restaurantId })
            .populate('user', 'username');
        res.json(reviews);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});

// Create review
router.post('/restaurant/:restaurantId/reviews', verifyToken, async (req, res) => {
    try {
        const reviewData = {
            ...req.body,
            user: req.user._id,
            restaurant: req.params.restaurantId
        };

        const review = await Review.create(reviewData);
        
        await Restaurant.findByIdAndUpdate(
            req.params.restaurantId,
            { $push: { reviews: review._id }}, 
            {new: true,}
        );

        res.status(201).json(review);
    } catch(error) {
        if(error.code === 11000) {
            return res.status(400).json({ error: 'You have already reviewed this restaurant.' });
        }
        if(error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }        
        res.status(500).json({ error: error.message });
    }
});

// Update review
router.put('/restaurant/:restaurantId/reviews/:reviewId', verifyToken, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if(!review) {
            return res.status(404).json({ error: 'Review not found.' });
        }
        if(review.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'You can only edit your own reviews.' });
        }

        const updatedReview = await Review.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        res.json(updatedReview);
    } catch(error) {
        if(error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }        
        res.status(500).json({ error: error.message });
    }
});

// Delete review
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if(!review) {
            return res.status(404).json({ error: 'Review not found.' });
        }
        if(review.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'You can only delete your own reviews.' });
        }

        await Review.findByIdAndDelete(req.params.id);
        await Restaurant.findByIdAndUpdate(
            review.restaurant,
            { $pull: { reviews: review._id } }
        );
        
        res.json({ message: 'Review deleted successfully.' });
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;