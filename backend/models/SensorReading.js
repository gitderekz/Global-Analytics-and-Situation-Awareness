const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('SensorReading', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    deviceId: { type: DataTypes.INTEGER, allowNull: false },
    metric: { type: DataTypes.STRING(100), allowNull: false },
    value: { type: DataTypes.DECIMAL(15, 4) },
    timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  }, {
    tableName: 'sensor_readings',
    timestamps: false,
    indexes: [{ fields: ['deviceId'] }, { fields: ['timestamp'] }],
  });
};
