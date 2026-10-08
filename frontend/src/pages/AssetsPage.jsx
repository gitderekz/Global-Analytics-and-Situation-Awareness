import ModulePage from './ModulePage';

export default function AssetsPage() {
  return (
    <ModulePage
      title="Live Asset Tracking"
      subtitle="Fleet, aircraft, ships, and container monitoring"
      kpiConfig={[
        { title: 'Active Assets', key: 'activeAssets', icon: '📍', color: 'var(--success)' },
        { title: 'Total Events', key: 'totalEvents', icon: '⚡' },
        { title: 'Countries Active', key: 'countriesActive', icon: '🌍' },
      ]}
      mapDataTransform={(payload) => ({
        events: { type: 'FeatureCollection', features: [] },
        assets: payload?.assets || { type: 'FeatureCollection', features: [] },
        devices: { type: 'FeatureCollection', features: [] },
      })}
      tableConfig={{
        title: 'Tracked Assets',
        endpoint: '/assets',
        dataKey: 'assets',
        columns: [
          { key: 'name', label: 'Name' },
          { key: 'assetType', label: 'Type' },
          { key: 'status', label: 'Status' },
          { key: 'speed', label: 'Speed', render: (row) => row.speed ? `${row.speed} km/h` : '—' },
        ],
      }}
      chartEndpoint="/analytics/severity"
      chartLabelKey="severity"
      chartValueKey="count"
    />
  );
}
