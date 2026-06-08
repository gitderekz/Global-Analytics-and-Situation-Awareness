import ModulePage from './ModulePage';

export default function EmergencyPage() {
  return (
    <ModulePage
      title="Emergency Response"
      subtitle="Incident management and crisis coordination"
      eventFilter={{ eventType: 'Emergency' }}
      kpiConfig={[
        { title: 'Critical Alerts', key: 'criticalAlerts', icon: '🚨', color: 'var(--danger)' },
        { title: 'Open Alerts', key: 'openAlerts', icon: '⚠', color: 'var(--high-risk)' },
        { title: 'Events Today', key: 'eventsToday', icon: '📅' },
      ]}
      tableConfig={{
        title: 'Active Incidents',
        endpoint: '/events',
        dataKey: 'events',
        columns: [
          { key: 'title', label: 'Incident' },
          { key: 'severity', label: 'Severity' },
          { key: 'status', label: 'Status' },
          { key: 'city', label: 'Location' },
        ],
      }}
      chartEndpoint="/analytics/severity"
      chartLabelKey="severity"
      chartValueKey="count"
    />
  );
}
