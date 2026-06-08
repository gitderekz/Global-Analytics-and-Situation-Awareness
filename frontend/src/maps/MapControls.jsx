import { useMapStore } from '../store/mapStore';
import styles from './MapControls.module.css';

export default function MapControls() {
  const { layers, toggleLayer } = useMapStore();

  const layerToggles = [
    { key: 'events', label: 'Events' },
    { key: 'assets', label: 'Assets' },
    { key: 'devices', label: 'Devices' },
    { key: 'clusters', label: 'Clusters' },
    { key: 'heatmap', label: 'Heatmap' },
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
    </div>
  );
}
