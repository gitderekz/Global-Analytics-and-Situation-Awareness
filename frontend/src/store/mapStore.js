import { create } from 'zustand';

export const useMapStore = create((set) => ({
  center: [20, 0],
  zoom: 2,
  pitch: 0,
  bearing: 0,
  selectedObject: null,
  hoveredObject: null,
  filters: {},
  layers: {
    events: true,
    assets: true,
    devices: true,
    clusters: true,
    heatmap: false,
    routes: false,
    geofences: false,
  },

  setView: (view) => set(view),
  setSelectedObject: (obj) => set({ selectedObject: obj }),
  setHoveredObject: (obj) => set({ hoveredObject: obj }),
  setFilters: (filters) => set((s) => ({ filters: { ...s.filters, ...filters } })),
  toggleLayer: (layer) => set((s) => ({
    layers: { ...s.layers, [layer]: !s.layers[layer] },
  })),
  flyTo: (lng, lat, zoom = 10) => set({ center: [lng, lat], zoom }),
}));
