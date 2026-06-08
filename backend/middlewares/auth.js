const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');
const { error } = require('../utils/response');

const authenticate = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return error(res, 'Authentication required', 401);
    }

    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id, {
      include: [{ model: Role, attributes: ['id', 'name'] }],
      attributes: { exclude: ['password'] },
    });

    if (!user || user.status !== 'active') {
      return error(res, 'Invalid or inactive user', 401);
    }

    req.user = user;
    next();
  } catch (err) {
    return error(res, 'Invalid or expired token', 401);
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!req.user) {
    return error(res, 'Authentication required', 401);
  }
  if (roles.length && !roles.includes(req.user.Role?.name)) {
    return error(res, 'Insufficient permissions', 403);
  }
  next();
};

module.exports = { authenticate, authorize };
