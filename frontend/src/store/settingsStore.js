import { create } from 'zustand';

export const useSettingsStore = create((set) => ({
  theme: localStorage.getItem('theme') || 'dark',
  language: 'en',

  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme
    );
    set({ theme });
  },

  setLanguage: (language) => set({ language }),
}));

// Apply theme on load
const theme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', theme);
