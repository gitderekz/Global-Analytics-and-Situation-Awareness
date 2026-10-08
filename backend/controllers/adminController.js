const bcrypt = require('bcryptjs');
const db = require('../models');
const { createCrudController } = require('../utils/crudFactory');
const { success, error } = require('../utils/response');
const { buildFeatureCollection, buildLineString, buildPolygon } = require('../services/geojsonService');

const userController = createCrudController(db.User, {
  name: 'User',
  exclude: ['password'],
  include: [{ model: db.Role, attributes: ['id', 'name'] }],
  searchFields: ['firstName', 'lastName', 'email'],
  beforeCreate: async (data) => {
    if (data.password) data.password = await bcrypt.hash(data.password, 10);
    return data;
  },
  beforeUpdate: async (data) => {
    if (data.password) data.password = await bcrypt.hash(data.password, 10);
    return data;
  },
});

exports.getSchema = (req, res) => {
  const schemas = {
    events: {
      label: 'Events', endpoint: '/events',
      fields: [
        { key: 'eventType', label: 'Type', type: 'text', required: true },
        { key: 'title', label: 'Title', type: 'text', required: true },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'severity', label: 'Severity', type: 'select', options: ['Info', 'Low', 'Medium', 'High', 'Critical'] },
        { key: 'status', label: 'Status', type: 'select', options: ['Open', 'Investigating', 'In Progress', 'Resolved', 'Closed'] },
        { key: 'source', label: 'Source', type: 'text' },
        { key: 'latitude', label: 'Latitude', type: 'number' },
        { key: 'longitude', label: 'Longitude', type: 'number' },
        { key: 'country', label: 'Country', type: 'text' },
        { key: 'region', label: 'Region', type: 'text' },
        { key: 'city', label: 'City', type: 'text' },
      ],
    },
    assets: {
      label: 'Assets', endpoint: '/assets',
      fields: [
        { key: 'assetType', label: 'Type', type: 'select', options: ['Vehicle', 'Ship', 'Aircraft', 'Drone', 'Container', 'Worker', 'Machine'], required: true },
        { key: 'name', label: 'Name', type: 'text', required: true },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'status', label: 'Status', type: 'select', options: ['active', 'inactive', 'offline', 'maintenance'] },
        { key: 'latitude', label: 'Latitude', type: 'number' },
        { key: 'longitude', label: 'Longitude', type: 'number' },
        { key: 'speed', label: 'Speed', type: 'number' },
        { key: 'heading', label: 'Heading', type: 'number' },
        { key: 'altitude', label: 'Altitude', type: 'number' },
      ],
    },
    devices: {
      label: 'Devices', endpoint: '/devices',
      fields: [
        { key: 'deviceId', label: 'Device ID', type: 'text', required: true },
        { key: 'name', label: 'Name', type: 'text' },
        { key: 'deviceType', label: 'Type', type: 'select', options: ['Sensor', 'Camera', 'Gateway', 'Router', 'Tracker', 'Server'], required: true },
        { key: 'status', label: 'Status', type: 'select', options: ['online', 'offline', 'maintenance', 'error'] },
        { key: 'latitude', label: 'Latitude', type: 'number' },
        { key: 'longitude', label: 'Longitude', type: 'number' },
      ],
    },
    alerts: {
      label: 'Alerts', endpoint: '/admin/alerts',
      fields: [
        { key: 'title', label: 'Title', type: 'text', required: true },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'severity', label: 'Severity', type: 'select', options: ['Info', 'Low', 'Medium', 'High', 'Critical'] },
        { key: 'status', label: 'Status', type: 'select', options: ['New', 'Acknowledged', 'In Progress', 'Resolved'] },
        { key: 'eventId', label: 'Event ID', type: 'number' },
      ],
    },
    threats: {
      label: 'Threats', endpoint: '/admin/threats',
      fields: [
        { key: 'threatType', label: 'Type', type: 'select', options: ['DDoS', 'Malware', 'Phishing', 'Port Scan', 'Brute Force'] },
        { key: 'sourceIp', label: 'Source IP', type: 'text' },
        { key: 'destinationIp', label: 'Destination IP', type: 'text' },
        { key: 'country', label: 'Country', type: 'text' },
        { key: 'severity', label: 'Severity', type: 'select', options: ['Info', 'Low', 'Medium', 'High', 'Critical'] },
        { key: 'status', label: 'Status', type: 'select', options: ['active', 'mitigated', 'resolved'] },
        { key: 'eventId', label: 'Event ID', type: 'number' },
      ],
    },
    transactions: {
      label: 'Transactions', endpoint: '/admin/transactions',
      fields: [
        { key: 'transactionId', label: 'Transaction ID', type: 'text', required: true },
        { key: 'amount', label: 'Amount', type: 'number' },
        { key: 'currency', label: 'Currency', type: 'text' },
        { key: 'riskLevel', label: 'Risk', type: 'select', options: ['Low', 'Medium', 'High', 'Critical'] },
        { key: 'status', label: 'Status', type: 'select', options: ['pending', 'approved', 'flagged', 'blocked'] },
        { key: 'latitude', label: 'Latitude', type: 'number' },
        { key: 'longitude', label: 'Longitude', type: 'number' },
      ],
    },
    geofences: {
      label: 'Geofences', endpoint: '/admin/geofences',
      fields: [
        { key: 'name', label: 'Name', type: 'text', required: true },
        { key: 'type', label: 'Type', type: 'select', options: ['Circle', 'Polygon', 'Rectangle'] },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'active', label: 'Active', type: 'checkbox' },
      ],
    },
    routes: {
      label: 'Routes', endpoint: '/admin/routes',
      fields: [
        { key: 'name', label: 'Name', type: 'text' },
        { key: 'assetId', label: 'Asset ID', type: 'number' },
        { key: 'status', label: 'Status', type: 'select', options: ['active', 'completed', 'planned'] },
      ],
    },
    countries: {
      label: 'Countries', endpoint: '/admin/countries',
      fields: [
        { key: 'name', label: 'Name', type: 'text', required: true },
        { key: 'code', label: 'Code', type: 'text' },
        { key: 'continentId', label: 'Continent ID', type: 'number' },
        { key: 'latitude', label: 'Latitude', type: 'number' },
        { key: 'longitude', label: 'Longitude', type: 'number' },
      ],
    },
    continents: {
      label: 'Continents', endpoint: '/admin/continents',
      fields: [
        { key: 'name', label: 'Name', type: 'text', required: true },
        { key: 'code', label: 'Code', type: 'text' },
      ],
    },
    regions: {
      label: 'Regions', endpoint: '/admin/regions',
      fields: [
        { key: 'name', label: 'Name', type: 'text', required: true },
        { key: 'countryId', label: 'Country ID', type: 'number' },
        { key: 'latitude', label: 'Latitude', type: 'number' },
        { key: 'longitude', label: 'Longitude', type: 'number' },
      ],
    },
    cities: {
      label: 'Cities', endpoint: '/admin/cities',
      fields: [
        { key: 'name', label: 'Name', type: 'text', required: true },
        { key: 'regionId', label: 'Region ID', type: 'number' },
        { key: 'latitude', label: 'Latitude', type: 'number' },
        { key: 'longitude', label: 'Longitude', type: 'number' },
      ],
    },
    users: {
      label: 'Users', endpoint: '/admin/users',
      fields: [
        { key: 'firstName', label: 'First Name', type: 'text', required: true },
        { key: 'lastName', label: 'Last Name', type: 'text', required: true },
        { key: 'email', label: 'Email', type: 'email', required: true },
        { key: 'password', label: 'Password', type: 'password', roles: ['Super Admin', 'Admin'] },
        { key: 'roleId', label: 'Role ID', type: 'number', required: true, roles: ['Super Admin'] },
        { key: 'status', label: 'Status', type: 'select', options: ['active', 'inactive', 'suspended'], roles: ['Super Admin', 'Admin'] },
        { key: 'phone', label: 'Phone', type: 'text' },
      ],
    },
    settings: {
      label: 'Settings', endpoint: '/admin/settings',
      fields: [
        { key: 'key', label: 'Key', type: 'text', required: true },
        { key: 'value', label: 'Value', type: 'text' },
        { key: 'description', label: 'Description', type: 'text' },
      ],
    },
    'sensor-readings': {
      label: 'Sensor Readings', endpoint: '/admin/sensor-readings',
      fields: [
        { key: 'deviceId', label: 'Device ID', type: 'number', required: true },
        { key: 'metric', label: 'Metric', type: 'text', required: true },
        { key: 'value', label: 'Value', type: 'number' },
      ],
    },
    notifications: {
      label: 'Notifications', endpoint: '/admin/notifications',
      fields: [
        { key: 'userId', label: 'User ID', type: 'number', required: true },
        { key: 'title', label: 'Title', type: 'text', required: true },
        { key: 'message', label: 'Message', type: 'textarea' },
        { key: 'type', label: 'Type', type: 'select', options: ['system', 'alert', 'user', 'device', 'security'] },
        { key: 'isRead', label: 'Read', type: 'checkbox' },
      ],
    },
  };
  return success(res, schemas);
};

exports.users = userController;

exports.getHeatmapGeoJSON = async (req, res) => {
  try {
    const events = await db.Event.findAll({
      where: { latitude: { [db.Sequelize.Op.ne]: null } },
      attributes: ['latitude', 'longitude', 'severity'],
      limit: 10000,
    });
    const features = events.map((e) => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [parseFloat(e.longitude), parseFloat(e.latitude)] },
      properties: {
        weight: { Info: 0.2, Low: 0.4, Medium: 0.6, High: 0.8, Critical: 1 }[e.severity] || 0.5,
      },
    }));
    return success(res, { type: 'FeatureCollection', features });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.getRoutesGeoJSON = async (req, res) => {
  try {
    const routes = await db.Route.findAll({
      include: [{ model: db.RoutePoint, order: [['sequence', 'ASC']] }],
    });
    const features = [];
    for (const route of routes) {
      const points = route.RoutePoints || [];
      if (points.length >= 2) {
        features.push(buildLineString(points, { id: route.id, name: route.name, status: route.status }));
      }
    }
    const assetTracks = await db.AssetTrack.findAll({
      attributes: ['assetId', 'latitude', 'longitude', 'timestamp'],
      order: [['assetId', 'ASC'], ['timestamp', 'ASC']],
      limit: 5000,
    });
    const byAsset = {};
    assetTracks.forEach((t) => {
      if (!byAsset[t.assetId]) byAsset[t.assetId] = [];
      byAsset[t.assetId].push(t);
    });
    Object.entries(byAsset).forEach(([assetId, points]) => {
      if (points.length >= 2) {
        features.push(buildLineString(points, { assetId, type: 'track' }));
      }
    });
    return success(res, { type: 'FeatureCollection', features });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.getGeofencesGeoJSON = async (req, res) => {
  try {
    const geofences = await db.Geofence.findAll({
      where: { active: true },
      include: [{ model: db.GeofencePoint, order: [['sequence', 'ASC']] }],
    });
    const features = geofences
      .filter((g) => g.GeofencePoints?.length >= 3)
      .map((g) => buildPolygon(g.GeofencePoints, { id: g.id, name: g.name, type: g.type }));
    return success(res, { type: 'FeatureCollection', features });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.getGeofencePoints = async (req, res) => {
  try {
    const geofenceId = req.params.id;
    if (!geofenceId) return error(res, 'Geofence ID required', 400);
    const points = await db.GeofencePoint.findAll({ where: { geofenceId }, order: [['sequence', 'ASC']] });
    return success(res, points);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.seedDemoData = async (req, res) => {
  try {
    const roleNames = ['Super Admin', 'Admin', 'Operator', 'Analyst', 'Viewer'];
    const roles = {};
    for (const name of roleNames) {
      const [role] = await db.Role.findOrCreate({ where: { name }, defaults: { description: `${name} role` } });
      roles[name] = role;
    }

    const [adminUser] = await db.User.findOrCreate({
      where: { email: 'admin@analytics.local' },
      defaults: {
        firstName: 'System',
        lastName: 'Admin',
        email: 'admin@analytics.local',
        password: await bcrypt.hash('admin123', 10),
        status: 'active',
        roleId: roles['Super Admin'].id,
      },
    });

    const initialSeed = {
      events: 0,
      assets: 0,
      devices: 0,
      alerts: 0,
      threats: 0,
      transactions: 0,
      geofences: 0,
      tracks: 0,
    };

    if ((await db.Event.count()) === 0) {
      await db.Event.bulkCreate([
        { eventType: 'Cyber Attack', title: 'DDoS Attack Detected', description: 'Distributed denial of service attack from external source', severity: 'Critical', status: 'Open', source: 'SOC', latitude: 39.9042, longitude: 116.4074, country: 'China', city: 'Beijing', startTime: new Date() },
        { eventType: 'Network Outage', title: 'Router Failure - NYC', description: 'Core router offline in New York datacenter', severity: 'High', status: 'Investigating', source: 'NOC', latitude: 40.7128, longitude: -74.0060, country: 'United States', city: 'New York', startTime: new Date() },
        { eventType: 'Sensor Alert', title: 'Temperature Threshold Exceeded', description: 'Industrial sensor reading above safe limit', severity: 'Medium', status: 'Open', source: 'IoT', latitude: -6.7924, longitude: 39.2083, country: 'Tanzania', city: 'Dar es Salaam', startTime: new Date() },
      ]);
      initialSeed.events += 3;
    }

    if ((await db.Asset.count()) === 0) {
      await db.Asset.bulkCreate([
        { assetType: 'Vehicle', name: 'Fleet Truck Alpha', status: 'active', latitude: -6.7924, longitude: 39.2083, speed: 45.5, heading: 180 },
        { assetType: 'Aircraft', name: 'Cargo Flight TZ-401', status: 'active', latitude: -1.5, longitude: 35.0, speed: 850, heading: 45, altitude: 10000 },
      ]);
      initialSeed.assets += 2;
    }

    if ((await db.Device.count()) === 0) {
      await db.Device.bulkCreate([
        { deviceId: 'SENS-001', name: 'Temp Sensor Warehouse A', deviceType: 'Sensor', status: 'online', latitude: -6.7924, longitude: 39.2083, lastSeen: new Date() },
        { deviceId: 'CAM-042', name: 'Security Camera Gate 3', deviceType: 'Camera', status: 'online', latitude: -6.8160, longitude: 39.2803, lastSeen: new Date() },
      ]);
      initialSeed.devices += 2;
    }

    if ((await db.Alert.count()) === 0) {
      const event = await db.Event.findOne();
      if (event) {
        await db.Alert.create({ eventId: event.id, title: 'Critical Incident', description: event.description, severity: 'Critical', status: 'New' });
        initialSeed.alerts += 1;
      }
    }

    if ((await db.Threat.count()) === 0) {
      const event = await db.Event.findOne();
      if (event) {
        await db.Threat.create({ eventId: event.id, threatType: 'Brute Force', sourceIp: '198.51.100.22', destinationIp: '10.0.0.5', country: event.country || 'Unknown', severity: 'Medium', status: 'active' });
        initialSeed.threats += 1;
      }
    }

    if ((await db.Transaction.count()) === 0) {
      await db.Transaction.bulkCreate([
        { transactionId: 'TXN-10001', amount: 15000, currency: 'USD', riskLevel: 'High', status: 'flagged' },
        { transactionId: 'TXN-10002', amount: 250, currency: 'USD', riskLevel: 'Low', status: 'approved' },
      ]);
      initialSeed.transactions += 2;
    }

    if ((await db.Geofence.count()) === 0) {
      const geofence = await db.Geofence.create({ name: 'Dar es Salaam Port Zone', type: 'Polygon', description: 'Operational port area', active: true });
      await db.GeofencePoint.bulkCreate([
        { geofenceId: geofence.id, latitude: -6.8200, longitude: 39.2600, sequence: 0 },
        { geofenceId: geofence.id, latitude: -6.8200, longitude: 39.3000, sequence: 1 },
        { geofenceId: geofence.id, latitude: -6.8500, longitude: 39.3000, sequence: 2 },
        { geofenceId: geofence.id, latitude: -6.8500, longitude: 39.2600, sequence: 3 },
      ]);
      initialSeed.geofences += 1;
      initialSeed.tracks += 4;
    }

    const routesCreated = await ensureRouteSeedData();
    const heatmapCount = await ensureHeatmapSeedData();

    return success(res, {
      user: { email: adminUser.email },
      seeded: {
        ...initialSeed,
        routes: routesCreated,
        heatmapEvents: heatmapCount,
      },
      roles: roleNames,
    }, 'Demo data populated successfully');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

const ensureRouteSeedData = async () => {
  const routeSeeds = [
    { name: 'Harbor Run', status: 'active', points: [
      { latitude: -6.7924, longitude: 39.2083 },
      { latitude: -6.8000, longitude: 39.2200 },
      { latitude: -6.8100, longitude: 39.2350 },
      { latitude: -6.8200, longitude: 39.2480 },
      { latitude: -6.8300, longitude: 39.2600 },
    ] },
    { name: 'Coastal Patrol', status: 'planned', points: [
      { latitude: -6.8200, longitude: 39.2500 },
      { latitude: -6.8300, longitude: 39.2700 },
      { latitude: -6.8400, longitude: 39.2900 },
      { latitude: -6.8550, longitude: 39.3050 },
    ] },
    { name: 'Airport Corridor', status: 'active', points: [
      { latitude: -6.7700, longitude: 39.2000 },
      { latitude: -6.7600, longitude: 39.2200 },
      { latitude: -6.7480, longitude: 39.2360 },
    ] },
  ];

  const existingCount = await db.Route.count();
  if (existingCount > 0) return existingCount;

  const createdRoutes = await db.Route.bulkCreate(routeSeeds.map(({ name, status }) => ({ name, status })));
  const routePoints = createdRoutes.flatMap((route, index) =>
    routeSeeds[index].points.map((point, sequence) => ({
      routeId: route.id,
      latitude: point.latitude,
      longitude: point.longitude,
      sequence,
    }))
  );

  if (routePoints.length) await db.RoutePoint.bulkCreate(routePoints);
  return createdRoutes.length;
};

const ensureHeatmapSeedData = async () => {
  const heatmapSeed = [
    { eventType: 'Sensor Spike', title: 'Urban sensor cluster A', severity: 'Low', status: 'Open', source: 'IoT', latitude: -6.7950, longitude: 39.2100, country: 'Tanzania', city: 'Dar es Salaam', startTime: new Date() },
    { eventType: 'Sensor Spike', title: 'Urban sensor cluster B', severity: 'Low', status: 'Open', source: 'IoT', latitude: -6.7990, longitude: 39.2150, country: 'Tanzania', city: 'Dar es Salaam', startTime: new Date() },
    { eventType: 'Sensor Spike', title: 'Harbor sensor cluster', severity: 'High', status: 'Open', source: 'IoT', latitude: -6.8150, longitude: 39.2430, country: 'Tanzania', city: 'Dar es Salaam', startTime: new Date() },
    { eventType: 'Sensor Spike', title: 'Port edge anomaly', severity: 'Medium', status: 'Investigating', source: 'IoT', latitude: -6.8220, longitude: 39.2550, country: 'Tanzania', city: 'Dar es Salaam', startTime: new Date() },
    { eventType: 'Sensor Spike', title: 'Logistics corridor', severity: 'Low', status: 'Open', source: 'IoT', latitude: -6.8380, longitude: 39.2800, country: 'Tanzania', city: 'Dar es Salaam', startTime: new Date() },
  ];

  const count = await db.Event.count();
  if (count >= 18) return count;

  await db.Event.bulkCreate(heatmapSeed);
  return count + heatmapSeed.length;
};
