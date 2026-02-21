const express = require('express');
const { check, validationResult } = require('express-validator');
const authController = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const { errorResponse } = require('../utils/response');

const router = express.Router();

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return errorResponse(res, 'Validation failed', 400, errors.array());
    }
    next();
};

router.post(
    '/register',
    [
        check('full_name', 'Full name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
        validate
    ],
    authController.register
);

router.post(
    '/login',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists(),
        validate
    ],
    authController.login
);

router.get('/me', protect, authController.getMe);

module.exports = router;
