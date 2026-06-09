import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useSocketStore } from './store/socketStore';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import EventsPage from './pages/EventsPage';
import AssetsPage from './pages/AssetsPage';
import SOCPage from './pages/SOCPage';
import NetworkPage from './pages/NetworkPage';
import LogisticsPage from './pages/LogisticsPage';
import FraudPage from './pages/FraudPage';
import IoTPage from './pages/IoTPage';
import EmergencyPage from './pages/EmergencyPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default function App() {
  const { isAuthenticated, token } = useAuthStore();
  const { connect, disconnect } = useSocketStore();

  useEffect(() => {
    if (isAuthenticated && token) {
      connect(token);
    } else {
      disconnect();
    }
    return () => disconnect();
  }, [isAuthenticated, token, connect, disconnect]);

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="assets" element={<AssetsPage />} />
        <Route path="soc" element={<SOCPage />} />
        <Route path="network" element={<NetworkPage />} />
        <Route path="logistics" element={<LogisticsPage />} />
        <Route path="fraud" element={<FraudPage />} />
        <Route path="iot" element={<IoTPage />} />
        <Route path="emergency" element={<EmergencyPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="admin" element={<AdminPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
