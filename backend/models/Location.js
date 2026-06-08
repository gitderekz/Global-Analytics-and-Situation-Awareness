const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Location', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    continentId: { type: DataTypes.INTEGER },
    countryId: { type: DataTypes.INTEGER },
    regionId: { type: DataTypes.INTEGER },
    cityId: { type: DataTypes.INTEGER },
    districtId: { type: DataTypes.INTEGER },
    latitude: { type: DataTypes.DECIMAL(10, 7) },
    longitude: { type: DataTypes.DECIMAL(10, 7) },
    address: { type: DataTypes.STRING(500) },
  }, { tableName: 'locations', timestamps: true });
};
