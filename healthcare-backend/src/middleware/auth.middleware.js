const jwt = require('jsonwebtoken');
const config = require('../config/env');
const pool = require('../config/database');
const { errorResponse } = require('../utils/response');

exports.protect = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return errorResponse(res, 'Not authorized to access this route', 401);
        }

        try {
            const decoded = jwt.verify(token, config.jwt.secret);

            const result = await pool.query(
                'SELECT user_id, full_name, email, role FROM users WHERE user_id = $1',
                [decoded.id]
            );

            if (result.rows.length === 0) {
                return errorResponse(res, 'User not found', 404);
            }

            req.user = result.rows[0];
            next();
        } catch (err) {
            return errorResponse(res, 'Not authorized', 401);
        }
    } catch (err) {
        next(err);
    }
};

exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return errorResponse(res, `User role ${req.user.role} is not authorized to access this route`, 403);
        }
        next();
    };
};
