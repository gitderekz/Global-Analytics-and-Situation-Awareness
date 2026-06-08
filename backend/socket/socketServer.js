const logger = require('../utils/logger');

const setupSocket = (io) => {
  const namespaces = ['events', 'assets', 'devices', 'alerts'];

  namespaces.forEach((ns) => {
    io.of(`/${ns}`).on('connection', (socket) => {
      logger.info(`Socket connected to /${ns}`, { socketId: socket.id });

      socket.on('disconnect', () => {
        logger.info(`Socket disconnected from /${ns}`, { socketId: socket.id });
      });
    });
  });

  io.on('connection', (socket) => {
    logger.info('Socket connected to default namespace', { socketId: socket.id });
    socket.on('disconnect', () => {
      logger.info('Socket disconnected from default namespace', { socketId: socket.id });
    });
  });

  return io;
};

module.exports = { setupSocket };
