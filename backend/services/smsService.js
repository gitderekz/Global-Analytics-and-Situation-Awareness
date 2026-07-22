const logger = require('../utils/logger');

// SMS service stub - integrate with Twilio, AWS SNS, or similar
const sendSMS = async (phoneNumber, message) => {
  try {
    // TODO: Integrate with actual SMS provider (Twilio, AWS SNS, etc.)
    // Example with Twilio:
    // const twilio = require('twilio');
    // const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
    // await client.messages.create({
    //   body: message,
    //   from: process.env.TWILIO_PHONE,
    //   to: phoneNumber,
    // });

    logger.info('SMS prepared (provider not configured)', { phoneNumber, messageLength: message.length });
    return { success: true, message: 'SMS queued (provider not configured)' };
  } catch (err) {
    logger.error('Failed to send SMS', { error: err.message, phoneNumber });
    return { success: false, error: err.message };
  }
};

const sendAlertSMS = async (user, alert) => {
  const message = `ALERT [${alert.severity}]: ${alert.title}. Status: ${alert.status}`;
  if (!user.phone) {
    logger.warn('User has no phone number for SMS', { userId: user.id });
    return { success: false, error: 'User has no phone number' };
  }
  return sendSMS(user.phone, message);
};

const sendEventSMS = async (user, event) => {
  const message = `EVENT [${event.severity}]: ${event.title} in ${event.city}. Status: ${event.status}`;
  if (!user.phone) {
    logger.warn('User has no phone number for SMS', { userId: user.id });
    return { success: false, error: 'User has no phone number' };
  }
  return sendSMS(user.phone, message);
};

module.exports = { sendSMS, sendAlertSMS, sendEventSMS };
