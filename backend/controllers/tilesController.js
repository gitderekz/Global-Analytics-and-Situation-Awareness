const path = require('path');
const { success, error } = require('../utils/response');
const mbtilesService = require('../services/mbtilesService');

exports.getTile = async (req, res) => {
  try {
    const { z, x, y } = req.params;
    const tile = await mbtilesService.getTile(z, x, y);
    if (!tile) return res.status(204).end();
    res.set('Content-Type', tile.contentType);
    return res.send(tile.data);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.uploadMbtiles = async (req, res) => {
  try {
    if (!req.file) return error(res, 'MBTiles file missing', 400);
    const result = await mbtilesService.uploadMbtiles(req.file);
    return success(res, result, 'MBTiles uploaded successfully');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.getStatus = async (req, res) => {
  try {
    const status = await mbtilesService.getStatus();
    return success(res, status);
  } catch (err) {
    return error(res, err.message, 500);
  }
};