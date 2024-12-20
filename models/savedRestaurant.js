const mongoose = require('mongoose');

const savedRestaurantSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true  
    },
    savedAt: {
        type: Date,
        default: Date.now
    }
});


savedRestaurantSchema.index({ user: 1, restaurant: 1 }, { unique: true });

module.exports = mongoose.model('SavedRestaurant', savedRestaurantSchema);