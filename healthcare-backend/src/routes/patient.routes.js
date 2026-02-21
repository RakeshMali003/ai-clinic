const express = require('express');
const { check, validationResult } = require('express-validator');
const patientController = require('../controllers/patient.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { errorResponse } = require('../utils/response');

const router = express.Router();

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return errorResponse(res, 'Validation failed', 400, errors.array());
    next();
};

router.post(
    '/',
    [
        protect,
        authorize('admin', 'receptionist', 'doctor'),
        check('patient_id', 'Patient ID is required').not().isEmpty(),
        check('full_name', 'Name is required').not().isEmpty(),
        check('phone', 'Phone is required').not().isEmpty(),
        validate
    ],
    patientController.createPatient
);

router.get('/', protect, patientController.getAllPatients);
router.get('/:id', protect, patientController.getPatientById);

module.exports = router;
