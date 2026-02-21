const ResponseHandler = require('../utils/responseHandler');

const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // PostgreSQL errors
    if (err.code === '23505') {
        return ResponseHandler.badRequest(res, 'Duplicate entry detected in spacetime continuum', err.detail);
    }

    if (err.code === '23503') {
        return ResponseHandler.badRequest(res, 'Foreign key constraint violation: Tether broken', err.detail);
    }

    if (err.code === '22P02') {
        return ResponseHandler.badRequest(res, 'Invalid input syntax: Signal corrupted');
    }

    // Validation errors
    if (err.name === 'ValidationError') {
        return ResponseHandler.badRequest(res, 'Validation failed: Protocol mismatch', err.errors);
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return ResponseHandler.unauthorized(res, 'Invalid token: Identification failed');
    }

    if (err.name === 'TokenExpiredError') {
        return ResponseHandler.unauthorized(res, 'Token expired: Session terminated');
    }

    // Default error
    return ResponseHandler.error(res, err.message || 'Internal system failure', err.statusCode || 500);
};

module.exports = errorHandler;
