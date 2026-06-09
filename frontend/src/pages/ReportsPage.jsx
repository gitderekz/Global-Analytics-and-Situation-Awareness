import { useState } from 'react';
import api from '../services/api';
import styles from './ReportsPage.module.css';

const REPORT_TYPES = [
  { name: 'Events Report', type: 'events', formats: ['csv', 'excel', 'pdf'] },
  { name: 'Assets Report', type: 'assets', formats: ['csv', 'excel'] },
  { name: 'Threats Report', type: 'threats', formats: ['csv', 'pdf'] },
  { name: 'Devices Report', type: 'devices', formats: ['csv', 'excel'] },
  { name: 'Alerts Report', type: 'alerts', formats: ['csv', 'pdf'] },
  { name: 'Transactions Report', type: 'transactions', formats: ['csv', 'excel'] },
];

export default function ReportsPage() {
  const [loading, setLoading] = useState(null);
  const [message, setMessage] = useState('');

  const handleExport = async (type, format) => {
    setLoading(`${type}-${format}`);
    setMessage('');
    try {
      const { data } = await api.get(`/reports/generate/${type}/${format}`);
      if (data.success) {
        const fileRes = await api.get(`/reports/download/${data.data.fileName}`, { responseType: 'blob' });
        const url = window.URL.createObjectURL(fileRes.data);
        const a = document.createElement('a');
        a.href = url;
        a.download = data.data.fileName;
        a.click();
        window.URL.revokeObjectURL(url);
        setMessage(`Report downloaded: ${data.data.fileName}`);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Export failed');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2>Reports Center</h2>
        <p>Generate and export analytics reports (CSV, Excel, PDF)</p>
      </div>
      {message && <div className={styles.message}>{message}</div>}
      <div className={styles.grid}>
        {REPORT_TYPES.map((report) => (
          <div key={report.type} className={styles.card}>
            <h3>{report.name}</h3>
            <div className={styles.formats}>
              {report.formats.map((fmt) => (
                <button
                  key={fmt}
                  className={styles.formatBtn}
                  disabled={loading === `${report.type}-${fmt}`}
                  onClick={() => handleExport(report.type, fmt)}
                >
                  {loading === `${report.type}-${fmt}` ? '...' : fmt.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
