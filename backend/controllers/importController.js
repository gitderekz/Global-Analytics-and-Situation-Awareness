const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { Event, Asset, Device, Alert, Threat, Transaction, User, Notification, Geofence, GeofencePoint, Route, RoutePoint } = require('../models');
const { success, error } = require('../utils/response');

const uploadDir = path.join(__dirname, '..', 'uploads', 'imports');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

exports.uploadMiddleware = multer({ storage }).single('file');

const parseCSV = (buffer) => {
  const text = buffer.toString('utf8').trim();
  const lines = text.split(/\r?\n/).filter(Boolean);
  const headers = lines[0].split(',').map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const values = line.split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
    return headers.reduce((obj, header, idx) => ({ ...obj, [header]: values[idx] ?? '' }), {});
  });
};

const parseGeoJSON = (buffer) => {
  try {
    return JSON.parse(buffer.toString('utf8'));
  } catch (err) {
    throw new Error('Invalid GeoJSON payload');
  }
};

const parsePointsField = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return [];
    try {
      const json = JSON.parse(trimmed);
      if (Array.isArray(json)) return json;
    } catch (err) {
      // ignore parse failure and try semicolon format
    }
    return trimmed.split(';').map((pair) => {
      const [lat, lng] = pair.split(',').map((s) => s.trim());
      return { latitude: parseFloat(lat), longitude: parseFloat(lng) };
    }).filter((p) => Number.isFinite(p.latitude) && Number.isFinite(p.longitude));
  }
  return [];
};

const buildPointArrayFromGeoJSON = (feature) => {
  if (!feature?.geometry) return [];
  const { type, coordinates } = feature.geometry;
  if (type === 'Polygon' && Array.isArray(coordinates[0])) {
    return coordinates[0].map(([lng, lat]) => ({ latitude: parseFloat(lat), longitude: parseFloat(lng) }));
  }
  if (type === 'MultiPolygon' && Array.isArray(coordinates[0]?.[0])) {
    return coordinates[0][0].map(([lng, lat]) => ({ latitude: parseFloat(lat), longitude: parseFloat(lng) }));
  }
  if (type === 'LineString' && Array.isArray(coordinates)) {
    return coordinates.map(([lng, lat]) => ({ latitude: parseFloat(lat), longitude: parseFloat(lng) }));
  }
  if (type === 'MultiLineString' && Array.isArray(coordinates[0])) {
    return coordinates[0].map(([lng, lat]) => ({ latitude: parseFloat(lat), longitude: parseFloat(lng) }));
  }
  return [];
};

const coerceBoolean = (input) => {
  const value = String(input ?? '').toLowerCase();
  return ['true', '1', 'yes', 'on'].includes(value);
};

const importGeofences = async (items) => {
  const created = [];
  for (const row of items) {
    const points = parsePointsField(row.points || row.coordinates || row.geometry || row.coords);
    const geofence = await Geofence.create({
      name: row.name || `Geofence ${Date.now()}`,
      type: row.type || 'Polygon',
      description: row.description || row.title || '',
      active: row.active !== undefined ? coerceBoolean(row.active) : true,
    });
    if (points.length) {
      const payload = points.map((point, index) => ({
        geofenceId: geofence.id,
        latitude: point.latitude,
        longitude: point.longitude,
        sequence: index + 1,
      }));
      await GeofencePoint.bulkCreate(payload);
    }
    created.push(geofence);
  }
  return created;
};

const importRoutes = async (items) => {
  const created = [];
  for (const row of items) {
    const points = parsePointsField(row.points || row.coordinates || row.geometry || row.coords);
    const route = await Route.create({
      name: row.name || `Route ${Date.now()}`,
      assetId: row.assetId ? parseInt(row.assetId, 10) : null,
      status: row.status || 'active',
    });
    if (points.length) {
      const payload = points.map((point, index) => ({
        routeId: route.id,
        latitude: point.latitude,
        longitude: point.longitude,
        sequence: index + 1,
      }));
      await RoutePoint.bulkCreate(payload);
    }
    created.push(route);
  }
  return created;
};

const modelMap = {
  events: Event,
  assets: Asset,
  devices: Device,
  alerts: Alert,
  threats: Threat,
  transactions: Transaction,
  users: User,
  notifications: Notification,
};

exports.importData = async (req, res) => {
  try {
    const type = req.params.type;
    if (!req.file) return error(res, 'File upload required', 400);

    const buffer = fs.readFileSync(req.file.path);
    const ext = path.extname(req.file.originalname).toLowerCase();
    let rows = [];

    if (ext === '.csv' || ext === '.tsv') {
      rows = parseCSV(buffer);
    } else if (ext === '.json' || ext === '.geojson') {
      const payload = parseGeoJSON(buffer);
      if (type === 'geofences' || type === 'routes') {
        const features = Array.isArray(payload)
          ? payload
          : payload.features || [];
        rows = features.map((feature) => ({
          ...(feature.properties || {}),
          points: buildPointArrayFromGeoJSON(feature),
        }));
      } else {
        rows = Array.isArray(payload)
          ? payload
          : payload.features?.map((feature) => feature.properties) || [];
      }
    } else {
      return error(res, 'Unsupported file format. Use CSV or GeoJSON.', 400);
    }

    let created = [];
    if (type === 'geofences') {
      created = await importGeofences(rows);
    } else if (type === 'routes') {
      created = await importRoutes(rows);
    } else {
      const model = modelMap[type];
      if (!model) return error(res, `Import type not supported: ${type}`, 400);
      created = await Promise.all(rows.map((row) => model.create(row)));
    }

    return success(res, { imported: created.length, type, file: req.file.filename });
  } catch (err) {
    return error(res, err.message, 500);
  }
};
