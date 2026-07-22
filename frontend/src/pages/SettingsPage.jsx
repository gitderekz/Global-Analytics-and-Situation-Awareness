import { useEffect, useState } from 'react';
import api from '../services/api';
import { useSettingsStore } from '../store/settingsStore';
import styles from './SettingsPage.module.css';

export default function SettingsPage() {
  const settings = useSettingsStore();
  const [mbtilesStatus, setMbtilesStatus] = useState(null);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const loadMbtilesStatus = async () => {
    setCheckingStatus(true);
    try {
      const { data } = await api.get('/tiles/status');
      if (data.success) setMbtilesStatus(data.data);
      else setMbtilesStatus(null);
    } catch (err) {
      setMbtilesStatus(null);
    } finally {
      setCheckingStatus(false);
    }
  };

  useEffect(() => {
    loadMbtilesStatus();
  }, []);

  return (
    <div className={styles.page}>
      <h2>Settings</h2>
      <div className={styles.section}>
        <h3>Appearance</h3>
        <div className={styles.field}>
          <label htmlFor="theme-select">Theme</label>
          <select id="theme-select" value={settings.theme} onChange={(e) => settings.setTheme(e.target.value)}>
            <option value="dark">Dark</option>
            <option value="light">Light</option>
            <option value="system">System</option>
          </select>
        </div>
        <div className={styles.field}>
          <label htmlFor="language-select">Language</label>
          <select id="language-select" value={settings.language} onChange={(e) => settings.setLanguage(e.target.value)}>
            <option value="en">English</option>
            <option value="sw">Swahili</option>
            <option value="fr">French</option>
          </select>
        </div>
      </div>
      <div className={styles.section}>
        <h3>Accessibility</h3>
        <div className={styles.field}>
          <label htmlFor="high-contrast">
            <input
              id="high-contrast"
              type="checkbox"
              checked={settings.highContrast}
              onChange={(e) => settings.setHighContrast(e.target.checked)}
            />
            High Contrast Mode
          </label>
        </div>
        <div className={styles.field}>
          <label htmlFor="reduced-motion">
            <input
              id="reduced-motion"
              type="checkbox"
              checked={settings.reducedMotion}
              onChange={(e) => settings.setReducedMotion(e.target.checked)}
            />
            Reduce Motion
          </label>
        </div>
        <div className={styles.field}>
          <label htmlFor="font-size">Font Size</label>
          <select id="font-size" value={settings.fontSize} onChange={(e) => settings.setFontSize(e.target.value)}>
            <option value="small">Small</option>
            <option value="normal">Normal</option>
            <option value="large">Large</option>
            <option value="xlarge">Extra Large</option>
          </select>
        </div>
      </div>
      <div className={styles.section}>
        <h3>Map Defaults</h3>
        <div className={styles.field}>
          <label htmlFor="map-mode">Map Mode</label>
          <select id="map-mode" value={settings.mapMode} onChange={(e) => settings.setMapMode(e.target.value)}>
            <option value="offline">Offline / MBTiles</option>
            <option value="osm">Online: OpenStreetMap</option>
            <option value="maptiler">Online: MapTiler Server</option>
          </select>
        </div>
        <div className={styles.field}>
          <label htmlFor="map-url">Map Server URL</label>
          <input id="map-url" type="text" defaultValue={import.meta.env.VITE_MAP_URL} readOnly />
        </div>
        <div className={styles.field}>
          <label>Offline Tile Status</label>
          <div className={styles.statusCard}>
            <p>
              <strong>MBTiles service:</strong>{' '}
              {checkingStatus ? 'Checking...' : mbtilesStatus?.enabled ? 'Available' : 'Unavailable'}
            </p>
            <p>{mbtilesStatus?.hasFile ? 'MBTiles file is registered on the backend.' : 'No MBTiles file found.'}</p>
            {mbtilesStatus?.metadata?.format && (
              <p>Format: {mbtilesStatus.metadata.format}</p>
            )}
            <button type="button" className={styles.actionButton} onClick={loadMbtilesStatus} disabled={checkingStatus}>
              Refresh Status
            </button>
          </div>
        </div>
        <div className={styles.field}>
          <label htmlFor="mbtiles-upload">Upload MBTiles</label>
          <input id="mbtiles-upload" type="file" accept=".mbtiles" onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setUploadError('');
            const formData = new FormData();
            formData.append('mbtiles', file);
            try {
              const resp = await api.post('/tiles/upload', formData);
              const data = resp.data;
              if (data?.success) {
                await loadMbtilesStatus();
                alert('MBTiles uploaded successfully. Switch to offline mode to use it.');
              } else {
                setUploadError(`Upload failed: ${data?.message || resp.statusText}`);
              }
            } catch (err) {
              setUploadError('Failed to upload MBTiles.');
            }
          }} />
          <small>Upload a local `.mbtiles` file for offline map tiles.</small>
          {uploadError && <p className={styles.errorText}>{uploadError}</p>}
        </div>
      </div>
      <div className={styles.section}>
        <h3>API Configuration</h3>
        <div className={styles.field}>
          <label htmlFor="api-url">API URL</label>
          <input id="api-url" type="text" defaultValue={import.meta.env.VITE_API_URL} readOnly />
        </div>
      </div>
    </div>
  );
}
