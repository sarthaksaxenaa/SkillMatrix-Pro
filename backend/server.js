/**
 * SkillMatrix-Pro Backend Server
 * Express API gateway that handles auth and proxies AI requests to the Python engine.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const aiRoutes = require('./routes/ai');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Active', message: 'Backend Online' });
});

// Route Modules
app.use('/api', authRoutes);
app.use('/api', aiRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`🚀 SERVER RUNNING ON PORT ${PORT}`);
  console.log(`=================================`);
});