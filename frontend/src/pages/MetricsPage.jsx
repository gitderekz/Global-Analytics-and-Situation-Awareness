import { useEffect, useState } from 'react';
import api from '../services/api';
import styles from './MetricsPage.module.css';

export default function MetricsPage() {
  const [metrics, setMetrics] = useState(null);
  const [queue, setQueue] = useState(null);
  const [logs, setLogs] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/metrics')
      .then(({ data }) => {
        if (data.success) setMetrics(data.data);
      })
      .catch((err) => setError(err.response?.data?.message || 'Unable to load metrics'));

    api.get('/metrics/jobs')
      .then(({ data }) => {
        if (data.success) setQueue(data.data.jobs);
      })
      .catch(() => {
        // ignore job endpoint failure, metrics still useful
      });

    api.get('/metrics/logs')
      .then(({ data }) => {
        if (data.success) setLogs(data.data.logs);
      })
      .catch(() => {
        // log tail is optional
      });
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2>System Metrics</h2>
        <p>View backend availability, usage counts, runtime health, queue state, and log summaries.</p>
      </div>
      {error && <div className={styles.error}>{error}</div>}
      {metrics ? (
        <>
          <div className={styles.grid}>
            <div className={styles.card}>
              <h3>Uptime</h3>
              <p>{Math.floor(metrics.uptime)} seconds</p>
            </div>
            <div className={styles.card}>
              <h3>Timestamp</h3>
              <p>{new Date(metrics.timestamp).toLocaleString()}</p>
            </div>
            <div className={styles.card}>
              <h3>Counts</h3>
              <ul>
                {Object.entries(metrics.counts).map(([key, value]) => (
                  <li key={key}>{key}: {value}</li>
                ))}
              </ul>
            </div>
            <div className={styles.card}>
              <h3>Memory</h3>
              <ul>
                {Object.entries(metrics.memory).map(([key, value]) => (
                  <li key={key}>{key}: {(value / 1024 / 1024).toFixed(2)} MB</li>
                ))}
              </ul>
            </div>
          </div>
          {queue && (
            <div className={styles.jobsSection}>
              <h3>Job Queue</h3>
              {queue.queueStatus ? (
                <div className={styles.card}>
                  <p><strong>Queue enabled:</strong> {queue.queueStatus.enabled ? 'Yes' : 'No'}</p>
                  {queue.queueStatus.counts && (
                    <ul>
                      {Object.entries(queue.queueStatus.counts).map(([key, value]) => (
                        <li key={key}>{key}: {value}</li>
                      ))}
                    </ul>
                  )}
                  {queue.queueStatus.repeatableJobs && queue.queueStatus.repeatableJobs.length > 0 && (
                    <div>
                      <h4>Repeatable Jobs</h4>
                      <ul>
                        {queue.queueStatus.repeatableJobs.map((job) => (
                          <li key={job.key}>{job.name || job.key} — next run: {new Date(job.next).toLocaleString()}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className={styles.noJobs}>No queue status available.</div>
              )}
              {queue.scheduled && queue.scheduled.length > 0 && (
                <div className={styles.card}>
                  <h4>Scheduled Jobs</h4>
                  <ul>
                    {queue.scheduled.map((job, idx) => (
                      <li key={idx}>
                        <strong>{job.name}</strong> — {job.running ? 'active' : 'idle'}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          {logs && (
            <div className={styles.logSection}>
              <h3>Recent Logs</h3>
              {['error', 'warn', 'info'].map((level) => (
                <div key={level} className={styles.card}>
                  <h4>{level.toUpperCase()}</h4>
                  {logs[level] && logs[level].length > 0 ? (
                    <pre>{logs[level].join('\n')}</pre>
                  ) : (
                    <p>No recent {level} log entries.</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      ) : (!error && <div className={styles.loading}>Loading metrics...</div>)}
    </div>
  );
}
