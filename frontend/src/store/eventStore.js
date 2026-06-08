import { create } from 'zustand';
import api from '../services/api';

export const useEventStore = create((set, get) => ({
  events: [],
  selectedEvent: null,
  statistics: null,
  loading: false,

  fetchEvents: async (filters = {}) => {
    set({ loading: true });
    try {
      const { data } = await api.get('/events', { params: filters });
      if (data.success) set({ events: data.data.events, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  addEvent: (event) => set((s) => ({ events: [event, ...s.events] })),
  updateEvent: (event) => set((s) => ({
    events: s.events.map((e) => (e.id === event.id ? event : e)),
  })),
  removeEvent: (id) => set((s) => ({
    events: s.events.filter((e) => e.id !== id),
  })),
  setSelectedEvent: (event) => set({ selectedEvent: event }),
}));
