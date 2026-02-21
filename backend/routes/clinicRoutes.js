const express = require('express');
const clinicController = require('../controllers/clinicController');

const router = express.Router();

// Note: Auth middleware skipped as per requirements ("assume auth is already handled")
// However, in a real scenario, protect/authorize should be used here.

router.post('/', clinicController.createClinic);
router.get('/', clinicController.getAllClinics);
router.get('/:id', clinicController.getClinicById);
router.put('/:id', clinicController.updateClinic);
router.delete('/:id', clinicController.deleteClinic);

module.exports = router;
