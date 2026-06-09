import { useEffect, useRef, useCallback, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import Supercluster from 'supercluster';
import api from '../services/api';
import { useMapStore } from '../store/mapStore';
import MapControls from './MapControls';
import MapLegend from './MapLegend';
import ThreeOverlay from '../threejs/ThreeOverlay';
import styles from './MapContainer.module.css';

const MAP_URL = import.meta.env.VITE_MAP_URL || 'http://localhost:3650/api/maps';

const OFFLINE_STYLE = {
  version: 8,
  sources: {},
  layers: [{
    id: 'background',
    type: 'background',
    paint: { 'background-color': '#0a0e17' },
  }],
};

const SEVERITY_COLORS = {
  Info: '#3b82f6', Low: '#22c55e', Medium: '#eab308', High: '#f97316', Critical: '#ef4444',
};

export default function MapContainer({ mapData, onObjectClick }) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const clusterRef = useRef(null);
  const markersRef = useRef([]);
  const layersLoadedRef = useRef({ heatmap: false, routes: false, geofences: false });
  const [mapReady, setMapReady] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);
  const { center, zoom, layers, setSelectedObject } = useMapStore();

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
  }, []);

  const upsertGeoJSONLayer = useCallback((map, sourceId, layerConfigs, geojson) => {
    if (map.getSource(sourceId)) {
      map.getSource(sourceId).setData(geojson);
    } else {
      map.addSource(sourceId, { type: 'geojson', data: geojson });
      layerConfigs.forEach((cfg) => {
        if (!map.getLayer(cfg.id)) map.addLayer(cfg);
      });
    }
  }, []);

  const loadHeatmap = useCallback(async (map) => {
    try {
      const { data } = await api.get('/analytics/heatmap');
      if (!data.success) return;
      upsertGeoJSONLayer(map, 'heatmap-source', [
        {
          id: 'heatmap-layer',
          type: 'heatmap',
          source: 'heatmap-source',
          paint: {
            'heatmap-weight': ['get', 'weight'],
            'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 9, 3],
            'heatmap-color': [
              'interpolate', ['linear'], ['heatmap-density'],
              0, 'rgba(33,102,172,0)',
              0.2, 'rgb(59,130,246)',
              0.4, 'rgb(34,197,94)',
              0.6, 'rgb(234,179,8)',
              0.8, 'rgb(249,115,22)',
              1, 'rgb(239,68,68)',
            ],
            'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 9, 20],
            'heatmap-opacity': 0.7,
          },
        },
      ], data.data);
      layersLoadedRef.current.heatmap = true;
    } catch (err) {
      console.warn('Heatmap load failed:', err);
    }
  }, [upsertGeoJSONLayer]);

  const loadRoutes = useCallback(async (map) => {
    try {
      const { data } = await api.get('/analytics/routes');
      if (!data.success) return;
      upsertGeoJSONLayer(map, 'routes-source', [
        {
          id: 'routes-layer',
          type: 'line',
          source: 'routes-source',
          paint: { 'line-color': '#3b82f6', 'line-width': 2, 'line-opacity': 0.8 },
          layout: { 'line-cap': 'round', 'line-join': 'round' },
        },
      ], data.data);
      layersLoadedRef.current.routes = true;
    } catch (err) {
      console.warn('Routes load failed:', err);
    }
  }, [upsertGeoJSONLayer]);

  const loadGeofences = useCallback(async (map) => {
    try {
      const { data } = await api.get('/analytics/geofences');
      if (!data.success) return;
      upsertGeoJSONLayer(map, 'geofences-source', [
        {
          id: 'geofences-fill',
          type: 'fill',
          source: 'geofences-source',
          paint: { 'fill-color': '#3b82f6', 'fill-opacity': 0.15 },
        },
        {
          id: 'geofences-outline',
          type: 'line',
          source: 'geofences-source',
          paint: { 'line-color': '#3b82f6', 'line-width': 2, 'line-dasharray': [2, 2] },
        },
      ], data.data);
      layersLoadedRef.current.geofences = true;
    } catch (err) {
      console.warn('Geofences load failed:', err);
    }
  }, [upsertGeoJSONLayer]);

  const setLayerVisibility = useCallback((map, layerId, visible) => {
    if (map.getLayer(layerId)) {
      map.setLayoutProperty(layerId, 'visibility', visible ? 'visible' : 'none');
    }
  }, []);

  const renderMarkers = useCallback((map, data) => {
    clearMarkers();
    if (!data) return;

    const features = [];
    if (layers.events && data.events?.features) features.push(...data.events.features);
    if (layers.assets && data.assets?.features) features.push(...data.assets.features);
    if (layers.devices && data.devices?.features) features.push(...data.devices.features);
    if (features.length === 0) return;

    const addMarker = (feature) => {
      const [lng, lat] = feature.geometry.coordinates;
      const color = feature.properties.color || SEVERITY_COLORS[feature.properties.severity] || '#3b82f6';
      const el = document.createElement('div');
      el.className = styles.marker;
      el.style.backgroundColor = color;
      el.style.boxShadow = `0 0 8px ${color}80`;
      if (feature.properties.severity === 'Critical') el.classList.add(styles.pulse);
      el.addEventListener('click', () => {
        setSelectedObject(feature.properties);
        onObjectClick?.(feature.properties);
        new maplibregl.Popup({ offset: 15 }).setLngLat([lng, lat]).setHTML(`
          <div style="min-width:180px">
            <strong>${feature.properties.name || 'Unknown'}</strong><br/>
            <span style="color:#8b9cb3">Type: ${feature.properties.type}</span><br/>
            ${feature.properties.severity ? `<span style="color:${color}">Severity: ${feature.properties.severity}</span>` : ''}
          </div>
        `).addTo(map);
      });
      markersRef.current.push(new maplibregl.Marker({ element: el }).setLngLat([lng, lat]).addTo(map));
    };

    if (layers.clusters && features.length > 50) {
      if (!clusterRef.current) clusterRef.current = new Supercluster({ radius: 60, maxZoom: 16 });
      clusterRef.current.load(features);
      const bounds = map.getBounds();
      const clusters = clusterRef.current.getClusters(
        [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()],
        Math.floor(map.getZoom())
      );
      clusters.forEach((feature) => {
        const [lng, lat] = feature.geometry.coordinates;
        if (feature.properties.cluster) {
          const el = document.createElement('div');
          el.className = styles.cluster;
          el.textContent = feature.properties.point_count;
          el.addEventListener('click', () => {
            map.flyTo({ center: [lng, lat], zoom: clusterRef.current.getClusterExpansionZoom(feature.properties.cluster_id) });
          });
          markersRef.current.push(new maplibregl.Marker({ element: el }).setLngLat([lng, lat]).addTo(map));
        } else {
          addMarker(feature);
        }
      });
    } else {
      features.forEach(addMarker);
    }
  }, [clearMarkers, layers, onObjectClick, setSelectedObject]);

  useEffect(() => {
    if (mapRef.current || !mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      // style: `${MAP_URL}/styles/basic/style.json`,
      style: `${MAP_URL}/basic/style.json`,
      center,
      zoom,
      pitch: 0,
      bearing: 0,
      attributionControl: false,
    });

    map.addControl(new maplibregl.NavigationControl(), 'top-right');
    map.addControl(new maplibregl.ScaleControl(), 'bottom-left');

    map.on('load', () => {
      mapRef.current = map;
      setMapReady(true);
    });

    map.on('moveend', () => { if (mapData) renderMarkers(map, mapData); });

    map.on('error', () => {
      if (!offlineMode) {
        console.warn('MapTiler unavailable — switching to offline mode');
        setOfflineMode(true);
        map.setStyle(OFFLINE_STYLE);
      }
    });

    return () => {
      clearMarkers();
      map.remove();
      mapRef.current = null;
      setMapReady(false);
    };
  }, []);

  useEffect(() => {
    if (mapRef.current) mapRef.current.flyTo({ center, zoom, duration: 1000 });
  }, [center, zoom]);

  useEffect(() => {
    if (mapRef.current && mapData) renderMarkers(mapRef.current, mapData);
  }, [mapData, layers, renderMarkers]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    const sync = async () => {
      if (layers.heatmap) {
        if (!layersLoadedRef.current.heatmap) await loadHeatmap(map);
        setLayerVisibility(map, 'heatmap-layer', true);
      } else {
        setLayerVisibility(map, 'heatmap-layer', false);
      }
      if (layers.routes) {
        if (!layersLoadedRef.current.routes) await loadRoutes(map);
        setLayerVisibility(map, 'routes-layer', true);
      } else {
        setLayerVisibility(map, 'routes-layer', false);
      }
      if (layers.geofences) {
        if (!layersLoadedRef.current.geofences) await loadGeofences(map);
        setLayerVisibility(map, 'geofences-fill', true);
        setLayerVisibility(map, 'geofences-outline', true);
      } else {
        setLayerVisibility(map, 'geofences-fill', false);
        setLayerVisibility(map, 'geofences-outline', false);
      }
    };
    sync();
  }, [layers, mapReady, loadHeatmap, loadRoutes, loadGeofences, setLayerVisibility]);

  return (
    <div className={styles.mapWrapper}>
      <div ref={mapContainer} className={styles.map} />
      {offlineMode && (
        <div className={styles.offlineBanner}>
          Offline mode — start MapTiler Server at {MAP_URL} for vector tiles
        </div>
      )}
      {layers.threejs && mapReady && <ThreeOverlay map={mapRef} />}
      <MapControls />
      <MapLegend />
    </div>
  );
}