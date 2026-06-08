import styles from './SimpleChart.module.css';

export default function SimpleChart({ data, labelKey = 'label', valueKey = 'count', title, type = 'bar' }) {
  if (!data?.length) return <div className={styles.empty}>No chart data</div>;

  const max = Math.max(...data.map((d) => d[valueKey] || 0), 1);

  return (
    <div className={styles.chart}>
      {title && <div className={styles.title}>{title}</div>}
      <div className={type === 'bar' ? styles.bars : styles.lines}>
        {data.map((item, i) => (
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
