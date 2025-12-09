const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const detailsRoutes = require('./routes/detailsRoutes');
const dotenv = require('dotenv');
const connectDB = require('./mongoConnect');

connectDB();

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/details', detailsRoutes );

// Start Server
const PORT = 5000;
app.listen(PORT,'0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});