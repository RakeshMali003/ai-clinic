const Prescription = require('../models/prescriptionModel');
const ResponseHandler = require('../utils/responseHandler');

exports.createPrescription = async (req, res, next) => {
    try {
        const { patient_id, doctor_id, appointment_id, diagnosis, follow_up_date, notes, medicines, lab_tests } = req.body;

        if (!patient_id || !diagnosis) {
            return ResponseHandler.badRequest(res, 'Missing essential medical data (Patient, Diagnosis)');
        }

        const prescription_id = `RX-${Date.now()}`;

        const prescriptionData = {
            prescription_id,
            patient_id,
            doctor_id: doctor_id ? parseInt(doctor_id) : null,
            appointment_id,
            diagnosis,
            follow_up_date: follow_up_date ? new Date(follow_up_date) : null,
            notes
        };

        const newPrescription = await Prescription.create(prescriptionData, medicines || [], lab_tests || []);
        ResponseHandler.created(res, newPrescription, 'Prescription metrics recorded and validated');
    } catch (error) {
        next(error);
    }
};

exports.getAllPrescriptions = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const prescriptions = await Prescription.findAll(limit, offset);
        ResponseHandler.success(res, prescriptions, 'Clinical prescription registry scan complete');
    } catch (error) {
        next(error);
    }
};

exports.getPrescriptionById = async (req, res, next) => {
    try {
        const prescription = await Prescription.findById(req.params.id);
        if (!prescription) {
            return ResponseHandler.notFound(res, 'Prescription bio-signature not found');
        }
        ResponseHandler.success(res, prescription, 'Medical prescription details retrieved');
    } catch (error) {
        next(error);
    }
};

exports.getPatientPrescriptions = async (req, res, next) => {
    try {
        const { patientId } = req.params;
        const prescriptions = await Prescription.findByPatient(patientId);
        ResponseHandler.success(res, prescriptions, 'Patient medical history retrieved');
    } catch (error) {
        next(error);
    }
};
