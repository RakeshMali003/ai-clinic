const express = require('express');
const { check, validationResult } = require('express-validator');
const appointmentController = require('../controllers/appointment.controller');
const { protect } = require('../middleware/auth.middleware');
const { errorResponse } = require('../utils/response');

const router = express.Router();

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return errorResponse(res, 'Validation failed', 400, errors.array());
    next();
};

router.use(protect);

router.post(
    '/',
    [
        check('appointment_id', 'ID required').not().isEmpty(),
        check('patient_id', 'Patient ID required').not().isEmpty(),
        check('doctor_id', 'Doctor ID required').not().isEmpty(),
        check('appointment_date', 'Date required').not().isEmpty(),
        validate
    ],
    appointmentController.createAppointment
);

router.get('/', appointmentController.getAllAppointments);
router.get('/:id', appointmentController.getAppointmentById);

module.exports = router;
