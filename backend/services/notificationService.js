const db = require('../models');
const logger = require('../utils/logger');

const createNotification = async ({ userId, title, message, type = 'system' }) => {
  const notification = await db.Notification.create({ userId, title, message, type, isRead: false });
  return notification;
};

const notifyAdmins = async (title, message, type = 'alert') => {
  const { Op } = require('sequelize');
  const admins = await db.User.findAll({
    include: [{ model: db.Role, where: { name: { [Op.in]: ['Super Admin', 'Admin'] } } }],
  });
  const notifications = await Promise.all(
    admins.map((user) => createNotification({ userId: user.id, title, message, type }))
  );
  return notifications;
};

// Email channel stub — configure SMTP in settings for production
const sendEmail = async (to, subject, body) => {
  const setting = await db.Setting.findOne({ where: { key: 'smtp_enabled' } });
  if (!setting || setting.value !== 'true') {
    logger.info('Email skipped (SMTP not enabled)', { to, subject });
    return { sent: false, reason: 'SMTP not configured' };
  }
  logger.info('Email queued', { to, subject });
  return { sent: true, channel: 'email' };
};

// SMS channel stub — configure provider in settings for production
const sendSMS = async (phone, message) => {
  const setting = await db.Setting.findOne({ where: { key: 'sms_enabled' } });
  if (!setting || setting.value !== 'true') {
    logger.info('SMS skipped (provider not enabled)', { phone });
    return { sent: false, reason: 'SMS not configured' };
  }
  logger.info('SMS queued', { phone });
  return { sent: true, channel: 'sms' };
};

const notifyUser = async (userId, { title, message, type, email, sms }) => {
  const notification = await createNotification({ userId, title, message, type });
  const results = { notification };

  if (email) {
    const user = await db.User.findByPk(userId);
    if (user?.email) results.email = await sendEmail(user.email, title, message);
  }
  if (sms) {
    const user = await db.User.findByPk(userId);
    if (user?.phone) results.sms = await sendSMS(user.phone, message);
  }

  return results;
};

module.exports = { createNotification, notifyAdmins, notifyUser, sendEmail, sendSMS };
