const labModel = require('../models/labModel');

const labController = {
    // Create a new lab order
    createOrder: async (req, res) => {
        try {
            const orderData = {
                ...req.body,
                clinic_id: req.user.role === 'clinic' ? req.user.id : req.body.clinic_id,
                doctor_id: req.user.role === 'doctor' ? req.user.id : req.body.doctor_id
            };

            const newOrder = await labModel.createLabOrder(orderData);
            res.status(201).json({
                success: true,
                message: 'Lab order created successfully',
                data: newOrder
            });
        } catch (error) {
            console.error('Error creating lab order:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to create lab order',
                error: error.message
            });
        }
    },

    // Get all lab orders
    getOrders: async (req, res) => {
        try {
            const filters = { ...req.query };

            // If clinic user, only show their orders
            if (req.user.role === 'clinic') {
                filters.clinic_id = req.user.id;
            }

            // If doctor user, only show their orders
            if (req.user.role === 'doctor') {
                filters.doctor_id = req.user.id;
            }

            // If patient user, only show their orders
            if (req.user.role === 'patient') {
                filters.patient_id = req.user.patient_id; // Mapping from patient login if applicable
            }

            const orders = await labModel.getAllLabOrders(filters);
            res.status(200).json({
                success: true,
                data: orders
            });
        } catch (error) {
            console.error('Error fetching lab orders:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch lab orders',
                error: error.message
            });
        }
    },

    // Get single lab order details
    getOrderById: async (req, res) => {
        try {
            const order = await labModel.getLabOrderById(req.params.id);
            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: 'Lab order not found'
                });
            }
            res.status(200).json({
                success: true,
                data: order
            });
        } catch (error) {
            console.error('Error fetching lab order details:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch lab order details',
                error: error.message
            });
        }
    },

    // Update order status/results
    updateStatus: async (req, res) => {
        try {
            const { status, notes } = req.body;
            const updatedOrder = await labModel.updateLabOrderStatus(req.params.id, status, notes);
            res.status(200).json({
                success: true,
                message: 'Lab order status updated',
                data: updatedOrder
            });
        } catch (error) {
            console.error('Error updating lab order:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update lab order',
                error: error.message
            });
        }
    },

    // Delete lab order
    deleteOrder: async (req, res) => {
        try {
            await labModel.deleteLabOrder(req.params.id);
            res.status(200).json({
                success: true,
                message: 'Lab order deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting lab order:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to delete lab order',
                error: error.message
            });
        }
    }
};

module.exports = labController;
