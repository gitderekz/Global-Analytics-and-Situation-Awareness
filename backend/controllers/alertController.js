const { Alert, Event } = require('../models');
const { success, error } = require('../utils/response');

let io = null;
exports.setIo = (socketIo) => { io = socketIo; };

exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 50, status, severity } = req.query;
    const where = {};
    if (status) where.status = status;
    if (severity) where.severity = severity;

    const { count, rows } = await Alert.findAndCountAll({
      where,
      include: [{ model: Event }],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['createdAt', 'DESC']],
    });

    return success(res, { alerts: rows, total: count });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.acknowledge = async (req, res) => {
  try {
    const alert = await Alert.findByPk(req.params.id);
    if (!alert) return error(res, 'Alert not found', 404);

    await alert.update({
      status: 'Acknowledged',
      acknowledgedBy: req.user.id,
      acknowledgedAt: new Date(),
    });

    if (io) io.of('/alerts').emit('alert:update', alert);
    return success(res, alert, 'Alert acknowledged');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.resolve = async (req, res) => {
  try {
    const alert = await Alert.findByPk(req.params.id);
    if (!alert) return error(res, 'Alert not found', 404);
    await alert.update({ status: 'Resolved' });
    if (io) io.of('/alerts').emit('alert:update', alert);
    return success(res, alert, 'Alert resolved');
  } catch (err) {
    return error(res, err.message, 500);
  }
};
