const logger = require('../utils/logger');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'localhost',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: process.env.SMTP_USER ? {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  } : undefined,
});

const sendEmail = async (to, subject, html, text = null) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@global-analytics.local',
      to,
      subject,
      text: text || html,
      html,
    });
    logger.info('Email sent successfully', { messageId: info.messageId, to });
    return { success: true, messageId: info.messageId };
  } catch (err) {
    logger.error('Failed to send email', { error: err.message, to });
    return { success: false, error: err.message };
  }
};

const sendAlertEmail = async (user, alert) => {
  const subject = `[${alert.severity}] Alert: ${alert.title}`;
  const html = `
    <h2>${alert.title}</h2>
    <p><strong>Severity:</strong> ${alert.severity}</p>
    <p><strong>Status:</strong> ${alert.status}</p>
    <p><strong>Description:</strong> ${alert.description || 'N/A'}</p>
    <p><strong>Created:</strong> ${new Date(alert.createdAt).toLocaleString()}</p>
  `;
  return sendEmail(user.email, subject, html);
};

const sendEventEmail = async (user, event) => {
  const subject = `[${event.severity}] Event: ${event.title}`;
  const html = `
    <h2>${event.title}</h2>
    <p><strong>Type:</strong> ${event.eventType}</p>
    <p><strong>Severity:</strong> ${event.severity}</p>
    <p><strong>Status:</strong> ${event.status}</p>
    <p><strong>Location:</strong> ${event.city}, ${event.country}</p>
    <p><strong>Description:</strong> ${event.description || 'N/A'}</p>
    <p><strong>Created:</strong> ${new Date(event.createdAt).toLocaleString()}</p>
  `;
  return sendEmail(user.email, subject, html);
};

module.exports = { sendEmail, sendAlertEmail, sendEventEmail };
