const Clinic = require('../models/clinicModel');
const ResponseHandler = require('../utils/responseHandler');

exports.createClinic = async (req, res, next) => {
    try {
        const newClinic = await Clinic.create(req.body);
        ResponseHandler.created(res, newClinic, 'Clinic facility established in the sector');
    } catch (error) {
        next(error);
    }
};

exports.getAllClinics = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const clinics = await Clinic.findAll(limit, offset);
        const total = await Clinic.count();

        ResponseHandler.success(res, {
            clinics,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        }, 'Scanning all medical facilities in range');
    } catch (error) {
        next(error);
    }
};

exports.getClinicById = async (req, res, next) => {
    try {
        const clinic = await Clinic.findById(req.params.id);
        if (!clinic) {
            return ResponseHandler.notFound(res, 'Medical facility not found in current sector');
        }
        ResponseHandler.success(res, clinic, 'Facility credentials retrieved');
    } catch (error) {
        next(error);
    }
};

exports.updateClinic = async (req, res, next) => {
    try {
        const updated = await Clinic.update(req.params.id, req.body);
        if (!updated) {
            return ResponseHandler.notFound(res, 'Target facility not found for recalibration');
        }
        ResponseHandler.updated(res, updated, 'Facility parameters updated');
    } catch (error) {
        next(error);
    }
};

exports.deleteClinic = async (req, res, next) => {
    try {
        const deleted = await Clinic.delete(req.params.id);
        if (!deleted) {
            return ResponseHandler.notFound(res, 'Target facility vanished before decommission');
        }
        ResponseHandler.deleted(res, 'Facility decommissioned and purged from registry');
    } catch (error) {
        next(error);
    }
};
