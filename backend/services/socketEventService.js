const db = require('../models');
const logger = require('../utils/logger');

const persistSocketEvent = async (userId, eventType, namespace, data, ipAddress, userAgent) => {
  try {
    await db.SocketEvent.create({
      userId,
      eventType,
      namespace,
      data,
      ipAddress,
      userAgent,
      status: 'pending',
    });
  } catch (err) {
    logger.error('Failed to persist socket event', {
      eventType,
      error: err.message,
    });
  }
};

const updateSocketEventStatus = async (eventId, status, errorMessage = null) => {
  try {
    await db.SocketEvent.update({ status, errorMessage }, { where: { id: eventId } });
  } catch (err) {
    logger.error('Failed to update socket event status', { error: err.message });
  }
};

const getSocketEventsByUser = async (userId, limit = 100) => {
  try {
    return await db.SocketEvent.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit,
    });
  } catch (err) {
    logger.error('Failed to fetch socket events', { error: err.message });
    return [];
  }
};

module.exports = {
  persistSocketEvent,
  updateSocketEventStatus,
  getSocketEventsByUser,
};
