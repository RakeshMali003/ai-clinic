const analyticsModel = require('../models/analyticsModel');

const analyticsController = {
    getStats: async (req, res) => {
        try {
            const clinicId = req.user.role === 'clinic' ? req.user.id : null;
            const stats = await analyticsModel.getDashboardStats(clinicId);

            res.status(200).json({
                success: true,
                data: stats
            });
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch dashboard stats',
                error: error.message
            });
        }
    },

    getChartData: async (req, res) => {
        try {
            const clinicId = req.user.role === 'clinic' ? req.user.id : null;

            const [dailyAppointments, revenueTrend, visitDist, doctorPerf] = await Promise.all([
                analyticsModel.getDailyAppointments(clinicId),
                analyticsModel.getRevenueTrend(clinicId),
                analyticsModel.getPatientVisitDistribution(clinicId),
                analyticsModel.getDoctorPerformance(clinicId)
            ]);

            res.status(200).json({
                success: true,
                data: {
                    dailyAppointments,
                    revenueTrend,
                    visitDist,
                    doctorPerf
                }
            });
        } catch (error) {
            console.error('Error fetching chart data:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch chart data',
                error: error.message
            });
        }
    }
};

module.exports = analyticsController;
