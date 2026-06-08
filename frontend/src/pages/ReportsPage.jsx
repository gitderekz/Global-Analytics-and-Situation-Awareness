import styles from './ReportsPage.module.css';

export default function ReportsPage() {
  const reportTypes = [
    { name: 'Events Report', type: 'events', formats: ['CSV', 'Excel', 'PDF'] },
    { name: 'Assets Report', type: 'assets', formats: ['CSV', 'Excel'] },
    { name: 'Threats Report', type: 'threats', formats: ['CSV', 'PDF'] },
    { name: 'Devices Report', type: 'devices', formats: ['CSV', 'Excel'] },
    { name: 'Alerts Report', type: 'alerts', formats: ['CSV', 'PDF'] },
    { name: 'Transactions Report', type: 'transactions', formats: ['CSV', 'Excel'] },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2>Reports Center</h2>
        <p>Generate and export analytics reports</p>
      </div>
      <div className={styles.grid}>
        {reportTypes.map((report) => (
          <div key={report.type} className={styles.card}>
            <h3>{report.name}</h3>
            <div className={styles.formats}>
              {report.formats.map((fmt) => (
                <button key={fmt} className={styles.formatBtn}>{fmt}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className={styles.note}>
        Report generation engine will export data from the API. Connect backend reporting service to enable downloads.
      </div>
    </div>
  );
}
