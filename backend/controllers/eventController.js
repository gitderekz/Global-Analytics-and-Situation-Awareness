const { Event, Alert } = require('../models');
const { success, error } = require('../utils/response');
const { buildWhere } = require('../services/analyticsService');
const { buildFeatureCollection } = require('../services/geojsonService');

let io = null;
exports.setIo = (socketIo) => { io = socketIo; };

exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 50, ...filters } = req.query;
    const where = buildWhere(filters);
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await Event.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']],
    });

    return success(res, { events: rows, total: count, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.getById = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id, {
      include: [{ model: Alert }],
    });
    if (!event) return error(res, 'Event not found', 404);
    return success(res, event);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.create = async (req, res) => {
  try {
    const event = await Event.create({ ...req.body, createdBy: req.user?.id });
    if (io) io.of('/events').emit('event:new', event);

    if (['High', 'Critical'].includes(event.severity)) {
      const alert = await Alert.create({
        eventId: event.id,
        title: `Alert: ${event.title}`,
        description: event.description,
        severity: event.severity,
      });
      if (io) io.of('/alerts').emit('alert:new', alert);
    }

    return success(res, event, 'Event created', 201);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.update = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) return error(res, 'Event not found', 404);
    await event.update(req.body);
    if (io) io.of('/events').emit('event:update', event);
    return success(res, event, 'Event updated');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.remove = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) return error(res, 'Event not found', 404);
    await event.destroy();
    if (io) io.of('/events').emit('event:delete', { id: parseInt(req.params.id) });
    return success(res, null, 'Event deleted');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.getGeoJSON = async (req, res) => {
  try {
    const where = buildWhere(req.query);
    const events = await Event.findAll({ where, limit: 10000 });
    return success(res, buildFeatureCollection(events, 'event'));
  } catch (err) {
    return error(res, err.message, 500);
  }
};
