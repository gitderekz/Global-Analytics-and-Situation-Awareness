const cron = require('node-cron');
const exportService = require('./exportService');
const taskQueueService = require('./taskQueueService');
const logger = require('../utils/logger');

let scheduledJobs = [];

exports.initJobs = async () => {
  await taskQueueService.initializeJobQueue(process.env.REDIS_URL);

  const dailyReport = cron.schedule('0 3 * * *', async () => {
    logger.info('Scheduled daily report triggered');
    try {
      if (taskQueueService.isJobQueueEnabled()) {
        const result = await taskQueueService.enqueueReportJob('events', 'csv', 0);
        if (result.queued) {
          logger.info('Daily report job queued', { jobId: result.jobId });
        } else {
          logger.warn('Daily report queue failed, falling back to direct export', { message: result.message || result.error });
          await exportService.generateCSV('events', 0);
        }
      } else {
        await exportService.generateCSV('events', 0);
      }

      logger.info('Daily events CSV export completed');
    } catch (err) {
      logger.error('Daily report job failed', { error: err.message });
    }
  }, { scheduled: true, timezone: 'UTC' });

  dailyReport.name = 'Daily events CSV export';
  scheduledJobs = [dailyReport];
  logger.info('Job scheduler initialized', { jobs: scheduledJobs.length, queueEnabled: taskQueueService.isJobQueueEnabled() });
};

exports.getJobs = async () => {
  const scheduled = scheduledJobs.map((job) => ({
    name: job.name || 'scheduled job',
    running: typeof job.getStatus === 'function' ? job.getStatus() : true,
  }));
  const queueStatus = await taskQueueService.getQueueStatus();
  return { scheduled, queueStatus };
};
