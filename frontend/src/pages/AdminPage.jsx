import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import CRUDPanel from '../components/admin/CRUDPanel';
import styles from './AdminPage.module.css';

const ENTITY_ORDER = [
  'events', 'assets', 'devices', 'alerts', 'threats', 'transactions',
  'geofences', 'routes', 'continents', 'countries', 'regions', 'cities',
  'users', 'settings', 'sensor-readings', 'notifications',
];

export default function AdminPage() {
  const { user } = useAuthStore();
  const [schemas, setSchemas] = useState({});
  const [activeEntity, setActiveEntity] = useState('events');
  const [loading, setLoading] = useState(true);

  const role = user?.Role?.name || 'Viewer';
  const canWrite = ['Super Admin', 'Admin', 'Operator'].includes(role);
  const canDelete = ['Super Admin', 'Admin'].includes(role);

  useEffect(() => {
    api.get('/admin/schema')
      .then(({ data }) => {
        if (data.success) setSchemas(data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className={styles.loading}>Loading admin panel...</div>;

  const activeSchema = schemas[activeEntity];

  return (
    <div className={styles.page}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>Data Management</h2>
          <p>CRUD operations for all platform data</p>
        </div>
        <ul className={styles.entityList}>
          {ENTITY_ORDER.filter((key) => schemas[key]).map((key) => (
            <li key={key}>
              <button
                className={`${styles.entityBtn} ${activeEntity === key ? styles.active : ''}`}
                onClick={() => setActiveEntity(key)}
              >
                {schemas[key].label}
              </button>
            </li>
          ))}
        </ul>
        <div className={styles.roleInfo}>
          Role: <strong>{role}</strong>
          {!canWrite && <span className={styles.readOnly}>Read-only</span>}
        </div>
        {canWrite && (
          <div className={styles.seedArea}>
            <button
              type="button"
              className={styles.seedButton}
              onClick={async () => {
                if (!window.confirm('This will populate sample demo data without resetting existing records. Continue?')) return;
                try {
                  const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'}/admin/demo/seed`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                  });
                  const result = await response.json();
                  if (result.success) {
                    alert('Demo data seeded successfully. Refresh the admin panel to see new records.');
                  } else {
                    alert(`Seed failed: ${result.message}`);
                  }
                } catch (err) {
                  alert('Demo seed request failed.');
                }
              }}
            >
              Seed Demo Data
            </button>
          </div>
        )}
      </div>
      <div className={styles.content}>
        {activeSchema ? (
          <CRUDPanel
            entityKey={activeEntity}
            schema={activeSchema}
            canWrite={canWrite}
            canDelete={canDelete}
          />
        ) : (
          <div className={styles.empty}>Select an entity to manage</div>
        )}
      </div>
    </div>
  );
}
