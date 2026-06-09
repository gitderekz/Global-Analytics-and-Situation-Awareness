const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const setupSocket = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
    if (!token) return next(new Error('Authentication required'));
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  const namespaces = ['events', 'assets', 'devices', 'alerts'];

  namespaces.forEach((ns) => {
    io.of(`/${ns}`).on('connection', (socket) => {
      logger.info(`Socket connected to /${ns}`, { socketId: socket.id, userId: socket.userId });

      socket.on('disconnect', () => {
        logger.info(`Socket disconnected from /${ns}`, { socketId: socket.id });
      });
    });
  });

  io.on('connection', (socket) => {
    logger.info('Socket connected to default namespace', { socketId: socket.id, userId: socket.userId });
    socket.on('disconnect', () => {
      logger.info('Socket disconnected from default namespace', { socketId: socket.id });
    });
  });

  return io;
};

module.exports = { setupSocket };
