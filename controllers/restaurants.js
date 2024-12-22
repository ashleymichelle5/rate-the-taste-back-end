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

router.get('/featured', async (req, res) => {
    try {
        const allRestaurants = await Restaurant.find();
        res.json(allRestaurants);
    }catch(error) {
        res.status(500).json({error: error.message})
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



router.get('/seed', async (req, res) => {
    try{
        const restaurants = await Restaurant.create(
            [
                {
                  "name": "The Golden Spoon",
                  "address": "1234 Oak Street, Springfield, IL",
                  "cuisine": "Italian",
                  "phone": "204-327-0349",
                  "photos": [
                    "https://picsum.photos/200/300",
                    "https://picsum.photos/300/400"
                  ]
                },
                {
                  "name": "Sushi Haven",
                  "address": "4567 Pine Avenue, Chicago, IL",
                  "cuisine": "Japanese",
                  "phone": "234-3240-0349",
                  "photos": [
                    "https://picsum.photos/200/300",
                    "https://picsum.photos/300/400"
                  ]
                },
                {
                  "name": "Taco Fiesta",
                  "address": "8901 Maple Drive, Miami, FL",
                  "cuisine": "Mexican",
                  "phone": "234-320-0009",
                  "photos": [
                    "https://picsum.photos/200/300",
                    "https://picsum.photos/300/400"
                  ]
                },
                {
                  "name": "Café Bistro",
                  "address": "3456 Birch Lane, San Francisco, CA",
                  "cuisine": "French",
                  "phone": "200-777-9834",
                  "photos": [
                    "https://picsum.photos/200/300",
                    "https://picsum.photos/300/400"
                  ]
                },
                {
                  "name": "Spice Junction",
                  "address": "7890 Cedar Road, New York, NY",
                  "cuisine": "Indian",
                  "phone": "444-324-9999",
                  "photos": [
                    "https://picsum.photos/200/300",
                    "https://picsum.photos/300/400"
                  ]
                }
              ]
              
        ) 
        res.json(restaurants);
    }catch(error) {
        res.status(500).json({error: error.messsage});
    }
});


// Get restaurant by ID
router.get('/:id', async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id)
        .populate('reviews')  
        .populate({path: 'reviews.user',});
        if(!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found.' });
        }
        res.json(restaurant);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;