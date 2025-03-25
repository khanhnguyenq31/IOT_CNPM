const ActivationCondition = require('../models/ActivationCondition');

// Get all activation conditions
exports.getAllConditions = async (req, res) => {
  try {
    const conditions = await ActivationCondition.find()
      .populate('deviceId', 'name location')
      .populate('waterProcessId', 'startTime duration');
    res.json(conditions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get conditions by device ID
exports.getDeviceConditions = async (req, res) => {
  try {
    const conditions = await ActivationCondition.find({ deviceId: req.params.deviceId })
      .populate('deviceId', 'name location')
      .populate('waterProcessId', 'startTime duration');
    res.json(conditions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create new activation condition
exports.createCondition = async (req, res) => {
  try {
    const { deviceId, waterProcessId, description, conditions } = req.body;
    const activationCondition = new ActivationCondition({
      deviceId,
      waterProcessId,
      description,
      conditions
    });
    const newCondition = await activationCondition.save();
    res.status(201).json(newCondition);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update activation condition
exports.updateCondition = async (req, res) => {
  try {
    const { description, conditions, flag } = req.body;
    const condition = await ActivationCondition.findByIdAndUpdate(
      req.params.id,
      { description, conditions, flag },
      { new: true }
    )
    .populate('deviceId', 'name location')
    .populate('waterProcessId', 'startTime duration');
    
    if (!condition) {
      return res.status(404).json({ message: 'Không tìm thấy điều kiện kích hoạt' });
    }
    res.json(condition);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete activation condition
exports.deleteCondition = async (req, res) => {
  try {
    const condition = await ActivationCondition.findByIdAndDelete(req.params.id);
    if (!condition) {
      return res.status(404).json({ message: 'Không tìm thấy điều kiện kích hoạt' });
    }
    res.json({ message: 'Đã xóa điều kiện kích hoạt' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Toggle activation flag
exports.toggleFlag = async (req, res) => {
  try {
    const condition = await ActivationCondition.findById(req.params.id);
    if (!condition) {
      return res.status(404).json({ message: 'Không tìm thấy điều kiện kích hoạt' });
    }
    condition.flag = !condition.flag;
    await condition.save();
    res.json(condition);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};