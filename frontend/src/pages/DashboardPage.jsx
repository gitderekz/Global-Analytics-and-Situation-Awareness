import { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import MapContainer from '../maps/MapContainer';
import KPICard from '../widgets/KPICard';
import DataTable from '../widgets/DataTable';
import SimpleChart from '../widgets/SimpleChart';
import { useEventStore } from '../store/eventStore';
import { useAlertStore } from '../store/alertStore';
import { useMapStore } from '../store/mapStore';
import styles from './DashboardPage.module.css';

const severityBadge = (severity) => (
  <span className={`${styles.badge} ${styles[severity?.toLowerCase()]}`}>{severity}</span>
);

export default function DashboardPage() {
  const [kpis, setKpis] = useState(null);
  const [mapData, setMapData] = useState(null);
  const [severityData, setSeverityData] = useState([]);
  const [timeSeries, setTimeSeries] = useState([]);
  const { events, fetchEvents } = useEventStore();
  const { alerts, fetchAlerts } = useAlertStore();
  const { flyTo } = useMapStore();

  const loadData = useCallback(async () => {
    try {
      const [kpiRes, mapRes, sevRes, tsRes] = await Promise.all([
        api.get('/analytics/kpis'),
        api.get('/analytics/map-data'),
        api.get('/analytics/severity'),
        api.get('/analytics/time-series', { params: { days: 7 } }),
      ]);
      if (kpiRes.data.success) setKpis(kpiRes.data.data);
      if (mapRes.data.success) setMapData(mapRes.data.data);
      if (sevRes.data.success) setSeverityData(sevRes.data.data.map((d) => ({ label: d.severity, count: d.count })));
      if (tsRes.data.success) setTimeSeries(tsRes.data.data.map((d) => ({ label: d.date.slice(5), count: d.count })));
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    }
  }, []);

  useEffect(() => {
    loadData();
    fetchEvents({ limit: 10 });
    fetchAlerts();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [loadData, fetchEvents, fetchAlerts]);

  const eventColumns = [
    { key: 'id', label: 'ID' },
    { key: 'eventType', label: 'Type' },
    { key: 'severity', label: 'Severity', render: (row) => severityBadge(row.severity) },
    { key: 'status', label: 'Status' },
    { key: 'country', label: 'Location' },
    { key: 'createdAt', label: 'Time', render: (row) => new Date(row.createdAt).toLocaleString() },
  ];

  const handleRowClick = (row) => {
    if (row.latitude && row.longitude) {
      flyTo(parseFloat(row.longitude), parseFloat(row.latitude), 10);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.kpis}>
        <KPICard title="Total Events" value={kpis?.totalEvents} icon="⚡" />
        <KPICard title="Active Assets" value={kpis?.activeAssets} icon="📍" color="var(--success)" />
        <KPICard title="Critical Alerts" value={kpis?.criticalAlerts} icon="🚨" color="var(--danger)" />
        <KPICard title="Connected Devices" value={kpis?.connectedDevices} icon="📡" />
        <KPICard title="Threat Count" value={kpis?.threatCount} icon="🛡" color="var(--high-risk)" />
        <KPICard title="Countries Active" value={kpis?.countriesActive} icon="🌍" />
      </div>

      <div className={styles.mapSection}>
        <MapContainer mapData={mapData} onObjectClick={(obj) => {
          if (obj.lat && obj.lng) flyTo(obj.lng, obj.lat, 10);
        }} />
      </div>

      <div className={styles.widgets}>
        <div className={styles.widget}>
          <SimpleChart data={severityData} title="Severity Distribution" labelKey="label" valueKey="count" />
        </div>
        <div className={styles.widget}>
          <SimpleChart data={timeSeries} title="Events (7 Days)" labelKey="label" valueKey="count" />
        </div>
        <div className={styles.widgetWide}>
          <div className={styles.widgetTitle}>Recent Events</div>
          <DataTable columns={eventColumns} data={events.slice(0, 8)} onRowClick={handleRowClick} />
        </div>
        <div className={styles.widget}>
          <div className={styles.widgetTitle}>Active Alerts ({alerts.filter((a) => a.status !== 'Resolved').length})</div>
          <DataTable
            columns={[
              { key: 'title', label: 'Alert' },
              { key: 'severity', label: 'Severity', render: (row) => severityBadge(row.severity) },
              { key: 'status', label: 'Status' },
            ]}
            data={alerts.slice(0, 5)}
          />
        </div>
      </div>
    </div>
  );
}
