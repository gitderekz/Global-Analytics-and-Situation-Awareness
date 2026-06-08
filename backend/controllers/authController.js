const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Role, AuditLog } = require('../models');
const { success, error } = require('../utils/response');

const generateTokens = (user) => {
  const payload = { id: user.id, email: user.email, roleId: user.roleId };
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });
  return { accessToken, refreshToken };
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return error(res, 'Email and password required', 400);

    const user = await User.findOne({
      where: { email },
      include: [{ model: Role, attributes: ['id', 'name'] }],
    });

    if (!user || user.status !== 'active') {
      return error(res, 'Invalid credentials', 401);
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return error(res, 'Invalid credentials', 401);

    await user.update({ lastLogin: new Date() });
    await AuditLog.create({ userId: user.id, action: 'login', entity: 'user', entityId: user.id });

    const tokens = generateTokens(user);
    const userData = user.toJSON();
    delete userData.password;

    return success(res, { user: userData, ...tokens }, 'Login successful');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return error(res, 'Refresh token required', 400);

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findByPk(decoded.id, {
      include: [{ model: Role, attributes: ['id', 'name'] }],
    });

    if (!user || user.status !== 'active') {
      return error(res, 'Invalid refresh token', 401);
    }

    const tokens = generateTokens(user);
    return success(res, tokens, 'Token refreshed');
  } catch (err) {
    return error(res, 'Invalid refresh token', 401);
  }
};

exports.me = async (req, res) => {
  return success(res, req.user, 'User profile');
};

exports.logout = async (req, res) => {
  await AuditLog.create({
    userId: req.user.id,
    action: 'logout',
    entity: 'user',
    entityId: req.user.id,
  });
  return success(res, null, 'Logged out');
};
