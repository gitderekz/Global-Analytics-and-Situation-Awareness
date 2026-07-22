import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import api from '../../services/api';
import styles from './GeofenceEditor.module.css';

export default function GeofenceEditor({ geofenceId, open, onClose, onChange }) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markerRefs = useRef([]);
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(false);

  const clearMarkers = () => {
    markerRefs.current.forEach((marker) => marker.remove());
    markerRefs.current = [];
  };

  useEffect(() => {
    if (!open) {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      setPoints([]);
      return;
    }

    let mounted = true;
    const fetchPoints = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/admin/geofence-points/by-geofence/${geofenceId}`);
        if (data.success && mounted) {
          setPoints(data.data || []);
        }
      } catch (err) {
        console.error('Failed to load geofence points', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchPoints();

    if (!mapRef.current) {
      mapRef.current = new maplibregl.Map({
        container: mapContainer.current,
        style: 'https://demotiles.maplibre.org/style.json',
        center: [0, 0],
        zoom: 2,
      });
      mapRef.current.addControl(new maplibregl.NavigationControl(), 'top-right');
    }

    return () => {
      mounted = false;
    };
  }, [open, geofenceId]);

  const addPoint = async (lat, lng) => {
    try {
      const seq = points.length + 1;
      await api.post('/admin/geofence-points', { geofenceId, latitude: lat, longitude: lng, sequence: seq });
      const { data } = await api.get(`/admin/geofence-points/by-geofence/${geofenceId}`);
      if (data.success) setPoints(data.data || []);
      if (onChange) onChange();
    } catch (err) {
      console.error('Add point failed', err);
    }
  };

  const removePoint = async (id) => {
    if (!window.confirm('Delete this point?')) return;
    try {
      await api.delete(`/admin/geofence-points/${id}`);
      const { data } = await api.get(`/admin/geofence-points/by-geofence/${geofenceId}`);
      if (data.success) setPoints(data.data || []);
      if (onChange) onChange();
    } catch (err) {
      console.error('Delete point failed', err);
    }
  };

  const handleMapClick = (e) => {
    const { lngLat } = e;
    addPoint(lngLat.lat, lngLat.lng);
  };

  useEffect(() => {
    if (!open || !mapRef.current) return;
    const map = mapRef.current;
    map.off('click', handleMapClick);
    map.on('click', handleMapClick);

    clearMarkers();

    if (points.length) {
      const bounds = new maplibregl.LngLatBounds();
      points.forEach((p) => bounds.extend([p.longitude, p.latitude]));
      map.fitBounds(bounds, { padding: 40, maxZoom: 16, duration: 400 });
    }

    points.forEach((p) => {
      const el = document.createElement('div');
      el.className = 'geo-marker';
      el.style.width = '14px';
      el.style.height = '14px';
      el.style.background = '#ff5722';
      el.style.borderRadius = '50%';
      el.style.border = '2px solid white';
      el.title = `#${p.sequence}`;
      el.onclick = (ev) => {
        ev.stopPropagation();
        removePoint(p.id);
      };
      const marker = new maplibregl.Marker(el).setLngLat([p.longitude, p.latitude]).addTo(map);
      markerRefs.current.push(marker);
    });

    return () => {
      map.off('click', handleMapClick);
    };
  }, [open, points]);

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <h3>Geofence Points Editor</h3>
        <div className={styles.body}>
          <div className={styles.map} ref={mapContainer} />
          <div className={styles.sidebar}>
            <div className={styles.instructions}>Click on the map to add a point. Click a marker to delete.</div>
            {loading ? <div>Loading points...</div> : (
              <ol className={styles.pointsList}>
                {points.map((p) => (
                  <li key={p.id}>
                    #{p.sequence} — {p.latitude.toFixed(6)}, {p.longitude.toFixed(6)}
                    <button className={styles.del} onClick={() => removePoint(p.id)}>Delete</button>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
        <div className={styles.actions}>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
