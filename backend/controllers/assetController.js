const { Asset, AssetTrack } = require('../models');
const { success, error } = require('../utils/response');
const { buildFeatureCollection } = require('../services/geojsonService');

let io = null;
exports.setIo = (socketIo) => { io = socketIo; };

exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 50, status, assetType } = req.query;
    const where = {};
    if (status) where.status = status;
    if (assetType) where.assetType = assetType;

    const { count, rows } = await Asset.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['updatedAt', 'DESC']],
    });

    return success(res, { assets: rows, total: count });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.getById = async (req, res) => {
  try {
    const asset = await Asset.findByPk(req.params.id, {
      include: [{ model: AssetTrack, limit: 100, order: [['timestamp', 'DESC']] }],
    });
    if (!asset) return error(res, 'Asset not found', 404);
    return success(res, asset);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.create = async (req, res) => {
  try {
    const asset = await Asset.create(req.body);
    if (io) io.of('/assets').emit('asset:update', asset);
    return success(res, asset, 'Asset created', 201);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.update = async (req, res) => {
  try {
    const asset = await Asset.findByPk(req.params.id);
    if (!asset) return error(res, 'Asset not found', 404);

    const prevLat = asset.latitude;
    const prevLng = asset.longitude;
    await asset.update(req.body);

    if (req.body.latitude && req.body.longitude) {
      await AssetTrack.create({
        assetId: asset.id,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        speed: req.body.speed,
        heading: req.body.heading,
      });
      if (io) {
        io.of('/assets').emit('asset:moved', asset);
        io.of('/assets').emit('asset:update', asset);
      }
    } else if (io) {
      io.of('/assets').emit('asset:update', asset);
    }

    return success(res, asset, 'Asset updated');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.remove = async (req, res) => {
  try {
    const asset = await Asset.findByPk(req.params.id);
    if (!asset) return error(res, 'Asset not found', 404);
    await asset.destroy();
    return success(res, null, 'Asset deleted');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.getGeoJSON = async (req, res) => {
  try {
    const where = {};
    if (req.query.status) where.status = req.query.status;
    const assets = await Asset.findAll({ where, limit: 10000 });
    return success(res, buildFeatureCollection(assets, 'asset'));
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.getTracks = async (req, res) => {
  try {
    const tracks = await AssetTrack.findAll({
      where: { assetId: req.params.id },
      order: [['timestamp', 'ASC']],
      limit: 1000,
    });
    return success(res, tracks);
  } catch (err) {
    return error(res, err.message, 500);
  }
};
