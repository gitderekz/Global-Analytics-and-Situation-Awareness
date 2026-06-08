const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Continent', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    code: { type: DataTypes.STRING(10) },
  }, { tableName: 'continents', timestamps: false });
};
