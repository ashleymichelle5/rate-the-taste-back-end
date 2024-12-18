const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: [true, 'Username is required.'],
        trim: true,
        minlength: [5, 'Username must be at least 5 characters long.'],
        maxlength: [20, 'Username must be at most 20 characters long']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required.'],
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/, 'Invalid email address.'],    
    },
    hashedPassword: {
        type: String,
        required: true
    },
});

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject.hashedPassword;
    }
});

module.exports = mongoose.model('User', userSchema);