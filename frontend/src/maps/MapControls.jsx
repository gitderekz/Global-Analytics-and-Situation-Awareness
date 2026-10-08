import { useMapStore } from '../store/mapStore';
import styles from './MapControls.module.css';

export default function MapControls({ onResetNorth, projectionMode, onToggleProjection }) {
  const { layers, toggleLayer } = useMapStore();

  const layerToggles = [
    { key: 'events', label: 'Events' },
    { key: 'assets', label: 'Assets' },
    { key: 'devices', label: 'Devices' },
    { key: 'clusters', label: 'Clusters' },
    { key: 'heatmap', label: 'Heatmap' },
    { key: 'routes', label: 'Routes' },
    { key: 'geofences', label: 'Geofences' },
    { key: 'threejs', label: '3D View' },
  ];

  return (
    <div className={styles.controls}>
      {layerToggles.map(({ key, label }) => (
        <button
          key={key}
          className={`${styles.btn} ${layers[key] ? styles.active : ''}`}
          onClick={() => toggleLayer(key)}
        >
          {label}
        </button>
      ))}
      <button type="button" className={styles.btn} onClick={onResetNorth}>
        Reset North
      </button>
      <button type="button" className={styles.btn} onClick={onToggleProjection}>
        {projectionMode === 'globe' ? 'Enable Mercator' : 'Enable Globe'}
      </button>
    </div>
  );
}
