import ModulePage from './ModulePage';

export default function LogisticsPage() {
  return (
    <ModulePage
      title="Logistics Control Center"
      subtitle="Fleet and supply chain tracking"
      eventFilter={{ eventType: 'Asset Movement' }}
      kpiConfig={[
        { title: 'Active Assets', key: 'activeAssets', icon: '🚛', color: 'var(--success)' },
        { title: 'Total Events', key: 'totalEvents', icon: '⚡' },
        { title: 'Countries Active', key: 'countriesActive', icon: '🌍' },
      ]}
      mapDataTransform={(payload) => ({
        events: payload?.events || { type: 'FeatureCollection', features: [] },
        assets: payload?.assets || { type: 'FeatureCollection', features: [] },
        devices: { type: 'FeatureCollection', features: [] },
      })}
      tableConfig={{
        title: 'Fleet Assets',
        endpoint: '/assets',
        dataKey: 'assets',
        columns: [
          { key: 'name', label: 'Asset' },
          { key: 'assetType', label: 'Type' },
          { key: 'status', label: 'Status' },
          { key: 'speed', label: 'Speed' },
        ],
      }}
      chartEndpoint="/analytics/severity"
      chartLabelKey="severity"
      chartValueKey="count"
    />
  );
}
