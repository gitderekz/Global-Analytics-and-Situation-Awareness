const queue = require('bull');
const logger = require('../utils/logger');
const exportService = require('./exportService');

let jobQueueEnabled = false;
let reportQueue = null;

const initializeJobQueue = async (redisUrl) => {
  try {
    reportQueue = queue('reports', redisUrl || process.env.REDIS_URL || 'redis://localhost:6379');

    reportQueue.process(async (job) => {
      logger.info('Processing report job', { jobId: job.id, type: job.data.type });
      try {
        const { type, format, userId } = job.data;
        let result;

        job.progress(10);

        if (format === 'pdf') {
          result = await exportService.generatePDF(type, userId);
        } else if (format === 'excel' || format === 'xlsx') {
          result = await exportService.generateExcel(type, userId);
        } else if (format === 'csv') {
          result = await exportService.generateCSV(type, userId);
        } else {
          result = await exportService.generateJSON(type);
        }

        job.progress(100);
        logger.info('Report job completed', { jobId: job.id, fileName: result.fileName });
        return result;
      } catch (err) {
        logger.error('Report job failed', { jobId: job.id, error: err.message });
        throw err;
      }
    });

    reportQueue.on('completed', (job) => {
      logger.info('Report job completed successfully', { jobId: job.id });
    });

    reportQueue.on('failed', (job, err) => {
      logger.error('Report job failed', { jobId: job.id, error: err.message });
    });

    reportQueue.on('progress', (job, progress) => {
      logger.info('Report job progress', { jobId: job.id, progress });
    });

    jobQueueEnabled = true;
    logger.info('Job queue initialized successfully');
    return reportQueue;
  } catch (err) {
    logger.warn('Job queue initialization failed (Redis may not be available)', { error: err.message });
    jobQueueEnabled = false;
    return null;
  }
};

const enqueueReportJob = async (type, format, userId) => {
  if (!jobQueueEnabled || !reportQueue) {
    logger.warn('Job queue not available, processing synchronously');
    return { queued: false, message: 'Job queue unavailable, processing synchronously' };
  }

  try {
    const job = await reportQueue.add(
      { type, format, userId },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: true,
        timeout: 300000,
      }
    );

    logger.info('Report job enqueued', { jobId: job.id, type, format, userId });
    return { queued: true, jobId: job.id };
  } catch (err) {
    logger.error('Failed to enqueue report job', { error: err.message });
    return { queued: false, error: err.message };
  }
};

const getJobStatus = async (jobId) => {
  if (!jobQueueEnabled || !reportQueue) {
    return { status: 'unavailable', message: 'Job queue not available' };
  }

  try {
    const job = await reportQueue.getJob(jobId);
    if (!job) {
      return { status: 'not_found', jobId };
    }

    const state = await job.getState();
    const progress = job._progress;

    return {
      jobId,
      status: state,
      progress,
      data: job.data,
      result: job.returnvalue,
    };
  } catch (err) {
    logger.error('Failed to get job status', { error: err.message, jobId });
    return { status: 'error', error: err.message };
  }
};

const getQueueStatus = async () => {
  if (!jobQueueEnabled || !reportQueue) {
    return { enabled: false, message: 'Job queue not available' };
  }

  try {
    const counts = await reportQueue.getJobCounts();
    const repeatableJobs = await reportQueue.getRepeatableJobs();
    return {
      enabled: true,
      counts,
      repeatableJobs: repeatableJobs.map((job) => ({
        key: job.key,
        name: job.name,
        cron: job.cron,
        next: job.next, 
      })),
    };
  } catch (err) {
    logger.error('Failed to get queue status', { error: err.message });
    return { enabled: false, error: err.message };
  }
};

const closeQueue = async () => {
  if (reportQueue) {
    await reportQueue.close();
  }
};

module.exports = {
  initializeJobQueue,
  enqueueReportJob,
  getJobStatus,
  getQueueStatus,
  closeQueue,
  isJobQueueEnabled: () => jobQueueEnabled,
};
