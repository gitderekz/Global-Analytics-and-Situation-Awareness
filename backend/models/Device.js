const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Device', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    deviceId: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    name: { type: DataTypes.STRING(255) },
    deviceType: { type: DataTypes.STRING(50), allowNull: false },
    status: { type: DataTypes.ENUM('online', 'offline', 'maintenance', 'error'), defaultValue: 'offline' },
    locationId: { type: DataTypes.INTEGER },
    latitude: { type: DataTypes.DECIMAL(10, 7) },
    longitude: { type: DataTypes.DECIMAL(10, 7) },
    lastSeen: { type: DataTypes.DATE },
    metadata: { type: DataTypes.JSON },
  }, {
    tableName: 'devices',
    timestamps: true,
    indexes: [
      { fields: ['latitude', 'longitude'] },
      { fields: ['status'] },
      { fields: ['lastSeen'] },
    ],
  });
};
