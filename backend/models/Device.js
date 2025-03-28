const mongoose = require('mongoose');

const DeviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    feeds: {
        temperature: {
            type: String,
            required: true,
            trim: true
        },
        humidity: {
            type: String,
            required: true,
            trim: true
        },
        soil: {
            type: String,
            required: true,
            trim: true
        }
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Device', DeviceSchema);