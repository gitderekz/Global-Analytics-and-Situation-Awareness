const logger = require('../utils/logger');
const { sendAlertEmail, sendEventEmail } = require('./emailService');
const { sendAlertSMS, sendEventSMS } = require('./smsService');
const db = require('../models');

const notifyUser = async (user, notificationType, data) => {
  try {
    const notification = await db.Notification.create({
      userId: user.id,
      title: data.title,
      message: data.message,
      type: notificationType,
    });

    const results = {};

    // Send via email if enabled
    if (process.env.ENABLE_EMAIL_NOTIFICATIONS !== 'false') {
      if (notificationType === 'alert') {
        results.email = await sendAlertEmail(user, data);
      } else if (notificationType === 'event') {
        results.email = await sendEventEmail(user, data);
      }
    }

    // Send via SMS if enabled
    if (process.env.ENABLE_SMS_NOTIFICATIONS === 'true') {
      if (notificationType === 'alert') {
        results.sms = await sendAlertSMS(user, data);
      } else if (notificationType === 'event') {
        results.sms = await sendEventSMS(user, data);
      }
    }

    logger.info('User notification sent', {
      userId: user.id,
      notificationType,
      channels: Object.keys(results),
    });

    return { notification, results };
  } catch (err) {
    logger.error('Failed to send notification', { error: err.message, userId: user.id });
    return { success: false, error: err.message };
  }
};

const notifyRoleGroup = async (role, notificationType, data) => {
  try {
    const users = await db.User.findAll({
      include: [{ model: db.Role, where: { name: role } }],
    });

    const results = await Promise.all(
      users.map((user) => notifyUser(user, notificationType, data))
    );

    logger.info('Role group notification sent', {
      role,
      notificationType,
      userCount: users.length,
    });

    return results;
  } catch (err) {
    logger.error('Failed to send role group notification', { error: err.message, role });
    return [];
  }
};

module.exports = { notifyUser, notifyRoleGroup };
