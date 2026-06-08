const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());

// Import Routes
const tripRoutes = require('./routes/tripRoutes');
const attractionRoutes = require('./routes/attractionRoutes');
const transportRoutes = require('./routes/transportRoutes');
const authRoutes = require('./routes/authRoutes');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/trip', tripRoutes);
app.use('/api/attractions', attractionRoutes);
app.use('/api/transport', transportRoutes);

// Basic Route for testing
app.get('/', (req, res) => {
    res.send('AI Trip Planner Backend is running in MVC Structure');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
