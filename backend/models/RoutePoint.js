const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('RoutePoint', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    routeId: { type: DataTypes.INTEGER, allowNull: false },
    latitude: { type: DataTypes.DECIMAL(10, 7), allowNull: false },
    longitude: { type: DataTypes.DECIMAL(10, 7), allowNull: false },
    sequence: { type: DataTypes.INTEGER, defaultValue: 0 },
  }, { tableName: 'route_points', timestamps: false });
};
