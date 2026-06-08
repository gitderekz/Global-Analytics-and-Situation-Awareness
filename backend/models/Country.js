const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Country', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    continentId: { type: DataTypes.INTEGER },
    name: { type: DataTypes.STRING(100), allowNull: false },
    code: { type: DataTypes.STRING(10) },
    latitude: { type: DataTypes.DECIMAL(10, 7) },
    longitude: { type: DataTypes.DECIMAL(10, 7) },
  }, { tableName: 'countries', timestamps: false });
};
