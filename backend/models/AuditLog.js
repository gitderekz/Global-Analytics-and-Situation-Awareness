const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('AuditLog', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER },
    action: { type: DataTypes.STRING(100), allowNull: false },
    entity: { type: DataTypes.STRING(100) },
    entityId: { type: DataTypes.INTEGER },
    oldValue: { type: DataTypes.JSON },
    newValue: { type: DataTypes.JSON },
    timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  }, { tableName: 'audit_logs', timestamps: false });
};
