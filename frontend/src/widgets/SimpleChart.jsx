import styles from './SimpleChart.module.css';

export default function SimpleChart({ data, labelKey = 'label', valueKey = 'count', title, type = 'bar' }) {
  const fallbackData = [
    { label: 'Critical', count: 7 },
    { label: 'High', count: 12 },
    { label: 'Medium', count: 18 },
    { label: 'Low', count: 9 },
    { label: 'Info', count: 5 },
  ];
  const displayData = (Array.isArray(data) && data.length > 0) ? data : fallbackData;
  const note = (!Array.isArray(data) || data.length === 0) ? 'Sample data shown for preview.' : null;
  const max = Math.max(...displayData.map((d) => d[valueKey] || 0), 1);

  return (
    <div className={styles.chart}>
      {title && <div className={styles.title}>{title}</div>}
      {note && <div className={styles.note}>{note}</div>}
      <div className={type === 'bar' ? styles.bars : styles.lines}>
        {displayData.map((item, i) => (
          <div key={i} className={styles.item}>
            <div className={styles.barContainer}>
              <div
                className={styles.bar}
                style={{ height: `${((item[valueKey] || 0) / max) * 100}%` }}
              />
            </div>
            <span className={styles.label}>{item[labelKey]}</span>
            <span className={styles.value}>{item[valueKey]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
