const ResponseHandler = require('../utils/responseHandler');
const prisma = require('../config/database');

// Helper to get all doctor IDs associated with the clinic
const getClinicDoctorIds = async (clinicId) => {
    const mappings = await prisma.doctor_clinic_mapping.findMany({
        where: { clinic_id: clinicId },
        select: { doctor_id: true }
    });
    return mappings.map(m => m.doctor_id);
};

exports.getTodayPatients = async (req, res, next) => {
    try {
        const clinicId = req.user.clinic_id;
        const doctorIds = await getClinicDoctorIds(clinicId);

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const appointments = await prisma.appointments.findMany({
            where: {
                doctor_id: { in: doctorIds },
                appointment_date: {
                    gte: today,
                    lt: tomorrow
                }
            },
            include: {
                patient: true,
                doctor: true
            },
            orderBy: {
                appointment_time: 'asc'
            }
        });

        ResponseHandler.success(res, appointments, 'Retrieved today\'s patient roster');
    } catch (error) {
        next(error);
    }
};

exports.getUpcomingPatients = async (req, res, next) => {
    try {
        const clinicId = req.user.clinic_id;
        const doctorIds = await getClinicDoctorIds(clinicId);

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        const appointments = await prisma.appointments.findMany({
            where: {
                doctor_id: { in: doctorIds },
                appointment_date: {
                    gte: tomorrow
                },
                status: 'scheduled'
            },
            include: {
                patient: true,
                doctor: true
            },
            orderBy: {
                appointment_date: 'asc'
            }
        });

        ResponseHandler.success(res, appointments, 'Retrieved upcoming scheduled patients');
    } catch (error) {
        next(error);
    }
};

exports.getCompletedPatients = async (req, res, next) => {
    try {
        const clinicId = req.user.clinic_id;
        const doctorIds = await getClinicDoctorIds(clinicId);

        const appointments = await prisma.appointments.findMany({
            where: {
                doctor_id: { in: doctorIds },
                status: 'completed'
            },
            include: {
                patient: true,
                doctor: true
            },
            orderBy: {
                appointment_date: 'desc'
            }
        });

        ResponseHandler.success(res, appointments, 'Retrieved completed patient records');
    } catch (error) {
        next(error);
    }
};

exports.getAllPatients = async (req, res, next) => {
    try {
        const clinicId = req.user.clinic_id;
        const doctorIds = await getClinicDoctorIds(clinicId);

        const patients = await prisma.patients.findMany({
            where: {
                appointments: {
                    some: {
                        doctor_id: { in: doctorIds }
                    }
                }
            }
        });

        ResponseHandler.success(res, patients, 'Total patient database synchronized');
    } catch (error) {
        next(error);
    }
};

exports.addPatient = async (req, res, next) => {
    try {
        const { full_name, email, phone, age, gender } = req.body;

        // Check if patient already exists (by email/phone)
        let patient = await prisma.patients.findFirst({
            where: {
                OR: [
                    { email: email },
                    { phone: phone }
                ]
            }
        });

        if (!patient) {
            const patientId = `PAT-${Date.now()}`;
            patient = await prisma.patients.create({
                data: {
                    patient_id: patientId,
                    full_name,
                    phone,
                    email,
                    age: parseInt(age),
                    gender
                }
            });
        }

        ResponseHandler.success(res, patient, 'Patient record added/verified');
    } catch (error) {
        next(error);
    }
};

exports.getAppointments = async (req, res, next) => {
    try {
        const clinicId = req.user.clinic_id;
        const doctorIds = await getClinicDoctorIds(clinicId);

        const appointments = await prisma.appointments.findMany({
            where: {
                doctor_id: { in: doctorIds }
            },
            include: {
                patient: true,
                doctor: true
            }
        });

        ResponseHandler.success(res, appointments, 'All clinic appointments retrieved');
    } catch (error) {
        next(error);
    }
};

exports.createAppointment = async (req, res, next) => {
    try {
        const clinicId = req.user.clinic_id;
        const doctorIds = await getClinicDoctorIds(clinicId);

        const { patient_id, doctor_id, appointment_date, appointment_time, type, reason } = req.body;

        // Verify doctor belongs to this clinic
        if (!doctorIds.includes(parseInt(doctor_id))) {
            return ResponseHandler.forbidden(res, 'Target doctor is not assigned to this facility');
        }

        const appointmentId = `APT-${Date.now()}`;
        const newAppointment = await prisma.appointments.create({
            data: {
                appointment_id: appointmentId,
                patient_id,
                doctor_id: parseInt(doctor_id),
                appointment_date: new Date(appointment_date),
                appointment_time: new Date(`${appointment_date}T${appointment_time}`),
                type: type || 'consultation',
                reason_for_visit: reason || '',
                status: 'scheduled'
            }
        });

        ResponseHandler.created(res, newAppointment, 'Appointment synchronized with schedule');
    } catch (error) {
        next(error);
    }
};

exports.updateAppointment = async (req, res, next) => {
    try {
        const clinicId = req.user.clinic_id;
        const doctorIds = await getClinicDoctorIds(clinicId);
        const { id } = req.params;

        const appointment = await prisma.appointments.findUnique({
            where: { appointment_id: id }
        });

        if (!appointment || !doctorIds.includes(appointment.doctor_id)) {
            return ResponseHandler.notFound(res, 'Appointment not found in clinic records');
        }

        const updated = await prisma.appointments.update({
            where: { appointment_id: id },
            data: req.body
        });

        ResponseHandler.success(res, updated, 'Appointment recalibrated');
    } catch (error) {
        next(error);
    }
};

exports.deleteAppointment = async (req, res, next) => {
    try {
        const clinicId = req.user.clinic_id;
        const doctorIds = await getClinicDoctorIds(clinicId);
        const { id } = req.params;

        const appointment = await prisma.appointments.findUnique({
            where: { appointment_id: id }
        });

        if (!appointment || !doctorIds.includes(appointment.doctor_id)) {
            return ResponseHandler.notFound(res, 'Appointment not found in clinic records');
        }

        await prisma.appointments.delete({
            where: { appointment_id: id }
        });

        ResponseHandler.success(res, null, 'Appointment purged from registry');
    } catch (error) {
        next(error);
    }
};
exports.getQueue = async (req, res, next) => {
    try {
        const clinicId = req.user.clinic_id;
        const doctorIds = await getClinicDoctorIds(clinicId);

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const queue = await prisma.appointments.findMany({
            where: {
                doctor_id: { in: doctorIds },
                appointment_date: {
                    gte: today,
                    lt: tomorrow
                },
                status: { in: ['scheduled', 'in-progress'] }
            },
            include: {
                patient: true,
                doctor: true
            },
            orderBy: {
                appointment_time: 'asc'
            }
        });

        ResponseHandler.success(res, queue, 'Dynamic queue pulse synchronized');
    } catch (error) {
        next(error);
    }
};
