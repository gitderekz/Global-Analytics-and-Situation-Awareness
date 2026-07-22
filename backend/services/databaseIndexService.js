const logger = require('../utils/logger');

const setupDatabaseIndices = async (sequelize) => {
  try {
    // Events table indices
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
      CREATE INDEX IF NOT EXISTS idx_events_severity ON events(severity);
      CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(createdAt);
      CREATE INDEX IF NOT EXISTS idx_events_country_city ON events(country, city);
    `);

    // Assets table indices
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_assets_status ON assets(status);
      CREATE INDEX IF NOT EXISTS idx_assets_created_at ON assets(createdAt);
    `);

    // Devices table indices
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_devices_status ON devices(status);
      CREATE INDEX IF NOT EXISTS idx_devices_last_seen ON devices(lastSeen);
    `);

    // Alerts table indices
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_alerts_severity ON alerts(severity);
      CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts(status);
      CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON alerts(createdAt);
    `);

    // Users table indices
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
    `);

    // Audit logs table indices
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(userId);
      CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
      CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(createdAt);
    `);

    // Reports table indices
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_reports_generated_by ON reports(generatedBy);
      CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(createdAt);
    `);

    // Socket events table indices
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_socket_events_user_id ON socket_events(userId);
      CREATE INDEX IF NOT EXISTS idx_socket_events_type ON socket_events(eventType);
      CREATE INDEX IF NOT EXISTS idx_socket_events_created_at ON socket_events(createdAt);
    `);

    logger.info('Database indices created successfully');
  } catch (err) {
    logger.error('Failed to create database indices', { error: err.message });
  }
};

module.exports = { setupDatabaseIndices };
