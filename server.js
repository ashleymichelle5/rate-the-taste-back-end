const dotenv = require('dotenv');     
const cors = require('cors');         // politica de seguridad de DB significa que todas las peticiones deben venir de un metodo especifico, (control sobre quien puede acceder al DB)
const express = require('express');   
const mongoose = require('mongoose'); 
dotenv.config();
const usersRouter = require('./controllers/users');             
const restaurantsRouter = require('./controllers/restaurants'); 
const reviewsRouter = require('./controllers/reviews');         
const savedRestaurantsRouter = require('./controllers/savedRestaurants'); 
const app = express();


mongoose.connect(process.env.MONGODB_URI);


mongoose.connection.on('connected', () => {
    console.log(`Conectado a MongoDB: ${mongoose.connection.name}`);
});

mongoose.connection.on('error', (err) => {
    console.error('Error de conexión a MongoDB:', err);
});


app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));           
app.use(express.json());   
app.use('/api/users', usersRouter);                
app.use('/restaurants', restaurantsRouter);     
app.use('/reviews', reviewsRouter);           
app.use('/', savedRestaurantsRouter);          


const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`);
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Server internal error',
        message: err.message 
    });
});

module.exports = app;