const prisma = require('../config/database');
const ResponseHandler = require('../utils/responseHandler');
const Doctor = require('../models/doctorModel');

/**
 * Patient Management
 */

exports.getDoctorPatients = async (req, res, next) => {
    try {
        const doctorId = req.user.doctor_id;
        const { filter, startDate, endDate } = req.query;

        let whereClause = { doctor_id: doctorId };

        if (filter === 'Today') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            whereClause.created_at = { gte: today, lt: tomorrow };
        } else if (filter === 'Custom' && startDate && endDate) {
            whereClause.created_at = { gte: new Date(startDate), lte: new Date(endDate) };
        } else if (filter === 'Upcoming') {
            // Patients with upcoming appointments
            whereClause.appointments = {
                some: {
                    doctor_id: doctorId,
                    appointment_date: { gte: new Date() },
                    status: 'scheduled'
                }
            };
        }

        const patients = await prisma.patients.findMany({
            where: whereClause,
            orderBy: { full_name: 'asc' }
        });

        ResponseHandler.success(res, patients, 'Doctor\'s patient roster retrieved');
    } catch (error) {
        next(error);
    }
};

exports.deleteDoctorPatient = async (req, res, next) => {
    try {
        const doctorId = req.user.doctor_id;
        const { id } = req.params;

        const patient = await prisma.patients.findFirst({
            where: { patient_id: id, doctor_id: doctorId }
        });

        if (!patient) {
            return ResponseHandler.notFound(res, 'Patient not found or not authorized to delete');
        }

        await prisma.patients.delete({
            where: { patient_id: id }
        });

        ResponseHandler.success(res, null, 'Patient record purged successfully');
    } catch (error) {
        next(error);
    }
};

/**
 * Appointment Management
 */

exports.getDoctorAppointments = async (req, res, next) => {
    try {
        const doctorId = req.user.doctor_id;
        const { status, mode } = req.query;

        let whereClause = { doctor_id: doctorId };
        if (status) {
            whereClause.status = status;
        }
        // Filter by mode: 'online' maps to appointments with mode='online' or 'video'
        if (mode === 'online') {
            whereClause.mode = { in: ['online', 'video', 'Online', 'Video'] };
        }

        const appointments = await prisma.appointments.findMany({
            where: whereClause,
            include: {
                patient: true
            },
            orderBy: [
                { appointment_date: 'asc' },
                { appointment_time: 'asc' }
            ]
        });

        ResponseHandler.success(res, appointments, 'Doctor\'s appointments retrieved');
    } catch (error) {
        next(error);
    }
};

exports.createDoctorAppointment = async (req, res, next) => {
    try {
        const doctorId = req.user.doctor_id;
        const {
            patient_id, // optional if creating new patient
            full_name, age, gender, phone, email, // patient details if new
            appointment_date, appointment_time, type, reason
        } = req.body;

        let targetPatientId = patient_id;

        // If no patient_id, create new patient linked to this doctor
        if (!targetPatientId) {
            targetPatientId = `PAT-${Date.now()}`;
            await prisma.patients.create({
                data: {
                    patient_id: targetPatientId,
                    full_name,
                    age: age ? parseInt(age) : null,
                    gender,
                    phone,
                    email,
                    doctor_id: doctorId
                }
            });
        }

        const appointmentId = `APT-${Date.now()}`;
        const newAppointment = await prisma.appointments.create({
            data: {
                appointment_id: appointmentId,
                patient_id: targetPatientId,
                doctor_id: doctorId,
                appointment_date: new Date(appointment_date),
                appointment_time: appointment_time, // Expecting HH:mm or full ISO
                type: type || 'Consultation',
                reason_for_visit: reason || '',
                status: 'scheduled'
            }
        });

        ResponseHandler.created(res, newAppointment, 'Appointment scheduled successfully');
    } catch (error) {
        next(error);
    }
};

exports.updateAppointmentStatus = async (req, res, next) => {
    try {
        const doctorId = req.user.doctor_id;
        const { id } = req.params;
        const { status } = req.body;

        if (!['in_progress', 'cancelled', 'completed', 'scheduled'].includes(status)) {
            return ResponseHandler.badRequest(res, 'Invalid status transition');
        }

        const appointment = await prisma.appointments.findFirst({
            where: { appointment_id: id, doctor_id: doctorId }
        });

        if (!appointment) {
            return ResponseHandler.notFound(res, 'Appointment not found');
        }

        const updated = await prisma.appointments.update({
            where: { appointment_id: id },
            data: { status }
        });

        ResponseHandler.success(res, updated, `Appointment status updated to ${status}`);
    } catch (error) {
        next(error);
    }
};

/**
 * Prescription Management
 */

exports.getDoctorPrescriptions = async (req, res, next) => {
    try {
        const doctorId = req.user.doctor_id;
        const { filter, date } = req.query;

        let whereClause = { doctor_id: doctorId };

        if (filter === 'Today') {
            const today = new Date();
            whereClause.created_at = today; // In data.sql it's a DATE type
        } else if (filter === 'Yesterday') {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            whereClause.created_at = yesterday;
        } else if (filter === 'Custom' && date) {
            whereClause.created_at = new Date(date);
        }

        const prescriptions = await prisma.prescriptions.findMany({
            where: whereClause,
            include: {
                patient: true,
                medicines: true,
                lab_tests: true
            },
            orderBy: { created_at: 'desc' }
        });

        ResponseHandler.success(res, prescriptions, 'Doctor\'s prescription records retrieved');
    } catch (error) {
        next(error);
    }
};

exports.createDoctorPrescription = async (req, res, next) => {
    try {
        const doctorId = req.user.doctor_id;
        const { appointment_id, patient_id, diagnosis, notes, medicines, lab_tests, follow_up_date } = req.body;

        // Verify appointment ownership
        const appointment = await prisma.appointments.findFirst({
            where: { appointment_id: appointment_id, doctor_id: doctorId }
        });

        if (!appointment) {
            return ResponseHandler.forbidden(res, 'Unauthorized to create prescription for this appointment');
        }

        const prescriptionId = `RX-${Date.now()}`;

        const medicinesList = Array.isArray(medicines) ? medicines : [];
        const labTestsList = Array.isArray(lab_tests) ? lab_tests : [];

        const newPrescription = await prisma.prescriptions.create({
            data: {
                prescription_id: prescriptionId,
                patient_id,
                doctor_id: doctorId,
                appointment_id,
                diagnosis,
                notes,
                follow_up_date: follow_up_date ? new Date(follow_up_date) : null,
                medicines: {
                    create: medicinesList.map(m => ({
                        medicine_name: m.name || m.medicine_name,
                        dosage: m.dosage,
                        frequency: m.frequency,
                        duration: m.duration
                    }))
                },
                lab_tests: {
                    create: labTestsList.map(t => ({
                        test_name: t.name || t.test_name
                    }))
                }
            }
        });

        // Auto-complete the appointment when prescription is created
        await prisma.appointments.update({
            where: { appointment_id: appointment_id },
            data: { status: 'completed' }
        });

        ResponseHandler.created(res, newPrescription, 'Prescription generated and appointment completed');
    } catch (error) {
        next(error);
    }
};

/**
 * Dashboard Stats
 */

exports.getDoctorStats = async (req, res, next) => {
    try {
        const doctorId = req.user.doctor_id;

        const [totalPatients, pendingAppointments, completedAppointments] = await Promise.all([
            prisma.patients.count({ where: { doctor_id: doctorId } }),
            prisma.appointments.count({ where: { doctor_id: doctorId, status: 'scheduled' } }),
            prisma.appointments.count({ where: { doctor_id: doctorId, status: 'completed' } })
        ]);

        ResponseHandler.success(res, {
            totalPatients,
            pendingAppointments,
            completedAppointments
        }, 'Doctor dashboard stats synchronized');
    } catch (error) {
        next(error);
    }
};

/**
 * Profile Management
 */

exports.getDoctorProfile = async (req, res, next) => {
    try {
        const doctorId = req.user.doctor_id;
        const doctor = await Doctor.findById(doctorId);

        if (!doctor) {
            return ResponseHandler.notFound(res, 'Doctor profile not found');
        }

        ResponseHandler.success(res, doctor, 'Doctor profile retrieved successfully');
    } catch (error) {
        next(error);
    }
};

exports.updateDoctorProfile = async (req, res, next) => {
    try {
        const doctorId = req.user.doctor_id;
        const updates = req.body;

        // Prevent updating sensitive fields
        delete updates.id;
        delete updates.user_id;
        delete updates.email;

        // Handle multi-value fields separately
        const { specializations, languages, consultationModes } = updates;
        delete updates.specializations;
        delete updates.languages;
        delete updates.consultationModes;
        delete updates.consultation_modes;

        // Update related tables if provided
        if (specializations) {
            await prisma.doctor_specializations.deleteMany({ where: { doctor_id: doctorId } });
            await Doctor.insertSpecializations(doctorId, specializations);
        }
        if (languages) {
            await prisma.doctor_languages.deleteMany({ where: { doctor_id: doctorId } });
            await Doctor.insertLanguages(doctorId, languages);
        }
        if (consultationModes) {
            await prisma.doctor_consultation_modes.deleteMany({ where: { doctor_id: doctorId } });
            await Doctor.insertConsultationModes(doctorId, consultationModes);
        }

        const updatedDoctor = await prisma.doctors.update({
            where: { id: doctorId },
            data: {
                ...updates,
                updated_at: new Date()
            },
            include: {
                doctor_specializations: true,
                doctor_languages: true,
                doctor_consultation_modes: true
            }
        });

        // Map back for response
        const responseData = {
            ...updatedDoctor,
            specializations: updatedDoctor.doctor_specializations.map(s => s.specialization),
            languages: updatedDoctor.doctor_languages.map(l => l.language),
            consultation_modes: updatedDoctor.doctor_consultation_modes.map(m => m.mode)
        };

        ResponseHandler.success(res, responseData, 'Profile updated successfully');
    } catch (error) {
        next(error);
    }
};

exports.getAllDoctors = async (req, res, next) => {
    try {
        const doctors = await prisma.doctors.findMany({
            where: {
                verification_status: 'VERIFIED'
            },
            include: {
                doctor_specializations: true
            }
        });

        // Map back to include specialization for the list view
        const mappedDoctors = doctors.map(doctor => ({
            id: doctor.id,
            full_name: doctor.full_name,
            email: doctor.email,
            mobile: doctor.mobile,
            specialization: doctor.doctor_specializations.length > 0 ? doctor.doctor_specializations[0].specialization : 'General Physician',
            qualifications: doctor.qualifications,
            experience_years: doctor.experience_years,
            bio: doctor.bio,
            profile_photo_url: doctor.profile_photo_url,
            verification_status: doctor.verification_status
        }));

        ResponseHandler.success(res, mappedDoctors, 'All verified doctors retrieved');
    } catch (error) {
        next(error);
    }
};

module.exports = exports;
