const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const { persistSocketEvent } = require('../services/socketEventService');

const setupSocket = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
    if (!token) return next(new Error('Authentication required'));
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      socket.userRole = decoded.role || 'Viewer';
      socket.userEmail = decoded.email;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  const namespaceRoles = {
    events: ['Super Admin', 'Admin', 'Operator', 'Analyst'],
    assets: ['Super Admin', 'Admin', 'Operator'],
    devices: ['Super Admin', 'Admin', 'Operator'],
    alerts: ['Super Admin', 'Admin', 'Operator', 'Analyst'],
  };

  const namespaces = Object.keys(namespaceRoles);

  namespaces.forEach((ns) => {
    io.of(`/${ns}`).use((socket, next) => {
      const allowed = namespaceRoles[ns].includes(socket.userRole);
      if (!allowed) {
        logger.warn(`Unauthorized socket access to /${ns}`, {
          socketId: socket.id,
          userId: socket.userId,
          role: socket.userRole,
        });
        return next(new Error('Insufficient socket permissions'));
      }
      next();
    }).on('connection', (socket) => {
      logger.info(`Socket connected to /${ns}`, { socketId: socket.id, userId: socket.userId, role: socket.userRole });

      // Persist all events from this namespace
      socket.on('*', async (data) => {
        const eventType = data.args?.[0] || 'unknown';
        const eventData = data.args?.[1] || null;
        const ipAddress = socket.handshake.address;
        const userAgent = socket.handshake.headers['user-agent'];

        await persistSocketEvent(
          socket.userId,
          eventType,
          `/${ns}`,
          eventData,
          ipAddress,
          userAgent
        );
      });

      socket.on('disconnect', () => {
        logger.info(`Socket disconnected from /${ns}`, { socketId: socket.id });
      });
    });
  });

  io.on('connection', (socket) => {
    logger.info('Socket connected to default namespace', { socketId: socket.id, userId: socket.userId });

    // Persist events on default namespace
    socket.on('*', async (data) => {
      const eventType = data.args?.[0] || 'unknown';
      const eventData = data.args?.[1] || null;
      const ipAddress = socket.handshake.address;
      const userAgent = socket.handshake.headers['user-agent'];

      await persistSocketEvent(
        socket.userId,
        eventType,
        '/',
        eventData,
        ipAddress,
        userAgent
      );
    });

    socket.on('disconnect', () => {
      logger.info('Socket disconnected from default namespace', { socketId: socket.id });
    });
  });

  return io;
};

module.exports = { setupSocket };
