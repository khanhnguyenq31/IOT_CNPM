const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');
const auth = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(auth);

// Device routes
router.get('/', deviceController.getAllDevices);
router.get('/:id', deviceController.getDevice);
router.post('/', deviceController.createDevice);
router.put('/:id', deviceController.updateDevice);
router.delete('/:id', deviceController.deleteDevice);

module.exports = router;