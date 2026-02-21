const express = require('express');
const { check } = require('express-validator');
const userController = require('../controllers/userController');
const validate = require('../middleware/validator');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post(
    '/register',
    [
        check('full_name', 'Full name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
        check('role', 'Invalid role').optional().isIn(['patient', 'doctor', 'receptionist', 'admin']),
        validate
    ],
    userController.register
);

router.post(
    '/login',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists(),
        validate
    ],
    userController.login
);

router.get('/me', protect, userController.getMe);

module.exports = router;
