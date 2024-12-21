const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const SALT_LENGTH = 12;

router.post('/signup', async (req, res) => {
    try {
        console.log(req.body);
        // Check if username or email already exists
        const userInDatabase = await User.findOne({ 
            $or: [
                { username: req.body.username },
                { email: req.body.email }
            ]
        });

        if (userInDatabase) {
            if(userInDatabase.username === req.body.username) {
                return res.status(400).json({ error: 'Username already taken.' });
            }
            if(userInDatabase.email === req.body.email) {
                return res.status(400).json({ error: 'Email already taken.' });
            }
        }
       

        // Create new user
        const user = await User.create({
            username: req.body.username,
            email: req.body.email,
            hashedPassword: bcrypt.hashSync(req.body.password, SALT_LENGTH)
        });

        const token = jwt.sign(
            { username: user.username, _id: user._id }, 
            process.env.JWT_SECRET
        );

        res.status(201).json({ user, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/signin', async (req, res) => {
    try {
        const user = await User.findOne({           
            $or: [
                { username: req.body.username },
                { email: req.body.email }
            ]
        });
         
        if (!user || !bcrypt.compareSync(req.body.password, user.hashedPassword)) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        const token = jwt.sign(
            { username: user.username, _id: user._id }, 
            process.env.JWT_SECRET
        );
        
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;