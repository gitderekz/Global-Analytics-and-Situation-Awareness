const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Alert', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    eventId: { type: DataTypes.INTEGER },
    title: { type: DataTypes.STRING(255), allowNull: false },
    description: { type: DataTypes.TEXT },
    severity: { type: DataTypes.ENUM('Info', 'Low', 'Medium', 'High', 'Critical'), defaultValue: 'Medium' },
    status: { type: DataTypes.ENUM('New', 'Acknowledged', 'In Progress', 'Resolved'), defaultValue: 'New' },
    acknowledgedBy: { type: DataTypes.INTEGER },
    acknowledgedAt: { type: DataTypes.DATE },
  }, {
    tableName: 'alerts',
    timestamps: true,
    indexes: [{ fields: ['status'] }, { fields: ['severity'] }],
  });
};
