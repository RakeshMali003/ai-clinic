const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const labModel = {
    createLabOrder: async (orderData) => {
        return await prisma.lab_orders.create({
            data: {
                lab_order_id: `LAB-${Date.now()}`,
                ...orderData,
                status: orderData.status || 'Pending',
                order_date: new Date()
            },
            include: {
                patient: {
                    select: {
                        full_name: true,
                        email: true
                    }
                },
                doctor: {
                    select: {
                        full_name: true
                    }
                }
            }
        });
    },

    getAllLabOrders: async (filters = {}) => {
        const where = {};
        if (filters.clinic_id) where.clinic_id = parseInt(filters.clinic_id);
        if (filters.patient_id) where.patient_id = filters.patient_id;
        if (filters.doctor_id) where.doctor_id = parseInt(filters.doctor_id);
        if (filters.status) where.status = filters.status;

        return await prisma.lab_orders.findMany({
            where,
            include: {
                patient: {
                    select: {
                        full_name: true,
                        email: true
                    }
                },
                doctor: {
                    select: {
                        full_name: true
                    }
                }
            },
            orderBy: {
                order_date: 'desc'
            }
        });
    },

    getLabOrderById: async (id) => {
        return await prisma.lab_orders.findUnique({
            where: { lab_order_id: id },
            include: {
                patient: {
                    select: {
                        full_name: true,
                        email: true,
                        phone: true,
                        age: true,
                        gender: true
                    }
                },
                doctor: {
                    select: {
                        full_name: true
                    }
                }
            }
        });
    },

    updateLabOrderStatus: async (id, status, notes) => {
        return await prisma.lab_orders.update({
            where: { lab_order_id: id },
            data: {
                status,
                ...(notes && { notes })
            }
        });
    },

    deleteLabOrder: async (id) => {
        return await prisma.lab_orders.delete({
            where: { lab_order_id: id }
        });
    }
};

module.exports = labModel;
