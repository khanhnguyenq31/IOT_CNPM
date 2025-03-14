const mongoose = require('mongoose');

const DeviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['PUMP', 'SENSOR'] // Add device types as needed
  },
  status: {
    type: String,
    required: true,
    enum: ['ACTIVE', 'INACTIVE', 'MAINTENANCE'],
    default: 'INACTIVE'
  },
  location: {
    type: String,
    required: true,
    default: 'Undefined'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Device', DeviceSchema);