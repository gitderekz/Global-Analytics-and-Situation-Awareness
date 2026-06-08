import { useAuthStore } from '../store/authStore';
import styles from './ProfilePage.module.css';

export default function ProfilePage() {
  const { user } = useAuthStore();

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.avatar}>{user?.firstName?.[0]}{user?.lastName?.[0]}</div>
        <h2>{user?.firstName} {user?.lastName}</h2>
        <span className={styles.role}>{user?.Role?.name || 'User'}</span>
        <div className={styles.details}>
          <div className={styles.row}>
            <span className={styles.label}>Email</span>
            <span>{user?.email}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Status</span>
            <span className={styles.status}>{user?.status}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Last Login</span>
            <span>{user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : '—'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
