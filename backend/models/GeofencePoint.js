const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('GeofencePoint', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    geofenceId: { type: DataTypes.INTEGER, allowNull: false },
    latitude: { type: DataTypes.DECIMAL(10, 7), allowNull: false },
    longitude: { type: DataTypes.DECIMAL(10, 7), allowNull: false },
    sequence: { type: DataTypes.INTEGER, defaultValue: 0 },
  }, { tableName: 'geofence_points', timestamps: false });
};
