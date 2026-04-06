const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const labModel = {
    createLabOrder: async (orderData) => {
        // Only include fields that exist in the lab_orders table schema
        const validData = {
            patient_id: orderData.patient_id,
            doctor_id: orderData.doctor_id,
            clinic_id: orderData.clinic_id,
            test_type_id: orderData.test_type_id,
            priority: orderData.priority || 'Normal',
            price: orderData.price,
            notes: orderData.notes,
            status: orderData.status || 'Pending',
            order_date: orderData.order_date ? new Date(orderData.order_date) : new Date()
        };

        return await prisma.lab_orders.create({
            data: {
                lab_order_id: `LAB-${Date.now()}`,
                ...validData
            },
            include: {
                patient: {
                    select: {
                        full_name: true,
                        users: {
                            include: {
                                emails: { where: { is_primary: true } }
                            }
                        }
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
                        users: {
                            include: {
                                emails: { where: { is_primary: true } }
                            }
                        }
                    }
                },
                doctor: {
                    select: {
                        full_name: true
                    }
                },
                lab_test_types: true,
                clinic: {
                    select: {
                        clinic_name: true
                    }
                },
                lab_test_results: true,
                lab_samples: true
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
                        age: true,
                        gender: true,
                        users: {
                            include: {
                                emails: { where: { is_primary: true } },
                                contact_numbers: { where: { is_primary: true } }
                            }
                        }
                    }
                },
                doctor: {
                    select: {
                        full_name: true
                    }
                },
                lab_test_types: true,
                clinic: {
                    select: {
                        clinic_name: true
                    }
                },
                lab_test_results: true,
                lab_samples: true
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
    },

    getLabByUserId: async (userId) => {
        return await prisma.labs.findUnique({
            where: { user_id: parseInt(userId) },
            include: { address: true }
        });
    },

    getLabDashboardStats: async (labId) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [totalTestsToday, totalBookings, pendingReports, completedReports, revenue] = await Promise.all([
            prisma.lab_orders.count({
                where: {
                    lab_id: labId,
                    order_date: { gte: today }
                }
            }),
            prisma.lab_orders.count({
                where: { lab_id: labId }
            }),
            prisma.lab_orders.count({
                where: { lab_id: labId, status: { not: 'Completed' } }
            }),
            prisma.lab_orders.count({
                where: { lab_id: labId, status: 'Completed' }
            }),
            prisma.lab_order_items.aggregate({
                where: { lab_orders: { lab_id: labId, status: 'Completed' } },
                _sum: { price: true }
            })
        ]);

        const recentActivity = await prisma.lab_orders.findMany({
            where: { lab_id: labId },
            include: {
                patient: { select: { full_name: true } }
            },
            orderBy: { order_date: 'desc' },
            take: 5
        });

        return {
            totalTestsToday,
            totalBookings,
            pendingReports,
            completedReports,
            revenueSummary: revenue._sum.price || 0,
            recentActivity
        };
    },

    getLabBookings: async (labId, filters = {}) => {
        const where = { lab_id: labId };
        if (filters.status) where.status = filters.status;
        
        return await prisma.lab_orders.findMany({
            where,
            include: {
                patient: { select: { full_name: true, gender: true, date_of_birth: true } },
                doctor: { select: { full_name: true } },
                lab_order_items: { include: { lab_test_types: true } }
            },
            orderBy: { order_date: 'desc' }
        });
    },

    getLabTransactions: async (labId, filters = {}) => {
        const orders = await prisma.lab_orders.findMany({
            where: { lab_id: labId },
            include: {
                patient: { select: { full_name: true } },
                lab_order_items: { include: { lab_test_types: true } }
            },
            orderBy: { order_date: 'desc' }
        });

        // Flatten data for billing UI
        return orders.map(order => {
            const totalPrice = order.lab_order_items.reduce((sum, item) => sum + Number(item.price || 0), 0);
            return {
                order_id: order.lab_order_id,
                patient_name: order.patient?.full_name || 'Walking Customer',
                test_name: order.lab_order_items.map(i => i.lab_test_types.test_name).join(', ') || 'Diagnostic Service',
                created_at: order.order_date,
                price: totalPrice,
                payment_status: order.status === 'Completed' ? 'Paid' : 'Pending'
            };
        });
    },

    getLabTests: async (labId) => {
        return await prisma.lab_tests.findMany({
            where: { lab_id: labId },
            orderBy: { test_name: 'asc' }
        });
    },

    addLabTest: async (data) => {
        return await prisma.lab_tests.create({ data });
    },

    updateLabTest: async (testId, data) => {
        return await prisma.lab_tests.update({
            where: { test_id: parseInt(testId) },
            data
        });
    },

    deleteLabTest: async (testId) => {
        return await prisma.lab_tests.delete({
            where: { test_id: parseInt(testId) }
        });
    },

    getLabStaff: async (labId, filters = {}) => {
        const { status, role, sortBy } = filters;
        const where = { lab_id: labId };
        
        if (status) where.is_active = status === 'active';
        if (role) where.role = role;
        
        let orderBy = { full_name: 'asc' };
        if (sortBy === 'status') orderBy = { is_active: 'desc' };
        if (sortBy === 'role') orderBy = { role: 'asc' };
        if (sortBy === 'clearance') orderBy = { security_level: 'desc' };

        return await prisma.lab_staff.findMany({ 
            where, 
            orderBy 
        });
    },

    addLabStaff: async (data) => {
        return await prisma.lab_staff.create({ data });
    },

    updateLabStaff: async (staffId, data) => {
        return await prisma.lab_staff.update({
            where: { id: parseInt(staffId) },
            data
        });
    },

    getClinicConnections: async (labId) => {
        return await prisma.clinic_lab_mapping.findMany({
            where: { lab_id: labId },
            include: {
                clinics: {
                    select: {
                        clinic_name: true,
                        medical_council_reg_no: true,
                        address: true
                    }
                }
            }
        });
    },

    getPotentialPartnerClinics: async (labId) => {
        // Find clinics NOT already mapped to this lab
        const existingMappings = await prisma.clinic_lab_mapping.findMany({
            where: { lab_id: labId },
            select: { clinic_id: true }
        });
        const existingClinicIds = existingMappings.map(m => m.clinic_id);

        return await prisma.clinics.findMany({
            where: {
                id: { notIn: existingClinicIds }
            },
            select: {
                id: true,
                clinic_name: true,
                medical_council_reg_no: true,
                address: {
                    select: {
                        address: true,
                        city: true
                    }
                }
            }
        });
    },

    getClinicMappingReports: async (labId) => {
        // Aggregate statistics of orders from each connected clinic
        const report = await prisma.lab_orders.groupBy({
            by: ['clinic_id'],
            where: { lab_id: labId },
            _count: { lab_order_id: true },
            _sum: { price: true }
        });

        // Enrich with clinic names
        return await Promise.all(report.map(async (item) => {
            if (!item.clinic_id) return null;
            const clinic = await prisma.clinics.findUnique({
                where: { id: item.clinic_id },
                select: { clinic_name: true }
            });
            return {
                clinic_id: item.clinic_id,
                clinic_name: clinic?.clinic_name || 'Direct Order',
                order_count: item._count.lab_order_id,
                total_revenue: item._sum.price || 0
            };
        })).then(results => results.filter(r => r !== null));
    },

    getAllTestTypes: async () => {
        return await prisma.lab_test_types.findMany({
            orderBy: { test_name: 'asc' }
        });
    },

    getLabShifts: async (labId) => {
        return await prisma.lab_shifts.findMany({
            where: { lab_id: labId },
            include: { staff: { select: { full_name: true, role: true } } },
            orderBy: { shift_date: 'desc' }
        });
    },

    createLabShift: async (data) => {
        return await prisma.lab_shifts.create({ data });
    },

    getSchedulingData: async (labId) => {
        const [workingHours, bookingSlots, holidays] = await Promise.all([
            prisma.lab_facility_hours.findMany({ where: { lab_id: labId } }),
            prisma.lab_booking_slots.findMany({ where: { lab_id: labId }, orderBy: { slot_time: 'asc' } }),
            prisma.lab_holidays.findMany({ where: { lab_id: labId }, orderBy: { holiday_date: 'asc' } })
        ]);
        return { workingHours, bookingSlots, holidays };
    },

    updateSchedulingData: async (labId, { workingHours, holidays, slots }) => {
        // Run all updates in a transaction
        return await prisma.$transaction(async (tx) => {
            // Update facility hours
            if (workingHours && workingHours.length > 0) {
                for (const wh of workingHours) {
                    await tx.lab_facility_hours.upsert({
                        where: { lab_id_day_of_week: { lab_id: labId, day_of_week: wh.day } },
                        update: { is_open: wh.isOpen, open_time: wh.openTime || null, close_time: wh.closeTime || null },
                        create: { lab_id: labId, day_of_week: wh.day, is_open: wh.isOpen, open_time: wh.openTime || null, close_time: wh.closeTime || null }
                    });
                }
            }

            // Update booking slots
            if (slots) {
                await tx.lab_booking_slots.deleteMany({ where: { lab_id: labId } });
                if (slots.length > 0) {
                    await tx.lab_booking_slots.createMany({
                        data: slots.map(time => ({ lab_id: labId, slot_time: time, is_active: true }))
                    });
                }
            }

            // Update holidays
            if (holidays) {
                await tx.lab_holidays.deleteMany({ where: { lab_id: labId } });
                if (holidays.length > 0) {
                    await tx.lab_holidays.createMany({
                        data: holidays.map(h => ({
                            lab_id: labId,
                            holiday_date: new Date(h.date),
                            holiday_name: h.name,
                            holiday_type: h.type || 'Public Holiday'
                        }))
                    });
                }
            }

            return true;
        });
    }
};

module.exports = labModel;
