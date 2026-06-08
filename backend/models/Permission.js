const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Permission', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    description: { type: DataTypes.STRING(255) },
  }, { tableName: 'permissions', timestamps: true });
};
