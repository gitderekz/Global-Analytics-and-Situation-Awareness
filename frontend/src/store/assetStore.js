import { create } from 'zustand';
import api from '../services/api';

export const useAssetStore = create((set) => ({
  assets: [],
  loading: false,

  fetchAssets: async (filters = {}) => {
    set({ loading: true });
    try {
      const { data } = await api.get('/assets', { params: filters });
      if (data.success) set({ assets: data.data.assets, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  updateAsset: (asset) => set((s) => ({
    assets: s.assets.some((a) => a.id === asset.id)
      ? s.assets.map((a) => (a.id === asset.id ? asset : a))
      : [asset, ...s.assets],
  })),
}));
