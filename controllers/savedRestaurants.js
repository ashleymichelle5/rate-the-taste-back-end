const express = require('express');
const router = express.Router();
const SavedRestaurant = require('../models/savedRestaurant');
const verifyToken = require('../middleware/verify-token');

// Get user's saved restaurants
router.get('/saved-restaurants', verifyToken, async (req, res) => {
    try {
        const savedRestaurants = await SavedRestaurant.find({ user: req.user._id })
            .populate('restaurant', ['name', 'address', 'cuisine']);
        res.json(savedRestaurants);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Save restaurant
router.post('/restaurants/:restaurantId/save', verifyToken, async (req, res) => {
    try {
        const savedRestaurant = await SavedRestaurant.create({
            user: req.user._id,
            restaurant: req.params.restaurantId
        });

        const populatedSavedRestaurant = await SavedRestaurant.findById(savedRestaurant._id)
            .populate('restaurant', ['name', 'address', 'cuisine']);

        res.status(201).json(populatedSavedRestaurant);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Restaurant already saved.' });
        }
        res.status(500).json({ error: error.message });
    }
});

// Remove saved restaurant
router.delete('/restaurants/:restaurantId/save', verifyToken, async (req, res) => {
    try {
        const savedRestaurant = await SavedRestaurant.findOneAndDelete({
            user: req.user._id,
            restaurant: req.params.restaurantId
        });

        if (!savedRestaurant) {
            return res.status(404).json({ error: 'Restaurant not found in saved list.' });
        }
        res.json({ message: 'Restaurant removed from saved list successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;