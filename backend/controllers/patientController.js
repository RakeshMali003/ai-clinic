const Patient = require('../models/patientModel');
const ResponseHandler = require('../utils/responseHandler');

exports.createPatient = async (req, res, next) => {
    try {
        const { patient_id, full_name, age, gender, phone } = req.body;

        // Validation
        if (!patient_id || !full_name || !phone) {
            return ResponseHandler.badRequest(res, 'Missing essential bio-data (ID, Name, Phone)');
        }

        // Check existing
        const existing = await Patient.findById(patient_id);
        if (existing) {
            return ResponseHandler.badRequest(res, 'Patient identity integrity violation: ID already exists');
        }

        const newPatient = await Patient.create(req.body);
        ResponseHandler.created(res, newPatient, 'Patient lifecycle initiated');
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

        ResponseHandler.success(res, {
            patients,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        }, 'Patient registry scan complete');
    } catch (error) {
        next(error);
    }
};

exports.getPatientById = async (req, res, next) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return ResponseHandler.notFound(res, 'Patient bio-signature not found');
        }
        ResponseHandler.success(res, patient, 'Patient data retrieved');
    } catch (error) {
        next(error);
    }
};

exports.getPatientProfile = async (req, res, next) => {
    try {
        const email = req.user.email;
        const patient = await Patient.findByEmail(email);

        if (!patient) {
            return ResponseHandler.notFound(res, 'Patient profile not established for this session');
        }

        ResponseHandler.success(res, patient, 'Session-based patient profile retrieved');
    } catch (error) {
        next(error);
    }
};

exports.updatePatientProfile = async (req, res, next) => {
    try {
        const email = req.user.email;
        const patient = await Patient.findByEmail(email);

        if (!patient) {
            // If patient record doesn't exist but user does, we might need to create it
            // but for now let's assume it should exist.
            return ResponseHandler.notFound(res, 'Patient profile not found for update');
        }

        const updated = await Patient.update(patient.patient_id, req.body);
        ResponseHandler.updated(res, updated, 'Patient profile metrics recalibrated');
    } catch (error) {
        next(error);
    }
};

exports.updatePatient = async (req, res, next) => {
    try {
        const updated = await Patient.update(req.params.id, req.body);
        if (!updated) {
            return ResponseHandler.notFound(res, 'Target not found for recalibration');
        }
        ResponseHandler.updated(res, updated, 'Patient metrics updated');
    } catch (error) {
        next(error);
    }
};

exports.deletePatient = async (req, res, next) => {
    try {
        const deleted = await Patient.delete(req.params.id);
        if (!deleted) {
            return ResponseHandler.notFound(res, 'Target vanished before termination');
        }
        ResponseHandler.deleted(res, 'Patient record purged from system');
    } catch (error) {
        next(error);
    }
};
