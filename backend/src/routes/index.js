const express = require('express');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const doctorRoutes = require('./doctorRoutes');
const specialtyRoutes = require('./specialtyRoutes');
const appointmentRoutes = require('./appointmentRoutes');
const dashboardRoutes = require('./dashboardRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/doctors', doctorRoutes);
router.use('/specialties', specialtyRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/dashboard', dashboardRoutes);

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'API funcionando' });
});

module.exports = router;
