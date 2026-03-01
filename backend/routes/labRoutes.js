const express = require('express');
const router = express.Router();
const labController = require('../controllers/labController');
const { protect, authorize } = require('../middleware/auth');

// All lab routes require authentication
router.use(protect);

router.route('/')
    .get(labController.getOrders)
    .post(authorize('doctor', 'admin', 'clinic'), labController.createOrder);

router.route('/:id')
    .get(labController.getOrderById)
    .put(authorize('doctor', 'admin', 'clinic'), labController.updateStatus)
    .delete(authorize('admin', 'clinic'), labController.deleteOrder);

module.exports = router;
