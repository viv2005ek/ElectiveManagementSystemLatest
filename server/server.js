const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const routes = require('./routes');
const connectDB = require('./config/db'); // Database connection
const errorHandler = require('./middlewares/errorHandler'); // Error handling middleware

// Load environment variables
dotenv.config();

// Initialize app
const app = express();

// Connect to the database

// connectDB();

// Middleware
app.use(express.json()); // Parse incoming JSON requests
app.use(morgan('tiny'));  // HTTP request logger

// Routes
app.use('/api', routes); // Use all routes under '/api'

// Error handling middleware
// app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}...`);
});
