import { create } from 'zustand';
import api from '../services/api';

export const useAlertStore = create((set) => ({
  alerts: [],
  notifications: [],
  loading: false,

  fetchAlerts: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get('/alerts');
      if (data.success) set({ alerts: data.data.alerts, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  addAlert: (alert) => set((s) => ({
    alerts: [alert, ...s.alerts],
    notifications: [{ id: Date.now(), title: alert.title, type: 'alert', isRead: false, ...alert }, ...s.notifications],
  })),

  updateAlert: (alert) => set((s) => ({
    alerts: s.alerts.map((a) => (a.id === alert.id ? alert : a)),
  })),

  markNotificationRead: (id) => set((s) => ({
    notifications: s.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
  })),
}));
