const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const eventRoutes = require('./events');
const assetRoutes = require('./assets');
const deviceRoutes = require('./devices');
const alertRoutes = require('./alerts');
const analyticsRoutes = require('./analytics');
const geographyRoutes = require('./geography');
const adminRoutes = require('./admin');
const reportRoutes = require('./reports');

router.use('/auth', authRoutes);
router.use('/events', eventRoutes);
router.use('/assets', assetRoutes);
router.use('/devices', deviceRoutes);
router.use('/alerts', alertRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/geography', geographyRoutes);
router.use('/admin', adminRoutes);
router.use('/reports', reportRoutes);

router.get('/health', (req, res) => {
  res.json({ success: true, message: 'API healthy', data: { status: 'healthy', timestamp: new Date().toISOString() } });
});

router.get('/status', (req, res) => {
  res.json({ success: true, message: 'System status', data: { status: 'operational' } });
});

module.exports = router;
