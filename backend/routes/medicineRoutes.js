const express = require('express');
const medicineController = require('../controllers/medicineController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, medicineController.getAllMedicines);
router.get('/:id', protect, medicineController.getMedicineById);

module.exports = router;
