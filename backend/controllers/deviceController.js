const Device = require('../models/Device');

// Get all devices - không cần filter theo userId
exports.getAllDevices = async (req, res) => {
  try {
    const devices = await Device.find();
    res.json(devices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single device - không cần filter theo userId
exports.getDevice = async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);
    if (!device) {
      return res.status(404).json({ message: 'Không tìm thấy thiết bị' });
    }
    res.json(device);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create device
exports.createDevice = async (req, res) => {
  try {
    const { name, location } = req.body;

    // Create new device with default feed values
    const device = new Device({
      name,
      location,
      feeds: {
        temperature: '0',
        humidity: '0',
        soil: '0'
      },
      userId: req.user.userId  // Thay đổi từ req.user.id thành req.user.userId
    });

    const savedDevice = await device.save();

    res.status(201).json({
      success: true,
      data: savedDevice
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Update device
exports.updateDevice = async (req, res) => {
  try {
    const { name, location } = req.body;

    const device = await Device.findByIdAndUpdate(
      req.params.id,
      { name, location },
      { new: true, runValidators: true }
    );

    if (!device) {
      return res.status(404).json({
        success: false,
        error: 'Device not found'
      });
    }

    res.status(200).json({
      success: true,
      data: device
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Delete device - không cần filter theo userId
exports.deleteDevice = async (req, res) => {
  try {
    const device = await Device.findByIdAndDelete(req.params.id);
    if (!device) {
      return res.status(404).json({ message: 'Không tìm thấy thiết bị' });
    }
    res.json({ message: 'Đã xóa thiết bị thành công' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};