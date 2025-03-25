const mongoose = require('mongoose');

const ActivationConditionSchema = new mongoose.Schema({
  deviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Device',
    required: true
  },
  waterProcessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WaterProcess',
    required: true
  },
  description: {
    type: String,
    required: true
  },
  flag: {
    type: Boolean,
    default: false
  },
  conditions: {
    temperature: {
      min: Number,
      max: Number
    },
    soilMoisture: {
      min: Number,
      max: Number
    },
    humidity: {
      min: Number,
      max: Number
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ActivationCondition', ActivationConditionSchema);