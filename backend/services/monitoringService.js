const os = require('os');
const fs = require('fs');
const path = require('path');
const db = require('../models');
const jobQueueService = require('./jobQueue');

const logsDir = path.join(__dirname, '..', 'logs');
const exportsDir = path.join(__dirname, '..', 'uploads', 'exports');

const readLastLines = (filePath, maxLines = 20) => {
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf8').trim();
  if (!content) return [];
  const lines = content.split('\n');
  return lines.slice(-maxLines);
};

const getDbPoolStats = () => {
  const pool = db.sequelize.connectionManager?.pool || {};
  return {
    max: db.sequelize.options?.pool?.max || null,
    min: db.sequelize.options?.pool?.min || null,
    acquire: db.sequelize.options?.pool?.acquire || null,
    idle: db.sequelize.options?.pool?.idle || null,
    borrowed: pool.borrowed || null,
    available: pool.available || null,
    pending: pool.pending || null,
    size: pool.size || null,
  };
};

exports.getMetrics = async () => {
  const counts = {
    users: await db.User.count(),
    events: await db.Event.count(),
    assets: await db.Asset.count(),
    devices: await db.Device.count(),
    alerts: await db.Alert.count(),
    geofences: await db.Geofence.count(),
    reports: await db.Report.count(),
  };

  const latestReport = await db.Report.findOne({ order: [['generatedAt', 'DESC']] });

  return {
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    loadAverage: os.loadavg(),
    platform: os.platform(),
    cpuCount: os.cpus().length,
    nodeVersion: process.version,
    counts,
    db: getDbPoolStats(),
    exports: {
      path: exportsDir,
      latestExport: latestReport ? latestReport.filePath.split('/').pop() : null,
      latestExportAt: latestReport ? latestReport.generatedAt : null,
    },
    timestamp: new Date().toISOString(),
  };
};

exports.getQueueMetrics = async () => jobQueueService.getJobs();

exports.getLogSummary = async () => ({
  logs: {
    info: readLastLines(path.join(logsDir, 'info.log'), 15),
    warn: readLastLines(path.join(logsDir, 'warn.log'), 15),
    error: readLastLines(path.join(logsDir, 'error.log'), 15),
  },
});
