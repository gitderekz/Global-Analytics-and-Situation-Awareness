const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Asset', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    assetType: { type: DataTypes.STRING(50), allowNull: false },
    name: { type: DataTypes.STRING(255), allowNull: false },
    description: { type: DataTypes.TEXT },
    status: { type: DataTypes.ENUM('active', 'inactive', 'offline', 'maintenance'), defaultValue: 'active' },
    locationId: { type: DataTypes.INTEGER },
    latitude: { type: DataTypes.DECIMAL(10, 7) },
    longitude: { type: DataTypes.DECIMAL(10, 7) },
    speed: { type: DataTypes.DECIMAL(8, 2) },
    heading: { type: DataTypes.DECIMAL(6, 2) },
    altitude: { type: DataTypes.DECIMAL(10, 2) },
    metadata: { type: DataTypes.JSON },
  }, {
    tableName: 'assets',
    timestamps: true,
    indexes: [
      { fields: ['latitude', 'longitude'] },
      { fields: ['status'] },
      { fields: ['assetType'] },
    ],
  });
};
