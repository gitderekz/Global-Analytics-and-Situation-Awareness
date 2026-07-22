const express = require('express');
const request = require('supertest');

jest.mock('../middlewares/auth', () => ({
  authenticate: jest.fn((req, res, next) => next()),
  authorize: jest.fn(() => (req, res, next) => next()),
}));

jest.mock('../services/monitoringService', () => ({
  getMetrics: jest.fn().mockResolvedValue({
    uptime: 42,
    counts: { users: 10, events: 5 },
    timestamp: new Date().toISOString(),
  }),
  getQueueMetrics: jest.fn().mockResolvedValue({
    scheduled: [],
    queueStatus: { enabled: true, counts: { waiting: 0, active: 0, completed: 0, failed: 0 } },
  }),
  getLogSummary: jest.fn().mockResolvedValue({
    logs: { info: ['ok'], warn: [], error: [] },
  }),
}));

const metricsRouter = require('../routes/metrics');

describe('Metrics routes', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/metrics', metricsRouter);
  });

  it('should return metrics payload', async () => {
    const response = await request(app).get('/metrics');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('uptime');
    expect(response.body.data.counts.users).toBe(10);
  });

  it('should return queue job details', async () => {
    const response = await request(app).get('/metrics/jobs');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.jobs.queueStatus.enabled).toBe(true);
  });

  it('should return log summary', async () => {
    const response = await request(app).get('/metrics/logs');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.logs.info).toContain('ok');
  });
});
