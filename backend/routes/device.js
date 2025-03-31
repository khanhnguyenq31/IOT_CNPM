const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');
const auth = require('../middleware/auth');

router.use(auth);

// Create device
router.post('/', deviceController.createDevice);

// Update device
router.put('/:id', deviceController.updateDevice);

// ...other routes...

module.exports = router;