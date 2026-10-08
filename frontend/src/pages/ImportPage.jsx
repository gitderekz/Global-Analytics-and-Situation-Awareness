import { useMemo, useState } from 'react';
import api from '../services/api';
import styles from './ImportPage.module.css';

const IMPORT_TYPES = [
  { label: 'Events', value: 'events' },
  { label: 'Assets', value: 'assets' },
  { label: 'Devices', value: 'devices' },
  { label: 'Alerts', value: 'alerts' },
  { label: 'Threats', value: 'threats' },
  { label: 'Transactions', value: 'transactions' },
  { label: 'Users', value: 'users' },
  { label: 'Notifications', value: 'notifications' },
  { label: 'Geofences', value: 'geofences' },
  { label: 'Routes', value: 'routes' },
];

const sampleHints = {
  events: 'title, eventType, severity, status, latitude, longitude, country, city',
  assets: 'name, assetType, status, latitude, longitude, speed, heading',
  devices: 'deviceId, name, deviceType, status, latitude, longitude',
  alerts: 'title, severity, status, eventId',
  threats: 'threatType, sourceIp, destinationIp, country, severity, status',
  transactions: 'transactionId, amount, currency, riskLevel, status, latitude, longitude',
  users: 'firstName, lastName, email, password, roleId, status',
  notifications: 'userId, title, message, type, isRead',
  geofences: 'name, type, description, active, points',
  routes: 'name, status, points',
};

export default function ImportPage() {
  const [type, setType] = useState('events');
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const sampleColumns = useMemo(() => sampleHints[type] || sampleHints.events, [type]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setStatus('Please select a file to upload.');
      return;
    }
    setStatus('');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await api.post(`/import/upload/${type}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (data.success) {
        setStatus(`Imported ${data.data.imported} records for ${type}. File: ${data.data.file}`);
      } else {
        setStatus(data.message || 'Import failed');
      }
    } catch (err) {
      setStatus(err.response?.data?.message || 'Import failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2>Data Import</h2>
        <p>Upload CSV or GeoJSON files to add platform data from external sources.</p>
      </div>

      <div className={styles.summaryRow}>
        <div className={styles.summaryCard}>
          <span>Accepted</span>
          <strong>CSV / GeoJSON</strong>
        </div>
        <div className={styles.summaryCard}>
          <span>Current Type</span>
          <strong>{IMPORT_TYPES.find((opt) => opt.value === type)?.label || type}</strong>
        </div>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label>
          Import type
          <select value={type} onChange={(e) => setType(e.target.value)}>
            {IMPORT_TYPES.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>

        <label>
          File upload
          <input type="file" accept=".csv,.tsv,.json,.geojson" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </label>

        <div className={styles.hintBox}>
          <strong>Expected columns</strong>
          <span>{sampleColumns}</span>
        </div>

        <div className={styles.actions}>
          <button type="submit" disabled={loading}>{loading ? 'Uploading…' : 'Upload and Import'}</button>
        </div>
      </form>

      {status && <div className={styles.status}>{status}</div>}
    </div>
  );
}
