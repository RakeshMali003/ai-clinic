const express = require('express');
const router = express.Router();

// Import Routes (Placeholders until created)
const authRoutes = require('./auth.routes');
const patientRoutes = require('./patient.routes');
const doctorRoutes = require('./doctor.routes');
const appointmentRoutes = require('./appointment.routes');
const clinicRoutes = require('./clinic.routes');
const prescriptionRoutes = require('./prescription.routes');
const invoiceRoutes = require('./invoice.routes');
const medicineRoutes = require('./medicine.routes');
const labOrderRoutes = require('./labOrder.routes');
const iotRoutes = require('./iot.routes');
const aiRoutes = require('./ai.routes');
const notificationRoutes = require('./notification.routes');
const dashboardRoutes = require('./dashboard.routes');

router.use('/auth', authRoutes);
router.use('/patients', patientRoutes);
router.use('/doctors', doctorRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/clinics', clinicRoutes);
router.use('/prescriptions', prescriptionRoutes);
router.use('/invoices', invoiceRoutes);
router.use('/medicines', medicineRoutes);
router.use('/lab-orders', labOrderRoutes);
router.use('/iot', iotRoutes);
router.use('/ai', aiRoutes);
router.use('/notifications', notificationRoutes);
router.use('/dashboard', dashboardRoutes);

router.get('/ping', (req, res) => res.json({ message: 'pong' }));

module.exports = router;
