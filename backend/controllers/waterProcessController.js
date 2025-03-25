const WaterProcess = require('../models/WaterProcess');

// Get all water processes
exports.getAllWaterProcesses = async (req, res) => {
  try {
    const processes = await WaterProcess.find()
      .populate('deviceId', 'name location')
      .sort({ startTime: -1 });
    res.json(processes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get water processes for a specific device
exports.getDeviceWaterProcesses = async (req, res) => {
  try {
    const processes = await WaterProcess.find({ deviceId: req.params.deviceId })
      .populate('deviceId', 'name location')
      .sort({ startTime: -1 });
    res.json(processes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Schedule new water process
exports.scheduleWaterProcess = async (req, res) => {
  try {
    const { deviceId, startTime, duration, notes } = req.body;
    const waterProcess = new WaterProcess({
      deviceId,
      startTime,
      duration,
      notes
    });
    const newProcess = await waterProcess.save();
    res.status(201).json(newProcess);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update water process status
exports.updateWaterProcessStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const process = await WaterProcess.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('deviceId', 'name location');
    
    if (!process) {
      return res.status(404).json({ message: 'Không tìm thấy quy trình tưới nước' });
    }
    res.json(process);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete water process
exports.deleteWaterProcess = async (req, res) => {
  try {
    const process = await WaterProcess.findByIdAndDelete(req.params.id);
    if (!process) {
      return res.status(404).json({ message: 'Không tìm thấy quy trình tưới nước' });
    }
    res.json({ message: 'Đã xóa quy trình tưới nước' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};