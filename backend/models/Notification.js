const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Notification', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING(255), allowNull: false },
    message: { type: DataTypes.TEXT },
    type: { type: DataTypes.ENUM('system', 'alert', 'user', 'device', 'security'), defaultValue: 'system' },
    isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
  }, { tableName: 'notifications', timestamps: true });
};
