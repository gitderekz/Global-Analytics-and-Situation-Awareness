import styles from './DocsPage.module.css';

export default function DocsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2>API Documentation</h2>
        <p>Browse the platform OpenAPI docs powered by Redoc.</p>
      </div>
      <div className={styles.notice}>
        This documentation is generated from the backend OpenAPI schema. If it does not load, ensure the backend is running and authenticated.
      </div>
      <div className={styles.embedded}>
        <iframe title="API Docs" src="/api/v1/docs" frameBorder="0" />
      </div>
    </div>
  );
}
