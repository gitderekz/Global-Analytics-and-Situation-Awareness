const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Region', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    countryId: { type: DataTypes.INTEGER },
    name: { type: DataTypes.STRING(100), allowNull: false },
    latitude: { type: DataTypes.DECIMAL(10, 7) },
    longitude: { type: DataTypes.DECIMAL(10, 7) },
  }, { tableName: 'regions', timestamps: false });
};
