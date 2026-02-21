const Doctor = require('../models/doctor.model');
const { successResponse, errorResponse } = require('../utils/response');

exports.createDoctor = async (req, res, next) => {
    try {
        const newDoctor = await Doctor.create(req.body);
        successResponse(res, newDoctor, 'Doctor profile created', 201);
    } catch (error) {
        next(error);
    }
};

exports.getAllDoctors = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const doctors = await Doctor.findAll(limit, offset);
        const total = await Doctor.count();

        successResponse(res, {
            doctors,
            pagination: { total, page, pages: Math.ceil(total / limit) }
        }, 'Doctors retrieved');
    } catch (error) {
        next(error);
    }
};

exports.getDoctorById = async (req, res, next) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) return errorResponse(res, 'Doctor not found', 404);
        successResponse(res, doctor, 'Doctor retrieved');
    } catch (error) {
        next(error);
    }
};
