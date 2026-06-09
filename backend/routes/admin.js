const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middlewares/auth');
const { createCrudRouter } = require('../utils/crudFactory');
const adminController = require('../controllers/adminController');
const db = require('../models');

const adminOnly = ['Super Admin', 'Admin'];

router.get('/schema', authenticate, adminController.getSchema);
router.get('/heatmap/geojson', authenticate, adminController.getHeatmapGeoJSON);
router.get('/routes/geojson', authenticate, adminController.getRoutesGeoJSON);
router.get('/geofences/geojson', authenticate, adminController.getGeofencesGeoJSON);

router.use('/users', (() => {
  const r = express.Router();
  const c = adminController.users;
  r.get('/', authenticate, authorize(...adminOnly), c.getAll);
  r.get('/:id', authenticate, authorize(...adminOnly), c.getById);
  r.post('/', authenticate, authorize('Super Admin'), c.create);
  r.put('/:id', authenticate, authorize('Super Admin', 'Admin'), c.update);
  r.delete('/:id', authenticate, authorize('Super Admin'), c.remove);
  return r;
})());

router.use('/alerts', createCrudRouter(db.Alert, { searchFields: ['title'], include: [{ model: db.Event }] }));
router.use('/threats', createCrudRouter(db.Threat, { searchFields: ['threatType', 'country'] }));
router.use('/transactions', createCrudRouter(db.Transaction, { searchFields: ['transactionId'] }));
router.use('/geofences', createCrudRouter(db.Geofence, { searchFields: ['name'] }));
router.use('/routes', createCrudRouter(db.Route, { include: [{ model: db.RoutePoint }] }));
router.use('/continents', createCrudRouter(db.Continent, { searchFields: ['name'], order: [['name', 'ASC']] }));
router.use('/countries', createCrudRouter(db.Country, { searchFields: ['name'], order: [['name', 'ASC']] }));
router.use('/regions', createCrudRouter(db.Region, { searchFields: ['name'], order: [['name', 'ASC']] }));
router.use('/cities', createCrudRouter(db.City, { searchFields: ['name'], order: [['name', 'ASC']] }));
router.use('/districts', createCrudRouter(db.District, { searchFields: ['name'] }));
router.use('/locations', createCrudRouter(db.Location));
router.use('/settings', createCrudRouter(db.Setting, { searchFields: ['key'] }));
router.use('/notifications', createCrudRouter(db.Notification, { searchFields: ['title'] }));
router.use('/sensor-readings', createCrudRouter(db.SensorReading, { order: [['timestamp', 'DESC']] }));
router.use('/roles', createCrudRouter(db.Role, { adminRoles: ['Super Admin'], searchFields: ['name'] }));
router.use('/geofence-points', createCrudRouter(db.GeofencePoint));
router.use('/route-points', createCrudRouter(db.RoutePoint));

module.exports = router;
