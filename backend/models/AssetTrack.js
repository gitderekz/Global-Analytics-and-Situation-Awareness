const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('AssetTrack', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    assetId: { type: DataTypes.INTEGER, allowNull: false },
    latitude: { type: DataTypes.DECIMAL(10, 7), allowNull: false },
    longitude: { type: DataTypes.DECIMAL(10, 7), allowNull: false },
    speed: { type: DataTypes.DECIMAL(8, 2) },
    heading: { type: DataTypes.DECIMAL(6, 2) },
    timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  }, {
    tableName: 'asset_tracks',
    timestamps: false,
    indexes: [{ fields: ['assetId'] }, { fields: ['timestamp'] }],
  });
};
