const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Report', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(255), allowNull: false },
    type: { type: DataTypes.STRING(50) },
    filePath: { type: DataTypes.STRING(500) },
    generatedBy: { type: DataTypes.INTEGER },
    generatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  }, { tableName: 'reports', timestamps: false });
};
