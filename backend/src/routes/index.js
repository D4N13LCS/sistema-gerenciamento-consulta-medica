const express = require('express');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const doctorRoutes = require('./doctorRoutes');
const specialtyRoutes = require('./specialtyRoutes');
const appointmentRoutes = require('./appointmentRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const patientRoutes = require('./patientRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/doctors', doctorRoutes);
router.use('/specialties', specialtyRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/patients', patientRoutes);
router.use('/dashboard', dashboardRoutes);

router.get('/', (_req, res) => {
  res.json({
    name: 'Medical Appointments API',
    version: '1.0.0',
    status: 'online',
    documentation: '/api/docs',
    health: '/api/health'
  });
});

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'API funcionando' });
});

module.exports = router;
