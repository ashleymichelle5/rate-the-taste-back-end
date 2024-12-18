const express = require('express');
const router = express.Router();
const Restaurant =  require('../models/restaurant');
const jwt = require('../middleware/verify-token');
const verifyToken = require('../middleware/verify-token');

router.get('/', async (req, res) =>{
    try {
        const restaurants = await Restaurant.find();
        res.json(restaurants);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id).populate('reviews');
        if(!restaurant) {
            return res.status(404).json({error: 'Restaurant not found.'})
        }
        res.json(restaurant);
    } catch(error) {
        res.status(500).json({error: error.message});
    }
});

router.post('/', async (req, res) => {
    try {
        const restaurant = await Restaurant.create(req.body);
        res.status(201).json(restaurant);
    }catch(error) {
        if(error.name === 'ValidationError') {
            return res.status(400).json({error: error.message});
        }
        res.status(500).json({error: error.message});
    }
});

router.put('/:id', async (req, res) =>{
    try {
        const restaurant = await Restaurant.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if(!restaurant){
            return res.status(404).json({error: 'Restaurant not found.'})
        }
        res.json(restaurant);
    }catch(error) {
        if(error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
        if(!restaurant) {
            return res.status(404).json({error: 'Restaurant not found.'});
        }
        res.json({ message: 'Restaurant deleted successfully.'});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;