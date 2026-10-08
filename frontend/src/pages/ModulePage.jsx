import { useEffect, useState } from 'react';
import api from '../services/api';
import MapContainer from '../maps/MapContainer';
import KPICard from '../widgets/KPICard';
import DataTable from '../widgets/DataTable';
import SimpleChart from '../widgets/SimpleChart';
import { useMapStore } from '../store/mapStore';
import styles from './ModulePage.module.css';

export default function ModulePage({
  title,
  subtitle,
  eventFilter,
  kpiConfig,
  tableConfig,
  chartEndpoint,
  chartLabelKey = 'label',
  chartValueKey = 'count',
}) {
  const [mapData, setMapData] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [kpis, setKpis] = useState(null);
  const { flyTo } = useMapStore();

  useEffect(() => {
    const load = async () => {
      try {
        const requests = [
          api.get('/analytics/map-data', { params: eventFilter }),
          api.get('/analytics/kpis', { params: eventFilter }),
        ];
        if (tableConfig?.endpoint) {
          requests.push(api.get(tableConfig.endpoint, { params: { limit: 20, ...eventFilter } }));
        }
        if (chartEndpoint) {
          requests.push(api.get(chartEndpoint));
        }

        const results = await Promise.all(requests);
        if (results[0].data.success) setMapData(results[0].data.data);
        if (results[1].data.success) setKpis(results[1].data.data);

        let idx = 2;
        if (tableConfig?.endpoint && results[idx]) {
          const key = tableConfig.dataKey || 'events';
          setTableData(results[idx].data.data[key] || results[idx].data.data || []);
          idx++;
        }
        if (chartEndpoint && results[idx]) {
          let raw = results[idx].data.data;
          if (raw && !Array.isArray(raw)) {
            raw = raw.byRisk || raw.byType || raw.byCountry || [];
          }
          const mapped = Array.isArray(raw)
            ? raw.map((d) => ({
                label: d[chartLabelKey] || d.threatType || d.eventType || d.severity || d.riskLevel,
                count: d[chartValueKey] || d.count || 0,
              }))
            : [];
          setChartData(mapped);
        }
      } catch (err) {
        console.error(`Failed to load ${title} data:`, err);
      }
    };
    load();
  }, [title, eventFilter, tableConfig, chartEndpoint, chartLabelKey, chartValueKey]);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>

      {kpiConfig && (
        <div className={styles.kpis}>
          {kpiConfig.map((kpi) => (
            <KPICard key={kpi.title} title={kpi.title} value={kpis?.[kpi.key]} icon={kpi.icon} color={kpi.color} />
          ))}
        </div>
      )}

      <div className={styles.content}>
        <div className={styles.mapArea}>
          <MapContainer mapData={mapData} />
        </div>
        <div className={styles.sidePanel}>
          <SimpleChart data={chartData} title="Analytics" labelKey="label" valueKey="count" />
          {tableConfig && (
            <div className={styles.tableSection}>
              <div className={styles.tableTitle}>{tableConfig.title || 'Data'}</div>
              <DataTable
                columns={tableConfig.columns}
                data={tableData}
                onRowClick={(row) => {
                  if (row.latitude && row.longitude) {
                    flyTo(parseFloat(row.longitude), parseFloat(row.latitude), 10);
                  }
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
