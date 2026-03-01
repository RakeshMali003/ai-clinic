const ResponseHandler = require('../utils/responseHandler');
const prisma = require('../config/database');

exports.getProfile = async (req, res, next) => {
    try {
        const clinicId = req.user.clinic_id;
        if (!clinicId) {
            return ResponseHandler.unauthorized(res, 'No clinic identity found for this user');
        }

        const clinic = await prisma.clinics.findUnique({
            where: { id: clinicId }
        });

        if (!clinic) {
            return ResponseHandler.notFound(res, 'Clinic record not found in registry');
        }

        ResponseHandler.success(res, clinic, 'Clinic profile data retrieved from primary database');
    } catch (error) {
        next(error);
    }
};

exports.updateProfile = async (req, res, next) => {
    try {
        const clinicId = req.user.clinic_id;
        if (!clinicId) {
            return ResponseHandler.unauthorized(res, 'No clinic identity found for recalibration');
        }

        // Only allow certain fields to be updated
        const {
            clinic_name, address, city, state, mobile, email,
            tagline, description, website, establishment_year
        } = req.body;

        const updatedClinic = await prisma.clinics.update({
            where: { id: clinicId },
            data: {
                clinic_name,
                address,
                city,
                state,
                mobile,
                email,
                tagline,
                description,
                website,
                establishment_year: establishment_year ? parseInt(establishment_year) : undefined,
                updated_at: new Date()
            }
        });

        ResponseHandler.success(res, updatedClinic, 'Clinic profile parameters recalibrated successfully');
    } catch (error) {
        next(error);
    }
};

exports.getReports = async (req, res, next) => {
    try {
        const clinicId = req.user.clinic_id;

        // Count doctors mapped to this clinic
        const doctorsCount = await prisma.doctor_clinic_mapping.count({
            where: { clinic_id: clinicId }
        });

        const clinicDoctors = await prisma.doctor_clinic_mapping.findMany({
            where: { clinic_id: clinicId },
            select: { doctor_id: true }
        });
        const doctorIds = clinicDoctors.map(d => d.doctor_id);

        // Count appointments for doctors linked to this clinic
        const realAppointmentsCount = await prisma.appointments.count({
            where: { doctor_id: { in: doctorIds } }
        });

        // Unique patients who had appointments at this clinic (via its doctors)
        const patientsResult = await prisma.appointments.groupBy({
            by: ['patient_id'],
            where: { doctor_id: { in: doctorIds } }
        });
        const patientsCount = patientsResult.length;

        // Total revenue (earnings from appointments)
        const revenue = await prisma.appointments.aggregate({
            _sum: { earnings: true },
            where: { doctor_id: { in: doctorIds } }
        });

        ResponseHandler.success(res, {
            total_doctors: doctorsCount,
            total_appointments: realAppointmentsCount,
            total_patients: patientsCount,
            total_revenue: revenue._sum.earnings || 0
        }, 'Neural analytics pulse received');
    } catch (error) {
        next(error);
    }
};

exports.getSettings = async (req, res, next) => {
    try {
        const clinicId = req.user.clinic_id;

        // Find existing settings for this clinic in system_settings
        // We use a naming convention like 'clinic_{id}_' for keys
        const settings = await prisma.system_settings.findMany({
            where: {
                setting_key: {
                    startsWith: `clinic_${clinicId}_`
                }
            }
        });

        // Map internal keys back to a clean object for the frontend
        const result = {};
        settings.forEach(s => {
            const key = s.setting_key.replace(`clinic_${clinicId}_`, '');
            result[key] = s.setting_value;
        });

        ResponseHandler.success(res, result, 'Clinic configuration parameters retrieved');
    } catch (error) {
        next(error);
    }
};

exports.updateSettings = async (req, res, next) => {
    try {
        const clinicId = req.user.clinic_id;
        const updates = req.body; // Expecting { key: value } pairs

        const promises = Object.entries(updates).map(([key, value]) => {
            const settingKey = `clinic_${clinicId}_${key}`;
            return prisma.system_settings.upsert({
                where: { setting_key: settingKey },
                update: { setting_value: String(value), updated_at: new Date() },
                create: { setting_key: settingKey, setting_value: String(value) }
            });
        });

        await Promise.all(promises);

        ResponseHandler.success(res, updates, 'Clinic configuration parameters synchronized');
    } catch (error) {
        next(error);
    }
};
