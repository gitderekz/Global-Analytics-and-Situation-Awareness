# MapTiler Server Integration

This directory is reserved for optional MapTiler Server configuration and style files.

## Using Local MBTiles

- Drop a `.mbtiles` file into `backend/uploads/mbtiles/tiles.mbtiles`.
- The container `maptiler` in `docker-compose.yml` mounts `./uploads/mbtiles:/data`.
- The platform will load offline tiles via the backend tile service at `/api/v1/tiles/{z}/{x}/{y}.png`.

## Custom Styles

If you want to provide a custom MapTiler style, add it within this directory and update `VITE_MAP_URL` / `MAPTILER_STYLE_URL` in the backend environment.
