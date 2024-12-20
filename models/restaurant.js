const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Restaurant name is required.']    
    },
    address: {
        type: String,
        required: [true, 'Restaurant address is required.']    
    },
    cuisine: {
        type: String,
        required: [true, 'Restaurant cuisine is required.']    
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});


restaurantSchema.index({ name: 1, cuisine: 1, address: 1 });

module.exports = mongoose.model('Restaurant', restaurantSchema);