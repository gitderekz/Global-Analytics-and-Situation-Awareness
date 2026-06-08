import styles from './MapLegend.module.css';

const items = [
  { color: '#22c55e', label: 'Active / Low' },
  { color: '#3b82f6', label: 'Info' },
  { color: '#eab308', label: 'Warning / Medium' },
  { color: '#f97316', label: 'High Risk' },
  { color: '#ef4444', label: 'Critical' },
  { color: '#6b7280', label: 'Offline' },
];

export default function MapLegend() {
  return (
    <div className={styles.legend}>
      <div className={styles.title}>Legend</div>
      {items.map((item) => (
        <div key={item.label} className={styles.item}>
          <span className={styles.dot} style={{ backgroundColor: item.color }} />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
