import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://localhost:5000', changeOrigin: true },
      '/socket.io': { target: 'http://localhost:5000', ws: true },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'vendor-maplibre': ['maplibre-gl'],
          'vendor-three': ['three'],
          'vendor-zustand': ['zustand'],
          'vendor-axios': ['axios'],
          
          // Feature chunks
          'module-admin': ['./src/pages/AdminPage.jsx'],
          'module-maps': ['./src/maps/MapContainer.jsx'],
          'module-reports': ['./src/pages/ReportsPage.jsx'],
          'module-import': ['./src/pages/ImportPage.jsx'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
    },
  },
});
