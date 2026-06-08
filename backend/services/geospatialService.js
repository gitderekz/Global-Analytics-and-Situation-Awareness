const { Op } = require('sequelize');
const { Event, Asset, Device, Country, Region, City } = require('../models');

const toRad = (deg) => (deg * Math.PI) / 180;

const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const boundingBoxSearch = async (model, { minLat, maxLat, minLng, maxLng, ...filters }) => {
  const where = {
    latitude: { [Op.between]: [minLat, maxLat] },
    longitude: { [Op.between]: [minLng, maxLng] },
    ...filters,
  };
  return model.findAll({ where, limit: 5000 });
};

const nearbySearch = async (model, lat, lng, radiusKm = 50) => {
  const latDelta = radiusKm / 111;
  const lngDelta = radiusKm / (111 * Math.cos(toRad(lat)));
  const items = await boundingBoxSearch(model, {
    minLat: lat - latDelta,
    maxLat: lat + latDelta,
    minLng: lng - lngDelta,
    maxLng: lng + lngDelta,
  });
  return items.filter((item) => {
    const dist = haversineDistance(lat, lng, parseFloat(item.latitude), parseFloat(item.longitude));
    return dist <= radiusKm;
  });
};

const globalSearch = async (query) => {
  const like = { [Op.like]: `%${query}%` };
  const [events, assets, devices, countries, regions, cities] = await Promise.all([
    Event.findAll({ where: { [Op.or]: [{ title: like }, { eventType: like }, { country: like }] }, limit: 10 }),
    Asset.findAll({ where: { [Op.or]: [{ name: like }, { assetType: like }] }, limit: 10 }),
    Device.findAll({ where: { [Op.or]: [{ name: like }, { deviceId: like }] }, limit: 10 }),
    Country.findAll({ where: { name: like }, limit: 10 }),
    Region.findAll({ where: { name: like }, limit: 10 }),
    City.findAll({ where: { name: like }, limit: 10 }),
  ]);

  return [
    ...events.map((e) => ({ type: 'event', id: e.id, name: e.title, lat: e.latitude, lng: e.longitude })),
    ...assets.map((a) => ({ type: 'asset', id: a.id, name: a.name, lat: a.latitude, lng: a.longitude })),
    ...devices.map((d) => ({ type: 'device', id: d.id, name: d.name || d.deviceId, lat: d.latitude, lng: d.longitude })),
    ...countries.map((c) => ({ type: 'country', id: c.id, name: c.name, lat: c.latitude, lng: c.longitude })),
    ...regions.map((r) => ({ type: 'region', id: r.id, name: r.name, lat: r.latitude, lng: r.longitude })),
    ...cities.map((c) => ({ type: 'city', id: c.id, name: c.name, lat: c.latitude, lng: c.longitude })),
  ];
};

module.exports = {
  haversineDistance,
  boundingBoxSearch,
  nearbySearch,
  globalSearch,
};
