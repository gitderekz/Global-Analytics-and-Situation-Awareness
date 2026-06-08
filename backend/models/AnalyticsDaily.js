const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('AnalyticsDaily', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    totalEvents: { type: DataTypes.INTEGER, defaultValue: 0 },
    totalAssets: { type: DataTypes.INTEGER, defaultValue: 0 },
    totalAlerts: { type: DataTypes.INTEGER, defaultValue: 0 },
    totalDevices: { type: DataTypes.INTEGER, defaultValue: 0 },
  }, { tableName: 'analytics_daily', timestamps: false });
};
