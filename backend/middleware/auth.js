const jwt = require('jsonwebtoken');
const prisma = require('../config/database');
const ResponseHandler = require('../utils/responseHandler');

const protect = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return ResponseHandler.unauthorized(res, 'Not authorized: No nav beacon found');
        }

        // Use fallback secret to match authController
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');

        // Use prisma to find user
        const user = await prisma.users.findUnique({
            where: {
                user_id: decoded.id
            },
            select: {
                user_id: true,
                full_name: true,
                email: true,
                role: true
            }
        });

        if (!user) {
            return ResponseHandler.unauthorized(res, 'User signature not found in registry');
        }

        // Inject ID for data isolation based on role
        if (user.role === 'patient') {
            const patient = await prisma.patients.findFirst({
                where: { user_id: user.user_id }
            });
            if (patient) {
                user.patient_id = patient.patient_id;
            }
        } else if (user.role === 'clinic') {
            const clinic = await prisma.clinics.findFirst({
                where: { user_id: user.user_id }
            });
            if (clinic) {
                user.clinic_id = clinic.id;
            }
        } else if (user.role === 'doctor') {
            const doctor = await prisma.doctors.findFirst({
                where: { user_id: user.user_id }
            });
            if (doctor) {
                user.doctor_id = doctor.id;
            }
        }

        req.user = user;
        next();
    } catch (error) {
        return ResponseHandler.unauthorized(res, 'Not authorized: Signal lost');
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return ResponseHandler.forbidden(res, `Role ${req.user.role} is not authorized for this sector`);
        }
        next();
    };
};

module.exports = { protect, authorize };
