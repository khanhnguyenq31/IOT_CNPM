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

// Create device - lưu userId của người tạo
exports.createDevice = async (req, res) => {
  try {
    const { name, type, status, location } = req.body;
    const device = new Device({ 
      name, 
      type, 
      status, 
      location,
      userId: req.user.userId // userId của người tạo
    });
    await device.save();
    res.status(201).json(device);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update device - cập nhật userId là người chỉnh sửa cuối cùng
exports.updateDevice = async (req, res) => {
  try {
    const { name, type, status, location } = req.body;
    const device = await Device.findByIdAndUpdate(
      req.params.id,
      { 
        name, 
        type, 
        status, 
        location,
        userId: req.user.userId // cập nhật userId là người chỉnh sửa cuối
      },
      { new: true }
    );
    if (!device) {
      return res.status(404).json({ message: 'Không tìm thấy thiết bị' });
    }
    res.json(device);
  } catch (err) {
    res.status(400).json({ message: err.message });
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