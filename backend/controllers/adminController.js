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
        { key: 'password', label: 'Password', type: 'password' },
        { key: 'roleId', label: 'Role ID', type: 'number', required: true },
        { key: 'status', label: 'Status', type: 'select', options: ['active', 'inactive', 'suspended'] },
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
