const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const mbtilesService = require('../services/mbtilesService');

const tmpDir = path.join(__dirname, 'temp-mbtiles');
const samplePath = path.join(tmpDir, 'sample.mbtiles');

const createSampleMbtiles = () => new Promise((resolve, reject) => {
  const db = new sqlite3.Database(samplePath, (err) => {
    if (err) return reject(err);
    db.serialize(() => {
      db.run('CREATE TABLE metadata (name TEXT, value TEXT)');
      db.run('CREATE TABLE tiles (zoom_level INTEGER, tile_column INTEGER, tile_row INTEGER, tile_data BLOB, tile_content_type TEXT)');
      db.run('INSERT INTO metadata (name, value) VALUES (?, ?)', ['format', 'png']);
      const tileData = Buffer.from('fake-tile');
      db.run('INSERT INTO tiles (zoom_level, tile_column, tile_row, tile_data, tile_content_type) VALUES (?, ?, ?, ?, ?)', [0, 0, 0, tileData, 'image/png']);
      db.close((closeErr) => (closeErr ? reject(closeErr) : resolve()));
    });
  });
});

describe('MBTiles Service', () => {
  beforeAll(() => {
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
  });

  afterAll(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('should report unavailable status when no MBTiles file exists', async () => {
    const missingPath = path.join(tmpDir, 'missing.mbtiles');
    const result = await mbtilesService.initializeMbtiles(missingPath);
    expect(result).toBe(false);
    const status = await mbtilesService.getStatus();
    expect(status.enabled).toBe(false);
    expect(status.hasFile).toBe(false);
  });

  it('should load and serve a sample MBTiles tile', async () => {
    await createSampleMbtiles();
    const result = await mbtilesService.initializeMbtiles(samplePath);
    expect(result).toBe(true);
    const status = await mbtilesService.getStatus();
    expect(status.enabled).toBe(true);
    expect(status.hasFile).toBe(true);
    expect(status.metadata.format).toBe('png');

    const tile = await mbtilesService.getTile('0', '0', '0');
    expect(tile).toBeDefined();
    expect(tile.contentType).toBe('image/png');
    expect(tile.data).toBeInstanceOf(Buffer);
  });
});
