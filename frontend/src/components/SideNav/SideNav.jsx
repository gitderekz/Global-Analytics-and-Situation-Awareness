import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './SideNav.module.css';

const modules = [
  { path: '/', label: 'Dashboard', icon: '⊞' },
  { path: '/events', label: 'Event Monitoring', icon: '⚡' },
  { path: '/assets', label: 'Asset Tracking', icon: '📍' },
  { path: '/soc', label: 'Cyber Security SOC', icon: '🛡' },
  { path: '/network', label: 'Network Monitoring', icon: '🌐' },
  { path: '/logistics', label: 'Logistics Control', icon: '🚛' },
  { path: '/fraud', label: 'Fraud Detection', icon: '💳' },
  { path: '/iot', label: 'IoT Monitoring', icon: '📡' },
  { path: '/emergency', label: 'Emergency Response', icon: '🚨' },
  { path: '/reports', label: 'Reports', icon: '📊' },
  { path: '/settings', label: 'Settings', icon: '⚙' },
];

export default function SideNav() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <nav className={`${styles.sidenav} ${collapsed ? styles.collapsed : ''}`}>
      <button className={styles.toggle} onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? '»' : '«'}
      </button>
      <ul className={styles.menu}>
        {modules.map((mod) => (
          <li key={mod.path}>
            <NavLink
              to={mod.path}
              end={mod.path === '/'}
              className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
              title={mod.label}
            >
              <span className={styles.icon}>{mod.icon}</span>
              {!collapsed && <span className={styles.label}>{mod.label}</span>}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
