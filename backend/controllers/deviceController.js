const { Device } = require('../models');
const { success, error } = require('../utils/response');
const { buildFeatureCollection } = require('../services/geojsonService');

let io = null;
exports.setIo = (socketIo) => { io = socketIo; };

exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 50, status, deviceType } = req.query;
    const where = {};
    if (status) where.status = status;
    if (deviceType) where.deviceType = deviceType;

    const { count, rows } = await Device.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['lastSeen', 'DESC']],
    });

    return success(res, { devices: rows, total: count });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.getById = async (req, res) => {
  try {
    const device = await Device.findByPk(req.params.id);
    if (!device) return error(res, 'Device not found', 404);
    return success(res, device);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.create = async (req, res) => {
  try {
    const device = await Device.create({ ...req.body, lastSeen: new Date() });
    if (io) io.of('/devices').emit('device:update', device);
    return success(res, device, 'Device created', 201);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.update = async (req, res) => {
  try {
    const device = await Device.findByPk(req.params.id);
    if (!device) return error(res, 'Device not found', 404);
    await device.update({ ...req.body, lastSeen: new Date() });
    if (io) io.of('/devices').emit('device:update', device);
    return success(res, device, 'Device updated');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.remove = async (req, res) => {
  try {
    const device = await Device.findByPk(req.params.id);
    if (!device) return error(res, 'Device not found', 404);
    await device.destroy();
    return success(res, null, 'Device deleted');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.getGeoJSON = async (req, res) => {
  try {
    const devices = await Device.findAll({ limit: 10000 });
    return success(res, buildFeatureCollection(devices, 'device'));
  } catch (err) {
    return error(res, err.message, 500);
  }
};
