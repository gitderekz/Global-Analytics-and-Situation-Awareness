import styles from './DataTable.module.css';

export default function DataTable({ columns = [], data = [], onRowClick }) {
  const rows = Array.isArray(data) && data.length > 0 ? data : new Array(4).fill(null).map((_, idx) => (
    columns.reduce((row, col) => ({
      ...row,
      [col.key]: idx === 0 && col.key === columns[0]?.key ? `Sample ${idx + 1}` : '—',
    }), { id: `placeholder-${idx}` })
  ));
  const isPlaceholder = !Array.isArray(data) || data.length === 0;

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.id ?? i}
              onClick={() => onRowClick?.(row)}
              className={`${onRowClick ? styles.clickable : ''} ${isPlaceholder ? styles.placeholderRow : ''}`}
            >
              {columns.map((col) => (
                <td key={col.key}>{col.render ? col.render(row) : String(row[col.key] ?? '')}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {isPlaceholder && <div className={styles.placeholderNote}>No live records available yet — sample data shown.</div>}
    </div>
  );
}
