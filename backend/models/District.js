const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('District', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    cityId: { type: DataTypes.INTEGER },
    name: { type: DataTypes.STRING(100), allowNull: false },
    latitude: { type: DataTypes.DECIMAL(10, 7) },
    longitude: { type: DataTypes.DECIMAL(10, 7) },
  }, { tableName: 'districts', timestamps: false });
};
