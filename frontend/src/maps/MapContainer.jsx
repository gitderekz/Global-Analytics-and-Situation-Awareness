import { useEffect, useRef, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import Supercluster from 'supercluster';
import { useMapStore } from '../store/mapStore';
import MapControls from './MapControls';
import MapLegend from './MapLegend';
import styles from './MapContainer.module.css';

const MAP_URL = import.meta.env.VITE_MAP_URL || 'http://localhost:3650';

const SEVERITY_COLORS = {
  Info: '#3b82f6',
  Low: '#22c55e',
  Medium: '#eab308',
  High: '#f97316',
  Critical: '#ef4444',
};

export default function MapContainer({ mapData, onObjectClick }) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const clusterRef = useRef(null);
  const markersRef = useRef([]);
  const { center, zoom, layers, flyTo, setSelectedObject } = useMapStore();

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
  }, []);

  const renderMarkers = useCallback((map, data) => {
    clearMarkers();
    if (!data) return;

    const features = [];
    if (layers.events && data.events?.features) features.push(...data.events.features);
    if (layers.assets && data.assets?.features) features.push(...data.assets.features);
    if (layers.devices && data.devices?.features) features.push(...data.devices.features);

    if (features.length === 0) return;

    if (layers.clusters && features.length > 50) {
      if (!clusterRef.current) {
        clusterRef.current = new Supercluster({ radius: 60, maxZoom: 16 });
      }
      clusterRef.current.load(features);

      const bounds = map.getBounds();
      const clusters = clusterRef.current.getClusters(
        [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()],
        Math.floor(map.getZoom())
      );

      clusters.forEach((feature) => {
        const [lng, lat] = feature.geometry.coordinates;
        const el = document.createElement('div');

        if (feature.properties.cluster) {
          el.className = styles.cluster;
          el.textContent = feature.properties.point_count;
          el.addEventListener('click', () => {
            const expansionZoom = clusterRef.current.getClusterExpansionZoom(feature.properties.cluster_id);
            map.flyTo({ center: [lng, lat], zoom: expansionZoom });
          });
        } else {
          const color = feature.properties.color || SEVERITY_COLORS[feature.properties.severity] || '#3b82f6';
          el.className = styles.marker;
          el.style.backgroundColor = color;
          el.style.boxShadow = `0 0 8px ${color}80`;
          if (feature.properties.severity === 'Critical') {
            el.classList.add(styles.pulse);
          }
          el.addEventListener('click', () => {
            setSelectedObject(feature.properties);
            onObjectClick?.(feature.properties);
            new maplibregl.Popup({ offset: 15 })
              .setLngLat([lng, lat])
              .setHTML(`
                <div style="min-width:180px">
                  <strong>${feature.properties.name || 'Unknown'}</strong><br/>
                  <span style="color:#8b9cb3">Type: ${feature.properties.type}</span><br/>
                  ${feature.properties.severity ? `<span style="color:${color}">Severity: ${feature.properties.severity}</span><br/>` : ''}
                  ${feature.properties.status ? `<span>Status: ${feature.properties.status}</span>` : ''}
                </div>
              `)
              .addTo(map);
          });
        }

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([lng, lat])
          .addTo(map);
        markersRef.current.push(marker);
      });
    } else {
      features.forEach((feature) => {
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
          new maplibregl.Popup({ offset: 15 })
            .setLngLat([lng, lat])
            .setHTML(`
              <div style="min-width:180px">
                <strong>${feature.properties.name || 'Unknown'}</strong><br/>
                <span style="color:#8b9cb3">Type: ${feature.properties.type}</span><br/>
                ${feature.properties.severity ? `<span style="color:${color}">Severity: ${feature.properties.severity}</span>` : ''}
              </div>
            `)
            .addTo(map);
        });

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([lng, lat])
          .addTo(map);
        markersRef.current.push(marker);
      });
    }
  }, [clearMarkers, layers, onObjectClick, setSelectedObject]);

  useEffect(() => {
    if (mapRef.current || !mapContainer.current) return;

    const styleUrl = `${MAP_URL}/styles/basic/style.json`;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: styleUrl,
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
    });

    map.on('moveend', () => {
      if (mapData) renderMarkers(map, mapData);
    });

    map.on('error', (e) => {
      if (e.error?.message?.includes('Failed to fetch')) {
        console.warn('MapTiler not available, using fallback style');
        map.setStyle({
          version: 8,
          sources: {
            osm: {
              type: 'raster',
              tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
              tileSize: 256,
              attribution: '© OpenStreetMap (fallback)',
            },
          },
          layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
        });
      }
    });

    return () => {
      clearMarkers();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.flyTo({ center, zoom, duration: 1000 });
    }
  }, [center, zoom]);

  useEffect(() => {
    if (mapRef.current && mapData) {
      renderMarkers(mapRef.current, mapData);
    }
  }, [mapData, layers, renderMarkers]);

  return (
    <div className={styles.mapWrapper}>
      <div ref={mapContainer} className={styles.map} />
      <MapControls map={mapRef} />
      <MapLegend />
    </div>
  );
}
