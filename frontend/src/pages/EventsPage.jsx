import ModulePage from './ModulePage';

const severityBadge = (severity) => (
  <span style={{
    padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600,
    background: severity === 'Critical' ? 'rgba(239,68,68,0.2)' : 'rgba(59,130,246,0.2)',
    color: severity === 'Critical' ? '#ef4444' : '#3b82f6',
  }}>{severity}</span>
);

export default function EventsPage() {
  return (
    <ModulePage
      title="Global Event Monitoring"
      subtitle="Real-time event tracking and analysis"
      kpiConfig={[
        { title: 'Total Events', key: 'totalEvents', icon: '⚡' },
        { title: 'Events Today', key: 'eventsToday', icon: '📅' },
        { title: 'Critical Alerts', key: 'criticalAlerts', icon: '🚨', color: 'var(--danger)' },
      ]}
      tableConfig={{
        title: 'Recent Events',
        endpoint: '/events',
        dataKey: 'events',
        columns: [
          { key: 'eventType', label: 'Type' },
          { key: 'title', label: 'Title' },
          { key: 'severity', label: 'Severity', render: (row) => severityBadge(row.severity) },
          { key: 'status', label: 'Status' },
          { key: 'country', label: 'Location' },
        ],
      }}
      chartEndpoint="/analytics/event-types"
      chartLabelKey="eventType"
      chartValueKey="count"
    />
  );
}
