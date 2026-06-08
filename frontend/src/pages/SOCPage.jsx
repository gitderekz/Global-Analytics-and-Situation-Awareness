import ModulePage from './ModulePage';

export default function SOCPage() {
  return (
    <ModulePage
      title="Cyber Security SOC"
      subtitle="Threat detection and attack monitoring"
      eventFilter={{ eventType: 'Cyber Attack' }}
      kpiConfig={[
        { title: 'Threat Count', key: 'threatCount', icon: '🛡', color: 'var(--high-risk)' },
        { title: 'Critical Alerts', key: 'criticalAlerts', icon: '🚨', color: 'var(--danger)' },
        { title: 'Total Events', key: 'totalEvents', icon: '⚡' },
      ]}
      tableConfig={{
        title: 'Security Events',
        endpoint: '/events',
        dataKey: 'events',
        columns: [
          { key: 'title', label: 'Threat' },
          { key: 'severity', label: 'Severity' },
          { key: 'status', label: 'Status' },
          { key: 'country', label: 'Origin' },
        ],
      }}
      chartEndpoint="/analytics/threats"
      chartLabelKey="threatType"
      chartValueKey="count"
    />
  );
}
