import { Outlet } from 'react-router-dom';
import TopBar from '../components/TopBar/TopBar';
import SideNav from '../components/SideNav/SideNav';
import styles from './DashboardLayout.module.css';

export default function DashboardLayout() {
  return (
    <div className={styles.layout}>
      <TopBar />
      <div className={styles.body}>
        <SideNav />
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
