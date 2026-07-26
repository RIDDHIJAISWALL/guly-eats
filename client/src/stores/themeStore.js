import { create } from 'zustand';

const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'light';
  const saved = localStorage.getItem('guly-eats-theme');
  if (saved === 'dark' || saved === 'light') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const useThemeStore = create((set, get) => ({
  theme: getInitialTheme(),

  toggleTheme: () => {
    const newTheme = get().theme === 'light' ? 'dark' : 'light';
    set({ theme: newTheme });
    localStorage.setItem('guly-eats-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  },

  setTheme: (theme) => {
    set({ theme });
    localStorage.setItem('guly-eats-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  },

  initTheme: () => {
    const theme = get().theme;
    document.documentElement.setAttribute('data-theme', theme);
  },
}));

export default useThemeStore;
