const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const reviewRoutes = require('./src/routes/reviewRoutes');
const adminRoutes = require('./src/routes/adminRoutes');

// Database Connection
connectDB();

// Middleware to ensure DB is connected before processing requests (Relevant for Serverless)
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error("Database connection failed:", error);
        res.status(500).json({ error: "Database connection failed" });
    }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

// Simple Route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Start Server (Only if not running in Vercel/Serverless environment)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
