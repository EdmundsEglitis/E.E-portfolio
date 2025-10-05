import { create } from 'zustand';

const THEME_KEY = 'ui.theme';
const REDUCED_KEY = 'ui.reducedFX';

function getSystemPrefersDark() {
  try {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch {
    return false;
  }
}

function getStoredTheme() {
  try {
    return localStorage.getItem(THEME_KEY) || 'system';
  } catch {
    return 'system';
  }
}

function getStoredReduced() {
  try {
    const v = localStorage.getItem(REDUCED_KEY);
    if (v === null) {
      // default from media query
      return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }
    return v === 'true';
  } catch {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }
}

function applyTheme(theme) {
  const html = document.documentElement;
  const effective =
    theme === 'system' ? (getSystemPrefersDark() ? 'dark' : 'light') : theme;

  html.setAttribute('data-theme', effective);
  if (effective === 'dark') html.classList.add('dark');
  else html.classList.remove('dark');
}

function persistTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {}
}

function persistReduced(val) {
  try {
    localStorage.setItem(REDUCED_KEY, String(val));
  } catch {}
}

// Initialize once
const initialTheme = getStoredTheme();
applyTheme(initialTheme);

export const useUI = create((set, get) => ({
  // state
  theme: initialTheme, // 'system' | 'light' | 'dark'
  reducedFX: getStoredReduced(),
  docProgress: 0, // 0..1
  routeTransition: false,

  // actions
  setTheme: (t) => {
    persistTheme(t);
    applyTheme(t);
    set({ theme: t });
  },
  toggleReducedFX: () => {
    const next = !get().reducedFX;
    persistReduced(next);
    set({ reducedFX: next });
  },
  setDocProgress: (p) => set({ docProgress: Math.max(0, Math.min(1, p)) }),
  setRouteTransition: (b) => set({ routeTransition: !!b }),
}));

// Useful for app bootstrap (optional)
export function initTheme() {
  applyTheme(getStoredTheme());
}
