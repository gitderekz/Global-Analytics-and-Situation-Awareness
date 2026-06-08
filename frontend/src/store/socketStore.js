import { create } from 'zustand';
import { io } from 'socket.io-client';
import { useEventStore } from './eventStore';
import { useAssetStore } from './assetStore';
import { useAlertStore } from './alertStore';

let sockets = [];

export const useSocketStore = create((set) => ({
  connected: false,

  connect: (token) => {
    const baseUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    const namespaces = ['events', 'assets', 'devices', 'alerts'];

    sockets.forEach((s) => s.disconnect());
    sockets = [];

    namespaces.forEach((ns) => {
      const socket = io(`${baseUrl}/${ns}`, {
        auth: { token },
        transports: ['websocket', 'polling'],
      });

      socket.on('connect', () => set({ connected: true }));
      socket.on('disconnect', () => set({ connected: false }));

      if (ns === 'events') {
        socket.on('event:new', (event) => useEventStore.getState().addEvent(event));
        socket.on('event:update', (event) => useEventStore.getState().updateEvent(event));
        socket.on('event:delete', ({ id }) => useEventStore.getState().removeEvent(id));
      }

      if (ns === 'assets') {
        socket.on('asset:update', (asset) => useAssetStore.getState().updateAsset(asset));
        socket.on('asset:moved', (asset) => useAssetStore.getState().updateAsset(asset));
      }

      if (ns === 'alerts') {
        socket.on('alert:new', (alert) => useAlertStore.getState().addAlert(alert));
        socket.on('alert:update', (alert) => useAlertStore.getState().updateAlert(alert));
      }

      sockets.push(socket);
    });
  },

  disconnect: () => {
    sockets.forEach((s) => s.disconnect());
    sockets = [];
    set({ connected: false });
  },
}));
