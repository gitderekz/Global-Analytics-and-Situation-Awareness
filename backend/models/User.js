const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    roleId: { type: DataTypes.INTEGER, allowNull: false },
    firstName: { type: DataTypes.STRING(100), allowNull: false },
    lastName: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(255), allowNull: false },
    avatar: { type: DataTypes.STRING(500) },
    phone: { type: DataTypes.STRING(20) },
    status: { type: DataTypes.ENUM('active', 'inactive', 'suspended'), defaultValue: 'active' },
    lastLogin: { type: DataTypes.DATE },
  }, { tableName: 'users', timestamps: true });
};
