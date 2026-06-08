const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Route', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    assetId: { type: DataTypes.INTEGER },
    name: { type: DataTypes.STRING(255) },
    status: { type: DataTypes.ENUM('active', 'completed', 'planned'), defaultValue: 'active' },
  }, { tableName: 'routes', timestamps: true });
};
