const express = require('express');
const router = express.Router();
const Restaurant = require('../models/restaurant');
const verifyToken = require('../middleware/verify-token');

// Get all restaurants
router.get('/', async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        res.json(restaurants);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});

// Get restaurant by ID
router.get('/:id', async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id)
            .populate('reviews');
        if(!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found.' });
        }
        res.json(restaurant);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});

// Search restaurants
router.get('/search', async (req, res) => {
    try {
        const { name, cuisine, address } = req.query;
        let query = {};

        if(name) query.name = { $regex: name, $options: 'i' };
        if(cuisine) query.cuisine = { $regex: cuisine, $options: 'i' };
        if(address) query.address = { $regex: address, $options: 'i' };

        const restaurants = await Restaurant.find(query);
        
        if (restaurants.length === 0) {
            return res.status(404).json({ error: 'No restaurants found.' });
        }

        res.json(restaurants);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});

// Create restaurant
router.post('/', verifyToken, async (req, res) => {
    try {
        const restaurant = await Restaurant.create(req.body);
        res.status(201).json(restaurant);
    } catch(error) {
        if(error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }        
        res.status(500).json({ error: error.message });
    }
});

// Update restaurant
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const restaurant = await Restaurant.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if(!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found.' });
        }
        res.json(restaurant);
    } catch(error) {
        if(error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }        
        res.status(500).json({ error: error.message });
    }
});

// Delete restaurant
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
        if(!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found.' });
        }
        res.json({ message: 'Restaurant deleted successfully.' });
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;