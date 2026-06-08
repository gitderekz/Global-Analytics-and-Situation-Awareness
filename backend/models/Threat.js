const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Threat', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    eventId: { type: DataTypes.INTEGER },
    threatType: { type: DataTypes.STRING(100) },
    sourceIp: { type: DataTypes.STRING(45) },
    destinationIp: { type: DataTypes.STRING(45) },
    country: { type: DataTypes.STRING(100) },
    severity: { type: DataTypes.ENUM('Info', 'Low', 'Medium', 'High', 'Critical'), defaultValue: 'Medium' },
    status: { type: DataTypes.ENUM('active', 'mitigated', 'resolved'), defaultValue: 'active' },
  }, { tableName: 'threats', timestamps: true });
};
