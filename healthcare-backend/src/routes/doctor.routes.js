const express = require('express');
const { check, validationResult } = require('express-validator');
const doctorController = require('../controllers/doctor.controller');
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
        authorize('admin'),
        check('full_name', 'Full name is required').not().isEmpty(),
        check('email', 'Valid email is required').isEmail(),
        validate
    ],
    doctorController.createDoctor
);

router.get('/', protect, doctorController.getAllDoctors);
router.get('/:id', protect, doctorController.getDoctorById);

module.exports = router;
