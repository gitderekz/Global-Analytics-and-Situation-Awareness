const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const logger = require('../utils/logger');

const mbtilesDir = path.join(__dirname, '..', 'uploads', 'mbtiles');
const defaultFileName = 'tiles.mbtiles';
let dbHandle = null;
let metadata = {};
let currentFilePath = null;

const ensureDirectory = () => {
  if (!fs.existsSync(mbtilesDir)) {
    fs.mkdirSync(mbtilesDir, { recursive: true });
  }
};

const queryOne = (sql, params = []) => new Promise((resolve, reject) => {
  if (!dbHandle) return reject(new Error('MBTiles database not initialized'));
  dbHandle.get(sql, params, (err, row) => {
    if (err) return reject(err);
    return resolve(row);
  });
});

const queryAll = (sql, params = []) => new Promise((resolve, reject) => {
  if (!dbHandle) return reject(new Error('MBTiles database not initialized'));
  dbHandle.all(sql, params, (err, rows) => {
    if (err) return reject(err);
    return resolve(rows);
  });
});

const closeDatabase = () => new Promise((resolve) => {
  if (!dbHandle) return resolve();
  dbHandle.close(() => {
    dbHandle = null;
    resolve();
  });
});

const initializeMbtiles = async (customPath) => {
  ensureDirectory();

  const candidatePath = customPath
    || process.env.MBTILES_PATH
    || path.join(mbtilesDir, defaultFileName);

  if (!fs.existsSync(candidatePath)) {
    logger.info('No MBTiles file found for offline tile service', { path: candidatePath });
    return false;
  }

  await closeDatabase();

  return new Promise((resolve, reject) => {
    dbHandle = new sqlite3.Database(candidatePath, sqlite3.OPEN_READONLY, async (err) => {
      if (err) {
        logger.error('Failed to open MBTiles database', { error: err.message, path: candidatePath });
        dbHandle = null;
        return reject(err);
      }

      currentFilePath = candidatePath;
      try {
        const rows = await queryAll('SELECT name, value FROM metadata');
        metadata = rows.reduce((agg, row) => ({ ...agg, [row.name]: row.value }), {});
        logger.info('MBTiles loaded successfully', { path: candidatePath, metadata });
        resolve(true);
      } catch (metadataErr) {
        logger.warn('Failed to read MBTiles metadata', { error: metadataErr.message });
        metadata = {};
        resolve(true);
      }
    });
  });
};

const getTile = async (z, x, y) => {
  if (!dbHandle) return null;

  const zoom = parseInt(z, 10);
  const column = parseInt(x, 10);
  const row = parseInt(y, 10);
  const tmsRow = (1 << zoom) - 1 - row;

  const tile = await queryOne(
    'SELECT tile_data, tile_content_type FROM tiles WHERE zoom_level = ? AND tile_column = ? AND tile_row = ?',
    [zoom, column, tmsRow]
  );

  if (!tile) return null;

  const contentType = tile.tile_content_type
    || metadata.format
    || 'image/png';

  return { data: tile.tile_data, contentType };
};

const uploadMbtiles = async (file) => {
  ensureDirectory();

  if (!file || !file.path) {
    throw new Error('No MBTiles file uploaded');
  }

  const storedPath = path.join(mbtilesDir, defaultFileName);
  if (fs.existsSync(storedPath)) {
    fs.unlinkSync(storedPath);
  }

  fs.renameSync(file.path, storedPath);
  await initializeMbtiles(storedPath);

  return {
    file: path.basename(storedPath),
    path: storedPath,
    enabled: true,
    format: metadata.format || 'png',
  };
};

const getStatus = async () => ({
  enabled: !!dbHandle,
  path: currentFilePath,
  metadata,
  hasFile: !!currentFilePath && fs.existsSync(currentFilePath),
});

const isEnabled = () => !!dbHandle;

module.exports = {
  initializeMbtiles,
  getTile,
  uploadMbtiles,
  getStatus,
  isEnabled,
};