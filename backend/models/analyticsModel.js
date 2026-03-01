const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const analyticsModel = {
    // Get daily appointment counts for the last 7 days
    getDailyAppointments: async (clinicId) => {
        return await prisma.$queryRaw`
      SELECT 
        TO_CHAR(appointment_date, 'Mon DD') as date,
        COUNT(*)::int as count
      FROM appointments
      WHERE appointment_date >= CURRENT_DATE - INTERVAL '7 days'
      ${clinicId ? prisma.$queryRaw`AND clinic_id = ${clinicId}` : ''}
      GROUP BY appointment_date
      ORDER BY appointment_date ASC
    `;
    },

    // Get monthly revenue trend
    getRevenueTrend: async (clinicId) => {
        return await prisma.$queryRaw`
      SELECT 
        TO_CHAR(appointment_date, 'Mon') as month,
        SUM(earnings)::float as revenue
      FROM appointments
      WHERE appointment_date >= CURRENT_DATE - INTERVAL '6 months'
      ${clinicId ? prisma.$queryRaw`AND clinic_id = ${clinicId}` : ''}
      GROUP BY TO_CHAR(appointment_date, 'Mon'), DATE_TRUNC('month', appointment_date)
      ORDER BY DATE_TRUNC('month', appointment_date) ASC
    `;
    },

    // Get patient visit distribution (New vs Follow-up)
    getPatientVisitDistribution: async (clinicId) => {
        return await prisma.$queryRaw`
      SELECT 
        type as name,
        COUNT(*)::int as value
      FROM appointments
      WHERE 1=1
      ${clinicId ? prisma.$queryRaw`AND clinic_id = ${clinicId}` : ''}
      GROUP BY type
    `;
    },

    // Get doctor performance metrics
    getDoctorPerformance: async (clinicId) => {
        return await prisma.$queryRaw`
      SELECT 
        d.full_name as name,
        COUNT(a.appointment_id)::int as consultations,
        SUM(a.earnings)::float as revenue,
        4.8 as rating -- Placeholder for rating logic if available
      FROM doctors d
      LEFT JOIN appointments a ON d.id = a.doctor_id
      WHERE 1=1
      ${clinicId ? prisma.$queryRaw`AND a.clinic_id = ${clinicId}` : ''}
      GROUP BY d.id, d.full_name
      ORDER BY revenue DESC
    `;
    },

    // Key Dashboard Metrics
    getDashboardStats: async (clinicId) => {
        const where = clinicId ? { clinic_id: parseInt(clinicId) } : {};

        const [totalAppointments, totalPatients, totalRevenue] = await Promise.all([
            prisma.appointments.count({ where }),
            prisma.patients.count(), // Patients aren't tied to clinic in schema?
            prisma.appointments.aggregate({
                where,
                _sum: {
                    earnings: true
                }
            })
        ]);

        return {
            totalAppointments,
            totalPatients,
            totalRevenue: totalRevenue._sum.earnings || 0,
            avgRating: 4.75 // Placeholder
        };
    }
};

module.exports = analyticsModel;
