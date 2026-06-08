const { success, error } = require('../utils/response');
const analyticsService = require('../services/analyticsService');
const geospatialService = require('../services/geospatialService');
const { Event, Asset, Device } = require('../models');
const { buildFeatureCollection } = require('../services/geojsonService');

exports.getKPIs = async (req, res) => {
  try {
    const kpis = await analyticsService.getDashboardKPIs(req.query);
    return success(res, kpis);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.getSeverityDistribution = async (req, res) => {
  try {
    const data = await analyticsService.getSeverityDistribution(req.query);
    return success(res, data);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.getEventTypes = async (req, res) => {
  try {
    const data = await analyticsService.getEventTypeDistribution(req.query);
    return success(res, data);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.getThreatAnalytics = async (req, res) => {
  try {
    const data = await analyticsService.getThreatAnalytics();
    return success(res, data);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.getFraudAnalytics = async (req, res) => {
  try {
    const data = await analyticsService.getFraudAnalytics();
    return success(res, data);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.getTimeSeries = async (req, res) => {
  try {
    const days = parseInt(req.query.days || '7');
    const data = await analyticsService.getTimeSeries(days);
    return success(res, data);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.search = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return error(res, 'Search query required', 400);
    const results = await geospatialService.globalSearch(q);
    return success(res, results);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.getMapData = async (req, res) => {
  try {
    const where = analyticsService.buildWhere(req.query);
    const [events, assets, devices] = await Promise.all([
      Event.findAll({ where, limit: 5000 }),
      Asset.findAll({ limit: 5000 }),
      Device.findAll({ limit: 5000 }),
    ]);

    return success(res, {
      events: buildFeatureCollection(events, 'event'),
      assets: buildFeatureCollection(assets, 'asset'),
      devices: buildFeatureCollection(devices, 'device'),
    });
  } catch (err) {
    return error(res, err.message, 500);
  }
};
