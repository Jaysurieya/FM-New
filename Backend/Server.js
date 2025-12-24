// Backend/Server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

const authRoutes = require('./routes/authRoutes');
const detailsRoutes = require('./routes/detailsRoutes');
const nutritionRoutes = require('./routes/nutritionRoutes');
const historyRoutes = require('./routes/historyRoutes');
const connectDB = require('./Mongoconnect');
const { auth } = require('firebase-admin');

dotenv.config();
connectDB();

const app = express();

// ✅ CORRECT CORS (NO app.options("*"))
app.use(cors({
  origin: ["https://fm-new-3.onrender.com", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/details', detailsRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/gemini', authRoutes); // Example route for Gemini chat

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
