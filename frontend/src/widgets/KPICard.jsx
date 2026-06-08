import styles from './KPICard.module.css';

export default function KPICard({ title, value, trend, icon, color }) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
        {icon && <span className={styles.icon} style={{ color: color || 'var(--accent)' }}>{icon}</span>}
      </div>
      <div className={styles.value} style={{ color: color }}>{value ?? '—'}</div>
      {trend !== undefined && (
        <div className={`${styles.trend} ${trend >= 0 ? styles.up : styles.down}`}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </div>
      )}
    </div>
  );
}
