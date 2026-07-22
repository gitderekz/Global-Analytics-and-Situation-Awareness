const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('SocketEvent', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: true },
    eventType: { type: DataTypes.STRING(100), allowNull: false },
    namespace: { type: DataTypes.STRING(100), defaultValue: '/' },
    data: { type: DataTypes.JSON, defaultValue: {} },
    ipAddress: { type: DataTypes.STRING(45) },
    userAgent: { type: DataTypes.TEXT },
    status: { type: DataTypes.ENUM('pending', 'processed', 'error'), defaultValue: 'pending' },
    errorMessage: { type: DataTypes.TEXT },
  }, { tableName: 'socket_events', timestamps: true });
};
