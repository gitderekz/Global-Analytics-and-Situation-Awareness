import ModulePage from './ModulePage';

export default function NetworkPage() {
  return (
    <ModulePage
      title="Network Monitoring"
      subtitle="Infrastructure and NOC dashboard"
      eventFilter={{ eventType: 'Network Outage' }}
      kpiConfig={[
        { title: 'Connected Devices', key: 'connectedDevices', icon: '📡' },
        { title: 'Network Status', key: 'networkStatus', icon: '🌐', color: 'var(--success)' },
        { title: 'Open Alerts', key: 'openAlerts', icon: '⚠', color: 'var(--warning)' },
      ]}
      mapDataTransform={(payload) => ({
        events: payload?.events || { type: 'FeatureCollection', features: [] },
        assets: { type: 'FeatureCollection', features: [] },
        devices: payload?.devices || { type: 'FeatureCollection', features: [] },
      })}
      tableConfig={{
        title: 'Network Devices',
        endpoint: '/devices',
        dataKey: 'devices',
        columns: [
          { key: 'name', label: 'Device' },
          { key: 'deviceType', label: 'Type' },
          { key: 'status', label: 'Status' },
          { key: 'lastSeen', label: 'Last Seen', render: (row) => row.lastSeen ? new Date(row.lastSeen).toLocaleString() : '—' },
        ],
      }}
      chartEndpoint="/analytics/severity"
      chartLabelKey="severity"
      chartValueKey="count"
    />
  );
}
