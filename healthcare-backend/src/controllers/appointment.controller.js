const Appointment = require('../models/appointment.model');
const { successResponse, errorResponse } = require('../utils/response');

exports.createAppointment = async (req, res, next) => {
    try {
        const appointment = await Appointment.create(req.body);
        successResponse(res, appointment, 'Appointment scheduled', 201);
    } catch (error) {
        next(error);
    }
};

exports.getAllAppointments = async (req, res, next) => {
    try {
        const appointments = await Appointment.findAll();
        successResponse(res, appointments, 'Appointments retrieved');
    } catch (error) {
        next(error);
    }
};

exports.getAppointmentById = async (req, res, next) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) return errorResponse(res, 'Appointment not found', 404);
        successResponse(res, appointment, 'Appointment retrieved');
    } catch (error) {
        next(error);
    }
};
