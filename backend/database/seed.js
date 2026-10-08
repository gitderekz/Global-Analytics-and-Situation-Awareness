require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('../models');

const seed = async () => {
  try {
    await db.sequelize.authenticate();
    await db.sequelize.sync({ force: true });
    console.log('Database reset and synced');

    const roles = await db.Role.bulkCreate([
      { name: 'Super Admin', description: 'Full system access' },
      { name: 'Admin', description: 'Administrative access' },
      { name: 'Operator', description: 'Operations access' },
      { name: 'Analyst', description: 'Analytics access' },
      { name: 'Viewer', description: 'Read-only access' },
    ]);

    const hashedPassword = await bcrypt.hash('admin123', 10);
    await db.User.create({
      roleId: roles[0].id,
      firstName: 'System',
      lastName: 'Admin',
      email: 'admin@analytics.local',
      password: hashedPassword,
      status: 'active',
    });

    const africa = await db.Continent.create({ name: 'Africa', code: 'AF' });
    const asia = await db.Continent.create({ name: 'Asia', code: 'AS' });
    const europe = await db.Continent.create({ name: 'Europe', code: 'EU' });
    const northAmerica = await db.Continent.create({ name: 'North America', code: 'NA' });

    const tanzania = await db.Country.create({ continentId: africa.id, name: 'Tanzania', code: 'TZ', latitude: -6.3690, longitude: 34.8888 });
    const kenya = await db.Country.create({ continentId: africa.id, name: 'Kenya', code: 'KE', latitude: -0.0236, longitude: 37.9062 });
    const usa = await db.Country.create({ continentId: northAmerica.id, name: 'United States', code: 'US', latitude: 37.0902, longitude: -95.7129 });
    const uk = await db.Country.create({ continentId: europe.id, name: 'United Kingdom', code: 'GB', latitude: 55.3781, longitude: -3.4360 });
    const china = await db.Country.create({ continentId: asia.id, name: 'China', code: 'CN', latitude: 35.8617, longitude: 104.1954 });

    const dar = await db.Region.create({ countryId: tanzania.id, name: 'Dar es Salaam', latitude: -6.7924, longitude: 39.2083 });
    const nairobi = await db.Region.create({ countryId: kenya.id, name: 'Nairobi', latitude: -1.2921, longitude: 36.8219 });

    const darCity = await db.City.create({ regionId: dar.id, name: 'Dar es Salaam City', latitude: -6.8160, longitude: 39.2803 });
    await db.District.create({ cityId: darCity.id, name: 'Kinondoni', latitude: -6.7735, longitude: 39.2295 });

    await db.Setting.bulkCreate([
      { key: 'theme', value: 'dark', description: 'Default theme' },
      { key: 'default_map_center', value: JSON.stringify([20, 0]), description: 'Default map center [lng, lat]' },
      { key: 'default_zoom', value: '2', description: 'Default map zoom level' },
      { key: 'map_server_url', value: process.env.MAP_SERVER_URL || 'http://localhost:3650', description: 'MapTiler server URL' },
      { key: 'smtp_enabled', value: 'false', description: 'Enable email notifications' },
      { key: 'sms_enabled', value: 'false', description: 'Enable SMS notifications' },
    ]);

    const events = await db.Event.bulkCreate([
      { eventType: 'Cyber Attack', title: 'DDoS Attack Detected', description: 'Distributed denial of service attack from external source', severity: 'Critical', status: 'Open', source: 'SOC', latitude: 39.9042, longitude: 116.4074, country: 'China', city: 'Beijing', startTime: new Date() },
      { eventType: 'Network Outage', title: 'Router Failure - NYC', description: 'Core router offline in New York datacenter', severity: 'High', status: 'Investigating', source: 'NOC', latitude: 40.7128, longitude: -74.0060, country: 'United States', city: 'New York', startTime: new Date() },
      { eventType: 'Sensor Alert', title: 'Temperature Threshold Exceeded', description: 'Industrial sensor reading above safe limit', severity: 'Medium', status: 'Open', source: 'IoT', latitude: -6.7924, longitude: 39.2083, country: 'Tanzania', city: 'Dar es Salaam', startTime: new Date() },
      { eventType: 'Traffic Incident', title: 'Highway Collision', description: 'Multi-vehicle accident on main highway', severity: 'High', status: 'In Progress', source: 'Emergency', latitude: -1.2921, longitude: 36.8219, country: 'Kenya', city: 'Nairobi', startTime: new Date() },
      { eventType: 'Fraud', title: 'Suspicious Transaction Cluster', description: 'Multiple high-value transactions from same region', severity: 'High', status: 'Open', source: 'Fraud Detection', latitude: 51.5074, longitude: -0.1278, country: 'United Kingdom', city: 'London', startTime: new Date() },
      { eventType: 'Emergency', title: 'Flood Warning', description: 'Rising water levels in coastal area', severity: 'Critical', status: 'Open', source: 'Emergency Services', latitude: -6.8160, longitude: 39.2803, country: 'Tanzania', city: 'Dar es Salaam', startTime: new Date() },
      { eventType: 'Unauthorized Access', title: 'Failed Login Attempts', description: 'Brute force attack on admin portal', severity: 'Medium', status: 'Resolved', source: 'SOC', latitude: 55.7558, longitude: 37.6173, country: 'Russia', city: 'Moscow', startTime: new Date(Date.now() - 86400000) },
      { eventType: 'Asset Movement', title: 'Container Deviation', description: 'Shipping container off planned route', severity: 'Low', status: 'Open', source: 'Logistics', latitude: 1.3521, longitude: 103.8198, country: 'Singapore', city: 'Singapore', startTime: new Date() },
    ]);

    await db.Asset.bulkCreate([
      { assetType: 'Vehicle', name: 'Fleet Truck Alpha', status: 'active', latitude: -6.7924, longitude: 39.2083, speed: 45.5, heading: 180 },
      { assetType: 'Aircraft', name: 'Cargo Flight TZ-401', status: 'active', latitude: -1.5, longitude: 35.0, speed: 850, heading: 45, altitude: 10000 },
      { assetType: 'Ship', name: 'MV Indian Ocean', status: 'active', latitude: -5.0, longitude: 40.0, speed: 18, heading: 270 },
      { assetType: 'Drone', name: 'Survey Drone D-07', status: 'active', latitude: -6.7735, longitude: 39.2295, speed: 25, heading: 90 },
      { assetType: 'Container', name: 'CNT-88421', status: 'active', latitude: 1.3521, longitude: 103.8198, speed: 0, heading: 0 },
      { assetType: 'Vehicle', name: 'Emergency Response Unit', status: 'active', latitude: -1.2921, longitude: 36.8219, speed: 60, heading: 315 },
    ]);

    await db.Device.bulkCreate([
      { deviceId: 'SENS-001', name: 'Temp Sensor Warehouse A', deviceType: 'Sensor', status: 'online', latitude: -6.7924, longitude: 39.2083, lastSeen: new Date() },
      { deviceId: 'CAM-042', name: 'Security Camera Gate 3', deviceType: 'Camera', status: 'online', latitude: -6.8160, longitude: 39.2803, lastSeen: new Date() },
      { deviceId: 'GW-101', name: 'IoT Gateway Main', deviceType: 'Gateway', status: 'online', latitude: 40.7128, longitude: -74.0060, lastSeen: new Date() },
      { deviceId: 'RTR-205', name: 'Core Router NYC', deviceType: 'Router', status: 'offline', latitude: 40.7128, longitude: -74.0060, lastSeen: new Date(Date.now() - 3600000) },
      { deviceId: 'TRK-330', name: 'GPS Tracker Unit 330', deviceType: 'Tracker', status: 'online', latitude: -1.2921, longitude: 36.8219, lastSeen: new Date() },
    ]);

    await db.Alert.bulkCreate([
      { eventId: events[0].id, title: 'Critical: DDoS Attack', description: events[0].description, severity: 'Critical', status: 'New' },
      { eventId: events[1].id, title: 'High: Network Outage', description: events[1].description, severity: 'High', status: 'New' },
      { eventId: events[5].id, title: 'Critical: Flood Warning', description: events[5].description, severity: 'Critical', status: 'New' },
    ]);

    await db.Threat.bulkCreate([
      { eventId: events[0].id, threatType: 'DDoS', sourceIp: '203.0.113.45', destinationIp: '10.0.0.1', country: 'China', severity: 'Critical', status: 'active' },
      { eventId: events[6].id, threatType: 'Brute Force', sourceIp: '198.51.100.22', destinationIp: '10.0.0.5', country: 'Russia', severity: 'Medium', status: 'resolved' },
    ]);

    await db.Transaction.bulkCreate([
      { transactionId: 'TXN-10001', amount: 15000, currency: 'USD', riskLevel: 'High', latitude: 51.5074, longitude: -0.1278, status: 'flagged' },
      { transactionId: 'TXN-10002', amount: 250, currency: 'USD', riskLevel: 'Low', latitude: 40.7128, longitude: -74.0060, status: 'approved' },
      { transactionId: 'TXN-10003', amount: 8500, currency: 'EUR', riskLevel: 'Critical', latitude: 48.8566, longitude: 2.3522, status: 'blocked' },
    ]);

    const geofence = await db.Geofence.create({ name: 'Dar es Salaam Port Zone', type: 'Polygon', description: 'Operational port area', active: true });
    await db.GeofencePoint.bulkCreate([
      { geofenceId: geofence.id, latitude: -6.8200, longitude: 39.2600, sequence: 0 },
      { geofenceId: geofence.id, latitude: -6.8200, longitude: 39.3000, sequence: 1 },
      { geofenceId: geofence.id, latitude: -6.8500, longitude: 39.3000, sequence: 2 },
      { geofenceId: geofence.id, latitude: -6.8500, longitude: 39.2600, sequence: 3 },
    ]);

    const assets = await db.Asset.findAll({ limit: 2 });
    if (assets[0]) {
      await db.AssetTrack.bulkCreate([
        { assetId: assets[0].id, latitude: -6.7924, longitude: 39.2083, speed: 40, timestamp: new Date(Date.now() - 3600000) },
        { assetId: assets[0].id, latitude: -6.8000, longitude: 39.2200, speed: 45, timestamp: new Date(Date.now() - 1800000) },
        { assetId: assets[0].id, latitude: -6.8100, longitude: 39.2350, speed: 42, timestamp: new Date() },
      ]);
    }

    // Add sample routes and route points for map route layer demonstration
    const createdRoutes = await db.Route.bulkCreate([
      { name: 'Harbor Run', assetId: assets[0]?.id || null, status: 'active' },
      { name: 'Coastal Patrol', assetId: assets[1]?.id || null, status: 'planned' },
    ]);

    if (createdRoutes && createdRoutes.length) {
      const rp = [];
      // Harbor Run route points
      rp.push({ routeId: createdRoutes[0].id, latitude: -6.7924, longitude: 39.2083, sequence: 0 });
      rp.push({ routeId: createdRoutes[0].id, latitude: -6.8000, longitude: 39.2200, sequence: 1 });
      rp.push({ routeId: createdRoutes[0].id, latitude: -6.8100, longitude: 39.2350, sequence: 2 });
      // Coastal Patrol route points
      rp.push({ routeId: createdRoutes[1].id, latitude: -6.8200, longitude: 39.2500, sequence: 0 });
      rp.push({ routeId: createdRoutes[1].id, latitude: -6.8300, longitude: 39.2700, sequence: 1 });
      await db.RoutePoint.bulkCreate(rp);
    }

    // Add a few extra events to improve heatmap density
    await db.Event.bulkCreate([
      { eventType: 'Sensor Spike', title: 'Temp spike', severity: 'Low', status: 'Open', source: 'IoT', latitude: -6.7950, longitude: 39.2100, country: 'Tanzania', city: 'Dar es Salaam', startTime: new Date() },
      { eventType: 'Sensor Spike', title: 'Humidity spike', severity: 'Low', status: 'Open', source: 'IoT', latitude: -6.7990, longitude: 39.2150, country: 'Tanzania', city: 'Dar es Salaam', startTime: new Date() },
      { eventType: 'Sensor Spike', title: 'Vibration', severity: 'Medium', status: 'Open', source: 'IoT', latitude: -6.8030, longitude: 39.2180, country: 'Tanzania', city: 'Dar es Salaam', startTime: new Date() },
    ]);

    await seedRoutesAndHeatmap();

    console.log('Seed completed successfully');
    console.log('Login: admin@analytics.local / admin123');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
};

seed();

const seedRoutesAndHeatmap = async () => {
  const routeSeeds = [
    {
      name: 'Harbor Run',
      status: 'active',
      points: [
        { latitude: -6.7924, longitude: 39.2083 },
        { latitude: -6.8000, longitude: 39.2200 },
        { latitude: -6.8100, longitude: 39.2350 },
        { latitude: -6.8200, longitude: 39.2480 },
        { latitude: -6.8300, longitude: 39.2600 },
      ],
    },
    {
      name: 'Coastal Patrol',
      status: 'planned',
      points: [
        { latitude: -6.8200, longitude: 39.2500 },
        { latitude: -6.8300, longitude: 39.2700 },
        { latitude: -6.8400, longitude: 39.2900 },
        { latitude: -6.8550, longitude: 39.3050 },
      ],
    },
    {
      name: 'Airport Corridor',
      status: 'active',
      points: [
        { latitude: -6.7700, longitude: 39.2000 },
        { latitude: -6.7600, longitude: 39.2200 },
        { latitude: -6.7480, longitude: 39.2360 },
      ],
    },
  ];

  const existingRouteCount = await db.Route.count();
  if (existingRouteCount === 0) {
    const createdRoutes = await db.Route.bulkCreate(routeSeeds.map(({ name, status }) => ({ name, status })));
    const routePoints = createdRoutes.flatMap((route, idx) =>
      routeSeeds[idx].points.map((point, sequence) => ({
        routeId: route.id,
        latitude: point.latitude,
        longitude: point.longitude,
        sequence,
      }))
    );
    if (routePoints.length) await db.RoutePoint.bulkCreate(routePoints);
  }

  const eventCount = await db.Event.count();
  if (eventCount < 18) {
    const heatmapEvents = [
      { eventType: 'Sensor Spike', title: 'Urban sensor cluster A', severity: 'Low', status: 'Open', source: 'IoT', latitude: -6.7950, longitude: 39.2100, country: 'Tanzania', city: 'Dar es Salaam', startTime: new Date() },
      { eventType: 'Sensor Spike', title: 'Urban sensor cluster B', severity: 'Low', status: 'Open', source: 'IoT', latitude: -6.7990, longitude: 39.2150, country: 'Tanzania', city: 'Dar es Salaam', startTime: new Date() },
      { eventType: 'Sensor Spike', title: 'Urban sensor cluster C', severity: 'Medium', status: 'Open', source: 'IoT', latitude: -6.8030, longitude: 39.2180, country: 'Tanzania', city: 'Dar es Salaam', startTime: new Date() },
      { eventType: 'Sensor Spike', title: 'Harbor sensor cluster', severity: 'High', status: 'Open', source: 'IoT', latitude: -6.8150, longitude: 39.2430, country: 'Tanzania', city: 'Dar es Salaam', startTime: new Date() },
      { eventType: 'Sensor Spike', title: 'Port edge anomaly', severity: 'Medium', status: 'Investigating', source: 'IoT', latitude: -6.8220, longitude: 39.2550, country: 'Tanzania', city: 'Dar es Salaam', startTime: new Date() },
      { eventType: 'Sensor Spike', title: 'Logistics corridor', severity: 'Low', status: 'Open', source: 'IoT', latitude: -6.8380, longitude: 39.2800, country: 'Tanzania', city: 'Dar es Salaam', startTime: new Date() },
    ];
    await db.Event.bulkCreate(heatmapEvents);
  }
};
