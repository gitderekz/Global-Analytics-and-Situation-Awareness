import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useAlertStore } from '../../store/alertStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useMapStore } from '../../store/mapStore';
import { useSocketStore } from '../../store/socketStore';
import api from '../../services/api';
import styles from './TopBar.module.css';

export default function TopBar() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { notifications, markNotificationRead } = useAlertStore();
  const { theme, setTheme } = useSettingsStore();
  const { mapMode } = useSettingsStore();
  const { flyTo } = useMapStore();
  const { connected } = useSocketStore();
  const [search, setSearch] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    try {
      const { data } = await api.get('/analytics/search', { params: { q: search } });
      if (data.success && data.data.length > 0) {
        const result = data.data[0];
        if (result.lat && result.lng) flyTo(parseFloat(result.lng), parseFloat(result.lat), 10);
      }
    } catch { /* ignore */ }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  const mapStatus = (() => {
    if (mapMode === 'osm') return { label: 'Map: OSM (Online)', className: styles.online };
    if (mapMode === 'maptiler') return { label: 'Map: MapTiler (Local)', className: styles.local };
    if (!navigator.onLine) return { label: 'Map: Offline (Network)', className: styles.offline };
    return { label: 'Map: MBTiles (Offline)', className: styles.offline };
  })();

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>◉</span>
          <span className={styles.logoText}>Global Analytics</span>
        </div>
        <form className={styles.search} onSubmit={handleSearch}>
          <span className={styles.searchIcon}>⌕</span>
          <input
            type="text"
            placeholder="Search events, assets, locations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
      </div>

      <div className={styles.right}>
        <span className={`${styles.status} ${connected ? styles.online : styles.offline}`}>
          {connected ? '● Live' : '○ Offline'}
        </span>
        <span className={`${styles.status} ${mapStatus.className}`} title={`Map mode: ${mapMode}`}>
          {mapStatus.label}
        </span>

        <div className={styles.dropdown}>
          <button className={styles.iconBtn} onClick={() => setShowNotifications(!showNotifications)}>
            🔔
            {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
          </button>
          {showNotifications && (
            <div className={styles.dropdownMenu}>
              <div className={styles.dropdownHeader}>Notifications</div>
              {notifications.length === 0 ? (
                <div className={styles.empty}>No notifications</div>
              ) : (
                notifications.slice(0, 5).map((n) => (
                  <div
                    key={n.id}
                    className={`${styles.notifItem} ${!n.isRead ? styles.unread : ''}`}
                    onClick={() => markNotificationRead(n.id)}
                  >
                    <strong>{n.title}</strong>
                    <span>{n.severity}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <button className={styles.iconBtn} onClick={toggleTheme} title="Toggle theme">
          {theme === 'dark' ? '☀' : '☾'}
        </button>

        <div className={styles.dropdown}>
          <button className={styles.profileBtn} onClick={() => setShowProfile(!showProfile)}>
            <span className={styles.avatar}>{user?.firstName?.[0] || 'U'}</span>
            <span>{user?.firstName} {user?.lastName}</span>
          </button>
          {showProfile && (
            <div className={styles.dropdownMenu}>
              <div className={styles.profileInfo}>
                <strong>{user?.firstName} {user?.lastName}</strong>
                <span>{user?.Role?.name || 'User'}</span>
                <span className={styles.email}>{user?.email}</span>
              </div>
              <button onClick={() => { navigate('/profile'); setShowProfile(false); }}>Profile</button>
              <button onClick={() => { navigate('/settings'); setShowProfile(false); }}>Settings</button>
              <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
