const severityColor = {
  Info: '#3b82f6',
  Low: '#22c55e',
  Medium: '#eab308',
  High: '#f97316',
  Critical: '#ef4444',
};

const statusColor = {
  active: '#22c55e',
  online: '#22c55e',
  inactive: '#6b7280',
  offline: '#6b7280',
  maintenance: '#eab308',
  error: '#ef4444',
};

const toFeature = (item, type) => {
  const lat = parseFloat(item.latitude);
  const lng = parseFloat(item.longitude);
  if (isNaN(lat) || isNaN(lng)) return null;

  return {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [lng, lat] },
    properties: {
      id: item.id,
      type,
      name: item.title || item.name || item.deviceId,
      status: item.status,
      severity: item.severity,
      eventType: item.eventType,
      assetType: item.assetType,
      deviceType: item.deviceType,
      color: severityColor[item.severity] || statusColor[item.status] || '#3b82f6',
      metadata: item.metadata || {},
      timestamp: item.createdAt || item.lastSeen || item.timestamp,
    },
  };
};

const buildFeatureCollection = (items, type) => ({
  type: 'FeatureCollection',
  features: items.map((item) => toFeature(item, type)).filter(Boolean),
});

const buildLineString = (points, properties = {}) => ({
  type: 'Feature',
  geometry: {
    type: 'LineString',
    coordinates: points.map((p) => [parseFloat(p.longitude), parseFloat(p.latitude)]),
  },
  properties,
});

const buildPolygon = (points, properties = {}) => ({
  type: 'Feature',
  geometry: {
    type: 'Polygon',
    coordinates: [[...points.map((p) => [parseFloat(p.longitude), parseFloat(p.latitude)]), [parseFloat(points[0].longitude), parseFloat(points[0].latitude)]]],
  },
  properties,
});

module.exports = {
  toFeature,
  buildFeatureCollection,
  buildLineString,
  buildPolygon,
  severityColor,
  statusColor,
};
