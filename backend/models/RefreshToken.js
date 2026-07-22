const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('RefreshToken', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    token: { type: DataTypes.STRING(512), allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    revoked: { type: DataTypes.BOOLEAN, defaultValue: false },
    expiresAt: { type: DataTypes.DATE, allowNull: false },
  }, {
    tableName: 'refresh_tokens',
    timestamps: true,
  });
};
