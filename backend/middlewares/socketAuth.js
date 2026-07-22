const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const socketAuthMiddleware = (io) => {
  return (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication token required'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      socket.userId = decoded.id;
      socket.user = decoded;
      next();
    } catch (err) {
      logger.warn('Socket authentication failed', { error: err.message, socketId: socket.id });
      next(new Error('Invalid token'));
    }
  };
};

const socketNamespaceAuthMiddleware = (socket, allowedRoles = []) => {
  return (event, next) => {
    if (allowedRoles.length && (!socket.user || !allowedRoles.includes(socket.user.role))) {
      logger.warn('Unauthorized socket event', {
        event,
        userId: socket.userId,
        userRole: socket.user?.role,
        allowedRoles,
      });
      next(new Error(`Unauthorized event: ${event}`));
    } else {
      next();
    }
  };
};

module.exports = { socketAuthMiddleware, socketNamespaceAuthMiddleware };
