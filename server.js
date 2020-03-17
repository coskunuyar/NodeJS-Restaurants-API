const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const fileupload = require('express-fileupload');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

dotenv.config({path:'./config/config.env'});

// Connect to database
connectDB();

// Route files
const restaurants = require('./routes/restaurants');
const foods = require('./routes/foods');
const auth = require('./routes/auth');

const app = express();
app.use(express.json());
// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(fileupload());
app.use(express.static(path.join(__dirname, 'public')));

// Mount routers
app.use('/api/v1/restaurants', restaurants);
app.use('/api/v1/foods',foods);
app.use('/api/v1/auth', auth);
app.use(errorHandler);
  
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
});


// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    // Close server & exit process
    // server.close(() => process.exit(1));
});