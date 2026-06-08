import { useSettingsStore } from '../store/settingsStore';
import styles from './SettingsPage.module.css';

export default function SettingsPage() {
  const { theme, language, setTheme, setLanguage } = useSettingsStore();

  return (
    <div className={styles.page}>
      <h2>Settings</h2>
      <div className={styles.section}>
        <h3>Appearance</h3>
        <div className={styles.field}>
          <label>Theme</label>
          <select value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="dark">Dark</option>
            <option value="light">Light</option>
            <option value="system">System</option>
          </select>
        </div>
        <div className={styles.field}>
          <label>Language</label>
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="en">English</option>
            <option value="sw">Swahili</option>
            <option value="fr">French</option>
          </select>
        </div>
      </div>
      <div className={styles.section}>
        <h3>Map Defaults</h3>
        <div className={styles.field}>
          <label>Map Server URL</label>
          <input type="text" defaultValue={import.meta.env.VITE_MAP_URL} readOnly />
        </div>
      </div>
      <div className={styles.section}>
        <h3>API Configuration</h3>
        <div className={styles.field}>
          <label>API URL</label>
          <input type="text" defaultValue={import.meta.env.VITE_API_URL} readOnly />
        </div>
      </div>
    </div>
  );
}
