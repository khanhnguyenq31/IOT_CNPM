const mongoose = require('mongoose');

const SensorDataSchema = new mongoose.Schema({
  sensorType: {
    type: String,
    required: true,
    enum: ['TEMPERATURE', 'HUMIDITY', 'SOIL_MOISTURE']
  },
  value: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  deviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Device',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SensorData', SensorDataSchema);