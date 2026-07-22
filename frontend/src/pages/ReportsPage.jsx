import { useEffect, useState } from 'react';
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
  const [previewUrl, setPreviewUrl] = useState('');
  const [reports, setReports] = useState([]);

  const handleExport = async (type, format) => {
    setLoading(`${type}-${format}`);
    setMessage('');
    setPreviewUrl('');

    try {
      const { data } = await api.get(`/reports/generate/${type}/${format}`);
      if (data.success) {
        if (data.data.queued) {
          setMessage(`Report generation queued (job ${data.data.jobId}). Check status on the system metrics page.`);
        } else {
          const url = `/reports/download/${data.data.fileName}`;
          if (format === 'pdf') {
            setPreviewUrl(url);
            setMessage(`PDF report ready. Preview below or download ${data.data.fileName}`);
          } else {
            const fileRes = await api.get(url, { responseType: 'blob' });
            const blobUrl = window.URL.createObjectURL(fileRes.data);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = data.data.fileName;
            a.click();
            window.URL.revokeObjectURL(blobUrl);
            setMessage(`Report downloaded: ${data.data.fileName}`);
          }
        }

        const refreshed = await api.get('/reports');
        if (refreshed.data.success) setReports(refreshed.data.data);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Export failed');
    } finally {
      setLoading(null);
    }
  };

  useEffect(() => {
    api.get('/reports')
      .then(({ data }) => {
        if (data.success) setReports(data.data);
      })
      .catch((err) => setMessage(err.response?.data?.message || 'Unable to load reports'));
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2>Reports Center</h2>
        <p>Generate and export analytics reports (CSV, Excel, PDF), and review recent generated files.</p>
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
      {reports.length > 0 && (
        <div className={styles.history}>
          <h3>Recent Exports</h3>
          <ul>
            {reports.map((report) => (
              <li key={report.id}>
                <strong>{report.name}</strong> — {report.type.toUpperCase()} — {new Date(report.generatedAt).toLocaleString()}
                <a href={`/api/v1/reports/download/${report.filePath.split('/').pop()}`} target="_blank" rel="noreferrer">Download</a>
              </li>
            ))}
          </ul>
        </div>
      )}
      {previewUrl && (
        <div className={styles.preview}>
          <h3>PDF Preview</h3>
          <iframe title="PDF Preview" src={previewUrl} />
        </div>
      )}
    </div>
  );
}
