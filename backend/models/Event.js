const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Event', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    eventType: { type: DataTypes.STRING(100), allowNull: false },
    title: { type: DataTypes.STRING(255), allowNull: false },
    description: { type: DataTypes.TEXT },
    severity: { type: DataTypes.ENUM('Info', 'Low', 'Medium', 'High', 'Critical'), defaultValue: 'Info' },
    status: { type: DataTypes.ENUM('Open', 'Investigating', 'In Progress', 'Resolved', 'Closed'), defaultValue: 'Open' },
    source: { type: DataTypes.STRING(100) },
    locationId: { type: DataTypes.INTEGER },
    latitude: { type: DataTypes.DECIMAL(10, 7) },
    longitude: { type: DataTypes.DECIMAL(10, 7) },
    country: { type: DataTypes.STRING(100) },
    region: { type: DataTypes.STRING(100) },
    city: { type: DataTypes.STRING(100) },
    startTime: { type: DataTypes.DATE },
    endTime: { type: DataTypes.DATE },
    metadata: { type: DataTypes.JSON },
    createdBy: { type: DataTypes.INTEGER },
  }, {
    tableName: 'events',
    timestamps: true,
    indexes: [
      { fields: ['latitude', 'longitude'] },
      { fields: ['eventType'] },
      { fields: ['severity'] },
      { fields: ['status'] },
      { fields: ['createdAt'] },
    ],
  });
};
