import ModulePage from './ModulePage';

export default function FraudPage() {
  return (
    <ModulePage
      title="Financial Fraud Detection"
      subtitle="Transaction risk analysis and fraud clusters"
      eventFilter={{ eventType: 'Fraud' }}
      kpiConfig={[
        { title: 'Total Events', key: 'totalEvents', icon: '💳' },
        { title: 'Critical Alerts', key: 'criticalAlerts', icon: '🚨', color: 'var(--danger)' },
        { title: 'Open Alerts', key: 'openAlerts', icon: '⚠', color: 'var(--warning)' },
      ]}
      mapDataTransform={(payload) => ({
        events: payload?.events || { type: 'FeatureCollection', features: [] },
        assets: { type: 'FeatureCollection', features: [] },
        devices: { type: 'FeatureCollection', features: [] },
      })}
      tableConfig={{
        title: 'Fraud Events',
        endpoint: '/events',
        dataKey: 'events',
        columns: [
          { key: 'title', label: 'Incident' },
          { key: 'severity', label: 'Risk' },
          { key: 'country', label: 'Location' },
          { key: 'status', label: 'Status' },
        ],
      }}
      chartEndpoint="/analytics/fraud"
      chartLabelKey="riskLevel"
      chartValueKey="count"
    />
  );
}
