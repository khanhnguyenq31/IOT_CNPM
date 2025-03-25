const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const deviceRoutes = require('./routes/device');
const sensorRoutes = require('./routes/sensor');
const waterProcessRoutes = require('./routes/waterProcess');
const activationConditionRoutes = require('./routes/activationCondition'); // Add this line

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/sensor-data', sensorRoutes);
app.use('/api/water-processes', waterProcessRoutes);
app.use('/api/activation-conditions', activationConditionRoutes); // Add this line

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
