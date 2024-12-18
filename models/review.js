const mongoose = require('mongoose');
const restaurant = require('./restaurant');

const reviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        required: [true, 'Rating is required.'],
        min: [1, 'Rating must be at least 1.'],
        max: [5, 'Rating must be at most 5.']
    },
    bestDish: {
        type: String,
        required: [true, 'Best dish is required.'],
    },
    details: {
        type: String, 
        required:[true, 'Details are required.'],
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: [true, 'Restaurant is required.'],
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required.'],
    }
});

reviewSchema.index({restaurant: 1, user: 1 }, {unique: true });

module.exports = mongoose.model('Review', reviewSchema);