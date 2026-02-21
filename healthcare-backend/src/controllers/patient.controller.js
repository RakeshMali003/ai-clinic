const Patient = require('../models/patient.model');
const { successResponse, errorResponse } = require('../utils/response');

exports.createPatient = async (req, res, next) => {
    try {
        const { patient_id } = req.body;
        const existing = await Patient.findById(patient_id);
        if (existing) {
            return errorResponse(res, 'Patient already exists', 400);
        }
        const newPatient = await Patient.create(req.body);
        successResponse(res, newPatient, 'Patient created successfully', 201);
    } catch (error) {
        next(error);
    }
};

exports.getAllPatients = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const patients = await Patient.findAll(limit, offset);
        const total = await Patient.count();

        successResponse(res, {
            patients,
            pagination: { total, page, pages: Math.ceil(total / limit) }
        }, 'Patients retrieved');
    } catch (error) {
        next(error);
    }
};

exports.getPatientById = async (req, res, next) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return errorResponse(res, 'Patient not found', 404);
        }
        successResponse(res, patient, 'Patient retrieved');
    } catch (error) {
        next(error);
    }
};
