# Global Analytics & Situation Awareness Platform

Enterprise-grade geospatial analytics command center for real-time monitoring, asset tracking, SOC/NOC dashboards, and geographic intelligence.

## Architecture

```
MapTiler Server → MapLibre GL → React Frontend
                      ↕
              Node.js + Socket.IO
                      ↕
                   MySQL 8
```

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React, Vite, MapLibre GL, Three.js, Zustand, Socket.IO Client |
| Backend | Node.js, Express, Sequelize, Socket.IO, JWT |
| Database | MySQL 8 |
| Maps | MapTiler Server (self-hosted), OSM MBTiles |

## Quick Start

### Prerequisites

- Node.js 18+
- MySQL 8+
- MapTiler Server (optional — falls back to OSM tiles)

### 1. Database

```bash
# Create MySQL database and user
mysql -u root -p -e "CREATE DATABASE global_analytics_platform;
  CREATE USER 'analytics_user'@'localhost' IDENTIFIED BY 'analytics_pass';
  GRANT ALL ON global_analytics_platform.* TO 'analytics_user'@'localhost';"
```

### 2. Backend

```bash
cd backend
cp .env.example .env   # edit if needed
npm install
npm run seed           # creates tables + demo data
npm run dev            # http://localhost:5000
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev            # http://localhost:5173
```

### 4. Login

```
Email:    admin@analytics.local
Password: admin123
```

## Docker

```bash
docker-compose up -d
```

Services: MySQL (3306), Backend (5000), Frontend (5173), Nginx (80)

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/login` | Authentication |
| GET | `/api/v1/events` | List events |
| GET | `/api/v1/assets` | List assets |
| GET | `/api/v1/devices` | List devices |
| GET | `/api/v1/alerts` | List alerts |
| GET | `/api/v1/analytics/kpis` | Dashboard KPIs |
| GET | `/api/v1/analytics/map-data` | GeoJSON map data |
| GET | `/api/v1/analytics/search` | Global search |

## Socket.IO Namespaces

- `/events` — event:new, event:update, event:delete
- `/assets` — asset:update, asset:moved
- `/devices` — device:update
- `/alerts` — alert:new, alert:update

## Project Structure

```
backend/          API, models, socket, services
frontend/         React command center UI
database/         Seed scripts
docker/           Dockerfiles
nginx/            Reverse proxy config
maptiler-server/  Local tile server (external)
docs/             Documentation
```

## Modules

- Dashboard — Global overview with world map
- Event Monitoring — Real-time event tracking
- Asset Tracking — Fleet, aircraft, ships
- Cyber Security SOC — Threat monitoring
- Network Monitoring — NOC infrastructure
- Logistics Control — Supply chain tracking
- Fraud Detection — Transaction risk analysis
- IoT Monitoring — Sensor and device telemetry
- Emergency Response — Incident management

## MapTiler Setup

The platform supports both self-hosted MapTiler Server and offline MBTiles mode.

1. Start the platform with Docker Compose:
   ```bash
   docker-compose up -d mysql redis backend frontend nginx maptiler
   ```
2. Upload an `.mbtiles` file from the Settings page, or place it directly into `backend/uploads/mbtiles/tiles.mbtiles`.
3. MapTiler Server will expose the default style at:
   ```
   http://localhost:3650/styles/basic/style.json
   ```

### Notes
- `MapTiler` uses `./uploads/mbtiles` as the data directory in the Docker Compose setup.
- Offline mode uses the backend tile service at `/api/v1/tiles/{z}/{x}/{y}.png`.
- If MapTiler is unavailable, the frontend falls back to OpenStreetMap raster tiles and can also use MBTiles in offline mode.

### Test commands

Run backend unit tests:
```bash
cd backend && npm test
```

Run frontend unit tests:
```bash
cd frontend && npm test
```

Run frontend E2E smoke tests:
```bash
cd frontend && npm run test:e2e
```

## Development Phases

See `PART 8 — DEVELOPMENT ROADMAP` for the full implementation plan.
