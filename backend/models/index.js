const { Sequelize } = require('sequelize');
const config = require('../config/database');
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  dbConfig
);

const db = {};

db.Role = require('./Role')(sequelize);
db.Permission = require('./Permission')(sequelize);
db.RolePermission = require('./RolePermission')(sequelize);
db.User = require('./User')(sequelize);
db.Continent = require('./Continent')(sequelize);
db.Country = require('./Country')(sequelize);
db.Region = require('./Region')(sequelize);
db.City = require('./City')(sequelize);
db.District = require('./District')(sequelize);
db.Location = require('./Location')(sequelize);
db.Event = require('./Event')(sequelize);
db.Asset = require('./Asset')(sequelize);
db.AssetTrack = require('./AssetTrack')(sequelize);
db.Device = require('./Device')(sequelize);
db.Alert = require('./Alert')(sequelize);
db.Route = require('./Route')(sequelize);
db.RoutePoint = require('./RoutePoint')(sequelize);
db.Geofence = require('./Geofence')(sequelize);
db.GeofencePoint = require('./GeofencePoint')(sequelize);
db.Threat = require('./Threat')(sequelize);
db.Transaction = require('./Transaction')(sequelize);
db.SensorReading = require('./SensorReading')(sequelize);
db.Notification = require('./Notification')(sequelize);
db.AuditLog = require('./AuditLog')(sequelize);
db.Report = require('./Report')(sequelize);
db.Setting = require('./Setting')(sequelize);
db.RefreshToken = require('./RefreshToken')(sequelize);
db.AnalyticsDaily = require('./AnalyticsDaily')(sequelize);
db.SocketEvent = require('./SocketEvent')(sequelize);

// Associations
db.Role.hasMany(db.User, { foreignKey: 'roleId' });
db.User.belongsTo(db.Role, { foreignKey: 'roleId' });

db.Role.belongsToMany(db.Permission, { through: db.RolePermission, foreignKey: 'roleId' });
db.Permission.belongsToMany(db.Role, { through: db.RolePermission, foreignKey: 'permissionId' });

db.User.hasMany(db.AuditLog, { foreignKey: 'userId' });
db.AuditLog.belongsTo(db.User, { foreignKey: 'userId' });

db.User.hasMany(db.RefreshToken, { foreignKey: 'userId' });
db.RefreshToken.belongsTo(db.User, { foreignKey: 'userId' });

db.User.hasMany(db.SocketEvent, { foreignKey: 'userId' });
db.SocketEvent.belongsTo(db.User, { foreignKey: 'userId' }, { allowNull: true });

db.Continent.hasMany(db.Country, { foreignKey: 'continentId' });
db.Country.belongsTo(db.Continent, { foreignKey: 'continentId' });

db.Country.hasMany(db.Region, { foreignKey: 'countryId' });
db.Region.belongsTo(db.Country, { foreignKey: 'countryId' });

db.Region.hasMany(db.City, { foreignKey: 'regionId' });
db.City.belongsTo(db.Region, { foreignKey: 'regionId' });

db.City.hasMany(db.District, { foreignKey: 'cityId' });
db.District.belongsTo(db.City, { foreignKey: 'cityId' });

db.Location.belongsTo(db.Continent, { foreignKey: 'continentId' });
db.Location.belongsTo(db.Country, { foreignKey: 'countryId' });
db.Location.belongsTo(db.Region, { foreignKey: 'regionId' });
db.Location.belongsTo(db.City, { foreignKey: 'cityId' });
db.Location.belongsTo(db.District, { foreignKey: 'districtId' });

db.Location.hasMany(db.Event, { foreignKey: 'locationId' });
db.Event.belongsTo(db.Location, { foreignKey: 'locationId' });

db.Location.hasMany(db.Asset, { foreignKey: 'locationId' });
db.Asset.belongsTo(db.Location, { foreignKey: 'locationId' });

db.Location.hasMany(db.Device, { foreignKey: 'locationId' });
db.Device.belongsTo(db.Location, { foreignKey: 'locationId' });

db.Event.hasMany(db.Alert, { foreignKey: 'eventId' });
db.Alert.belongsTo(db.Event, { foreignKey: 'eventId' });

db.User.hasMany(db.Alert, { foreignKey: 'acknowledgedBy', as: 'acknowledgedAlerts' });
db.Alert.belongsTo(db.User, { foreignKey: 'acknowledgedBy', as: 'acknowledgedByUser' });

db.Asset.hasMany(db.AssetTrack, { foreignKey: 'assetId' });
db.AssetTrack.belongsTo(db.Asset, { foreignKey: 'assetId' });

db.Asset.hasMany(db.Route, { foreignKey: 'assetId' });
db.Route.belongsTo(db.Asset, { foreignKey: 'assetId' });

db.Route.hasMany(db.RoutePoint, { foreignKey: 'routeId' });
db.RoutePoint.belongsTo(db.Route, { foreignKey: 'routeId' });

db.Geofence.hasMany(db.GeofencePoint, { foreignKey: 'geofenceId' });
db.GeofencePoint.belongsTo(db.Geofence, { foreignKey: 'geofenceId' });

db.Event.hasOne(db.Threat, { foreignKey: 'eventId' });
db.Threat.belongsTo(db.Event, { foreignKey: 'eventId' });

db.Device.hasMany(db.SensorReading, { foreignKey: 'deviceId' });
db.SensorReading.belongsTo(db.Device, { foreignKey: 'deviceId' });

db.User.hasMany(db.Notification, { foreignKey: 'userId' });
db.Notification.belongsTo(db.User, { foreignKey: 'userId' });

db.User.hasMany(db.Report, { foreignKey: 'generatedBy' });
db.Report.belongsTo(db.User, { foreignKey: 'generatedBy' });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
