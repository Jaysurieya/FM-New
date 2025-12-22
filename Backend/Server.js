// Backend/Server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const detailsRoutes = require('./routes/detailsRoutes');
const nutritionRoutes = require('./routes/nutritionRoutes');
const dotenv = require('dotenv');
const connectDB = require('./Mongoconnect');

dotenv.config();
connectDB();

const app = express();

// ✅ CORS (FIXED)
app.use(cors({
  origin: "https://fm-new-3.onrender.com",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
app.options("*", cors());

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/details', detailsRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/history', require('./routes/historyRoutes'));

// Start Server
const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
