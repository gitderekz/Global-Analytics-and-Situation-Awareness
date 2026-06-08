const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Geofence', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(255), allowNull: false },
    type: { type: DataTypes.ENUM('Circle', 'Polygon', 'Rectangle'), defaultValue: 'Polygon' },
    description: { type: DataTypes.TEXT },
    active: { type: DataTypes.BOOLEAN, defaultValue: true },
  }, { tableName: 'geofences', timestamps: true });
};
