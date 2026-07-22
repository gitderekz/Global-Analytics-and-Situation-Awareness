import { create } from 'zustand';

export const useSettingsStore = create((set) => ({
  theme: localStorage.getItem('theme') || 'dark',
  language: 'en',
  mapMode: localStorage.getItem('mapMode') || 'offline',
  highContrast: localStorage.getItem('highContrast') === 'true',
  reducedMotion: localStorage.getItem('reducedMotion') === 'true',
  fontSize: localStorage.getItem('fontSize') || 'normal',

  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme
    );
    set({ theme });
  },

  setLanguage: (language) => set({ language }),
  
  setMapMode: (mapMode) => {
    localStorage.setItem('mapMode', mapMode);
    set({ mapMode });
  },

  setHighContrast: (highContrast) => {
    localStorage.setItem('highContrast', highContrast);
    document.documentElement.setAttribute('data-high-contrast', highContrast ? 'true' : 'false');
    set({ highContrast });
  },

  setReducedMotion: (reducedMotion) => {
    localStorage.setItem('reducedMotion', reducedMotion);
    document.documentElement.setAttribute('data-reduced-motion', reducedMotion ? 'true' : 'false');
    set({ reducedMotion });
  },

  setFontSize: (fontSize) => {
    localStorage.setItem('fontSize', fontSize);
    document.documentElement.setAttribute('data-font-size', fontSize);
    set({ fontSize });
  },
}));

// Apply theme and accessibility settings on load
const theme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', theme);
document.documentElement.setAttribute('data-high-contrast', localStorage.getItem('highContrast') || 'false');
document.documentElement.setAttribute('data-reduced-motion', localStorage.getItem('reducedMotion') || 'false');
document.documentElement.setAttribute('data-font-size', localStorage.getItem('fontSize') || 'normal');

// Respect prefers-reduced-motion setting
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  localStorage.setItem('reducedMotion', 'true');
  document.documentElement.setAttribute('data-reduced-motion', 'true');
}
