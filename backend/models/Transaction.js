const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Transaction', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    transactionId: { type: DataTypes.STRING(100), unique: true },
    amount: { type: DataTypes.DECIMAL(15, 2) },
    currency: { type: DataTypes.STRING(10), defaultValue: 'USD' },
    riskLevel: { type: DataTypes.ENUM('Low', 'Medium', 'High', 'Critical'), defaultValue: 'Low' },
    locationId: { type: DataTypes.INTEGER },
    latitude: { type: DataTypes.DECIMAL(10, 7) },
    longitude: { type: DataTypes.DECIMAL(10, 7) },
    status: { type: DataTypes.ENUM('pending', 'approved', 'flagged', 'blocked'), defaultValue: 'pending' },
    timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  }, { tableName: 'transactions', timestamps: true });
};
