jest.mock('../models', () => ({
  User: { count: jest.fn().mockResolvedValue(2) },
  Event: { count: jest.fn().mockResolvedValue(3) },
  Asset: { count: jest.fn().mockResolvedValue(4) },
  Device: { count: jest.fn().mockResolvedValue(5) },
  Alert: { count: jest.fn().mockResolvedValue(6) },
  Geofence: { count: jest.fn().mockResolvedValue(7) },
  Report: { count: jest.fn().mockResolvedValue(1), findOne: jest.fn().mockResolvedValue(null) },
  sequelize: { connectionManager: { pool: {} }, options: { pool: {} } },
}));

jest.mock('../services/jobQueue', () => ({
  getJobs: jest.fn().mockResolvedValue({ scheduled: [], queueStatus: { waiting: 0, active: 0, completed: 0, failed: 0 } }),
}));

const monitoringService = require('../services/monitoringService');

describe('Monitoring Service', () => {
  it('should expose metrics and queue status objects', async () => {
    const metrics = await monitoringService.getMetrics();
    expect(metrics).toHaveProperty('uptime');
    expect(metrics).toHaveProperty('counts');
    expect(metrics.counts).toHaveProperty('users');
    expect(metrics.counts.users).toBe(2);

    const queueMetrics = await monitoringService.getQueueMetrics();
    expect(queueMetrics).toHaveProperty('scheduled');
    expect(queueMetrics).toHaveProperty('queueStatus');
    expect(queueMetrics.queueStatus).toHaveProperty('waiting');
  }, 20000);
});