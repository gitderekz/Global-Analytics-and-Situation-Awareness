const { Op } = require('sequelize');
const { Event, Asset, Device, Alert, Threat, Transaction } = require('../models');

const buildWhere = (filters = {}) => {
  const where = {};
  if (filters.severity) where.severity = filters.severity;
  if (filters.status) where.status = filters.status;
  if (filters.eventType) where.eventType = filters.eventType;
  if (filters.country) where.country = filters.country;
  if (filters.region) where.region = filters.region;
  if (filters.city) where.city = filters.city;
  if (filters.startDate || filters.endDate) {
    where.createdAt = {};
    if (filters.startDate) where.createdAt[Op.gte] = new Date(filters.startDate);
    if (filters.endDate) where.createdAt[Op.lte] = new Date(filters.endDate);
  }
  return where;
};

const getDashboardKPIs = async (filters = {}) => {
  const eventWhere = buildWhere(filters);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    totalEvents,
    eventsToday,
    activeAssets,
    connectedDevices,
    criticalAlerts,
    openAlerts,
    threatCount,
    countriesActive,
  ] = await Promise.all([
    Event.count({ where: eventWhere }),
    Event.count({ where: { ...eventWhere, createdAt: { [Op.gte]: today } } }),
    Asset.count({ where: { status: 'active' } }),
    Device.count({ where: { status: 'online' } }),
    Alert.count({ where: { severity: 'Critical', status: { [Op.ne]: 'Resolved' } } }),
    Alert.count({ where: { status: { [Op.in]: ['New', 'Acknowledged', 'In Progress'] } } }),
    Threat.count({ where: { status: 'active' } }),
    Event.count({ distinct: true, col: 'country', where: { country: { [Op.ne]: null } } }),
  ]);

  return {
    totalEvents,
    eventsToday,
    activeAssets,
    connectedDevices,
    criticalAlerts,
    openAlerts,
    threatCount,
    countriesActive,
    networkStatus: connectedDevices > 0 ? 'healthy' : 'degraded',
    lastUpdate: new Date().toISOString(),
  };
};

const getSeverityDistribution = async (filters = {}) => {
  const severities = ['Info', 'Low', 'Medium', 'High', 'Critical'];
  const where = buildWhere(filters);
  const results = await Promise.all(
    severities.map(async (severity) => ({
      severity,
      count: await Event.count({ where: { ...where, severity } }),
    }))
  );
  return results;
};

const getEventTypeDistribution = async (filters = {}) => {
  const events = await Event.findAll({
    where: buildWhere(filters),
    attributes: ['eventType'],
    raw: true,
  });
  const counts = {};
  events.forEach((e) => {
    counts[e.eventType] = (counts[e.eventType] || 0) + 1;
  });
  return Object.entries(counts).map(([eventType, count]) => ({ eventType, count }));
};

const getThreatAnalytics = async () => {
  const threats = await Threat.findAll({ include: [{ model: Event }] });
  const byType = {};
  const byCountry = {};
  threats.forEach((t) => {
    byType[t.threatType] = (byType[t.threatType] || 0) + 1;
    if (t.country) byCountry[t.country] = (byCountry[t.country] || 0) + 1;
  });
  return {
    total: threats.length,
    byType: Object.entries(byType).map(([threatType, count]) => ({ threatType, count })),
    byCountry: Object.entries(byCountry).map(([country, count]) => ({ country, count })),
  };
};

const getFraudAnalytics = async () => {
  const transactions = await Transaction.findAll();
  const byRisk = {};
  transactions.forEach((t) => {
    byRisk[t.riskLevel] = (byRisk[t.riskLevel] || 0) + 1;
  });
  return {
    total: transactions.length,
    flagged: transactions.filter((t) => t.status === 'flagged').length,
    byRisk: Object.entries(byRisk).map(([riskLevel, count]) => ({ riskLevel, count })),
  };
};

const getTimeSeries = async (days = 7) => {
  const start = new Date();
  start.setDate(start.getDate() - days);
  const events = await Event.findAll({
    where: { createdAt: { [Op.gte]: start } },
    attributes: ['createdAt'],
    raw: true,
  });
  const series = {};
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    series[key] = 0;
  }
  events.forEach((e) => {
    const key = new Date(e.createdAt).toISOString().split('T')[0];
    if (series[key] !== undefined) series[key]++;
  });
  return Object.entries(series)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
};

module.exports = {
  buildWhere,
  getDashboardKPIs,
  getSeverityDistribution,
  getEventTypeDistribution,
  getThreatAnalytics,
  getFraudAnalytics,
  getTimeSeries,
};
