const { success, error } = require('../utils/response');
const monitoringService = require('../services/monitoringService');

exports.getMetrics = async (req, res) => {
  try {
    const metrics = await monitoringService.getMetrics();
    return success(res, metrics);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.getJobs = async (req, res) => {
  try {
    const jobs = await monitoringService.getQueueMetrics();
    return success(res, { jobs, timestamp: new Date().toISOString() });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.getLogs = async (req, res) => {
  try {
    const logs = await monitoringService.getLogSummary();
    return success(res, logs);
  } catch (err) {
    return error(res, err.message, 500);
  }
};
