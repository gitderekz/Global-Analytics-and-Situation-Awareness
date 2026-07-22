import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import api from '../../services/api';
import styles from './RoutePlayback.module.css';

export default function RoutePlayback({ routeId, assetId, onClose }) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [route, setRoute] = useState(null);
  const [points, setPoints] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [loading, setLoading] = useState(true);
  const playbackRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    const loadRoute = async () => {
      try {
        const { data: routeData } = await api.get(`/admin/routes/${routeId}`);
        if (routeData.success && mounted) {
          setRoute(routeData.data);
        }

        const { data: pointsData } = await api.get(`/admin/route-points?routeId=${routeId}`);
        if (pointsData.success && mounted) {
          const sorted = (pointsData.data || []).sort((a, b) => a.sequence - b.sequence);
          setPoints(sorted);
          setCurrentIndex(0);
        }
      } catch (err) {
        console.error('Failed to load route', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadRoute();

    return () => {
      mounted = false;
    };
  }, [routeId]);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    mapRef.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [0, 0],
      zoom: 10,
    });

    mapRef.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || points.length === 0) return;

    const map = mapRef.current;

    // Draw route polyline
    if (map.getSource('route-source')) {
      map.removeLayer('route-layer');
      map.removeSource('route-source');
    }

    const lineCoordinates = points.map((p) => [p.longitude, p.latitude]);
    map.addSource('route-source', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: { type: 'LineString', coordinates: lineCoordinates },
            properties: {},
          },
        ],
      },
    });

    map.addLayer({
      id: 'route-layer',
      type: 'line',
      source: 'route-source',
      paint: { 'line-color': '#3b82f6', 'line-width': 3, 'line-opacity': 0.7 },
      layout: { 'line-cap': 'round', 'line-join': 'round' },
    });

    if (points.length >= 2) {
      const bounds = new maplibregl.LngLatBounds();
      points.forEach((p) => bounds.extend([p.longitude, p.latitude]));
      map.fitBounds(bounds, { padding: 50, duration: 800 });
    }
  }, [points]);

  useEffect(() => {
    if (!isPlaying || !mapRef.current || points.length === 0) return;

    const playFrame = () => {
      if (currentIndex >= points.length) {
        setIsPlaying(false);
        return;
      }

      const point = points[currentIndex];
      const map = mapRef.current;

      if (!markerRef.current) {
        const el = document.createElement('div');
        el.style.width = '24px';
        el.style.height = '24px';
        el.style.background = '#ef4444';
        el.style.borderRadius = '50%';
        el.style.border = '3px solid white';
        el.style.boxShadow = '0 0 8px rgba(239, 68, 68, 0.5)';
        markerRef.current = new maplibregl.Marker({ element: el }).addTo(map);
      }

      markerRef.current.setLngLat([point.longitude, point.latitude]);
      map.flyTo({ center: [point.longitude, point.latitude], duration: 100, zoom: 14 });

      setCurrentIndex(currentIndex + 1);
      playbackRef.current = setTimeout(playFrame, 1000 / speed);
    };

    playbackRef.current = setTimeout(playFrame, 1000 / speed);

    return () => {
      if (playbackRef.current) clearTimeout(playbackRef.current);
    };
  }, [isPlaying, currentIndex, points, speed]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentIndex(0);
    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }
  };

  const handleSpeedChange = (e) => {
    setSpeed(parseFloat(e.target.value));
  };

  const currentPoint = points[currentIndex] || points[0];
  const progress = points.length > 0 ? ((currentIndex + 1) / points.length) * 100 : 0;

  if (loading) {
    return (
      <div className={styles.modal}>
        <div className={styles.dialog}>
          <div>Loading route...</div>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.modal} onClick={onClose}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>Route Playback {route?.name}</h3>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div className={styles.mapContainer} ref={mapContainer} />
        <div className={styles.controls}>
          <div className={styles.playback}>
            <button onClick={handleReset} className={styles.btn}>⟲ Reset</button>
            <button onClick={handlePlayPause} className={styles.btn}>
              {isPlaying ? '⏸ Pause' : '▶ Play'}
            </button>
            <select value={speed} onChange={handleSpeedChange} className={styles.speedSelect}>
              <option value={0.5}>0.5x</option>
              <option value={1}>1x</option>
              <option value={2}>2x</option>
              <option value={5}>5x</option>
            </select>
          </div>
          <div className={styles.info}>
            <span>Point {currentIndex + 1} / {points.length}</span>
            {currentPoint && (
              <span>
                {currentPoint.latitude.toFixed(6)}, {currentPoint.longitude.toFixed(6)}
              </span>
            )}
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progress} style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
