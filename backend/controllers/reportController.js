const path = require('path');
const exportService = require('../services/exportService');
const taskQueueService = require('../services/taskQueueService');
const { Report } = require('../models');
const { success, error } = require('../utils/response');

exports.generate = async (req, res) => {
  try {
    const { type, format = 'csv' } = req.params;
    const formatted = format.toLowerCase();
    const generators = {
      csv: exportService.generateCSV,
      excel: exportService.generateExcel,
      pdf: exportService.generatePDF,
      xlsx: exportService.generateExcel,
    };
    const gen = generators[formatted];
    if (!gen) return error(res, `Unsupported format: ${format}`, 400);

    const queuedResult = await taskQueueService.enqueueReportJob(type, formatted, req.user.id);
    if (queuedResult.queued) {
      return success(res, {
        queued: true,
        jobId: queuedResult.jobId,
        statusUrl: `/api/v1/reports/jobs/${queuedResult.jobId}`,
      }, 'Report generation queued');
    }

    const result = await gen(type, req.user.id);
    return success(res, {
      queued: false,
      fileName: result.fileName,
      downloadUrl: `/api/v1/reports/download/${result.fileName}`,
    }, 'Report generated');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.getJobStatus = async (req, res) => {
  try {
    const { jobId } = req.params;
    const status = await taskQueueService.getJobStatus(jobId);
    return success(res, status);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.download = async (req, res) => {
  try {
    const filePath = path.join(exportService.exportsDir, req.params.fileName);
    if (!filePath.startsWith(exportService.exportsDir)) {
      return error(res, 'Invalid file', 400);
    }
    return res.download(filePath);
  } catch (err) {
    return error(res, 'File not found', 404);
  }
};

exports.list = async (req, res) => {
  try {
    const reports = await Report.findAll({
      order: [['generatedAt', 'DESC']],
      limit: 50,
    });
    return success(res, reports);
  } catch (err) {
    return error(res, err.message, 500);
  }
};
