import ModulePage from './ModulePage';

export default function IoTPage() {
  return (
    <ModulePage
      title="IoT Monitoring"
      subtitle="Sensor, gateway, and device telemetry"
      eventFilter={{ eventType: 'Sensor Alert' }}
      kpiConfig={[
        { title: 'Connected Devices', key: 'connectedDevices', icon: '📡', color: 'var(--success)' },
        { title: 'Total Events', key: 'totalEvents', icon: '⚡' },
        { title: 'Open Alerts', key: 'openAlerts', icon: '⚠', color: 'var(--warning)' },
      ]}
      mapDataTransform={(payload) => ({
        events: payload?.events || { type: 'FeatureCollection', features: [] },
        assets: { type: 'FeatureCollection', features: [] },
        devices: payload?.devices || { type: 'FeatureCollection', features: [] },
      })}
      tableConfig={{
        title: 'IoT Devices',
        endpoint: '/devices',
        dataKey: 'devices',
        columns: [
          { key: 'deviceId', label: 'ID' },
          { key: 'name', label: 'Name' },
          { key: 'deviceType', label: 'Type' },
          { key: 'status', label: 'Status' },
        ],
      }}
      chartEndpoint="/analytics/severity"
      chartLabelKey="severity"
      chartValueKey="count"
    />
  );
}
