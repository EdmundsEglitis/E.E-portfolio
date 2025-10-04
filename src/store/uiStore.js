import { create } from 'zustand';

const THEME_KEY = 'theme';
const REDUCED_KEY = 'reducedFX';

const getSystemDark = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-color-scheme: dark)').matches;

const applyThemeDom = (t) => {
  if (typeof document === 'undefined') return;
  const html = document.documentElement;
  if (t === 'dark') {
    html.dataset.theme = 'dark';
    html.classList.add('dark');
  } else if (t === 'light') {
    html.dataset.theme = 'light';
    html.classList.remove('dark');
  } else {
    html.dataset.theme = 'system';
    html.classList.toggle('dark', getSystemDark());
  }
};

export const useUI = create((set, get) => {
  // Init theme from localStorage (default: system)
  const storedTheme =
    (typeof localStorage !== 'undefined' && localStorage.getItem(THEME_KEY)) || 'system';
  applyThemeDom(storedTheme);

  // Init reducedFX from localStorage or prefers-reduced-motion
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const storedReduced =
    typeof localStorage !== 'undefined' && localStorage.getItem(REDUCED_KEY);
  const initialReduced = storedReduced != null ? storedReduced === 'true' : !!prefersReduced;

  // React to system theme changes when in 'system'
  if (typeof window !== 'undefined') {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (get().theme === 'system') applyThemeDom('system');
    };
    try {
      mql.addEventListener('change', handler);
    } catch {
      mql.addListener?.(handler);
    }
  }

  return {
    // Required state
    theme: storedTheme, // 'system' | 'light' | 'dark'
    reducedFX: initialReduced, // boolean
    cursorLabel: null, // string | null

    // Extra internal state for smooth R3F sync (safe to keep)
    scrollProgress: 0, // 0..1 (GSAP writes -> R3F reads)

    // Actions
    setTheme: (t) =>
      set(() => {
        if (typeof localStorage !== 'undefined') localStorage.setItem(THEME_KEY, t);
        applyThemeDom(t);
        return { theme: t };
      }),

    toggleReducedFX: () =>
      set((s) => {
        const next = !s.reducedFX;
        if (typeof localStorage !== 'undefined') localStorage.setItem(REDUCED_KEY, String(next));
        return { reducedFX: next };
      }),

    setCursorLabel: (label) => set({ cursorLabel: label }),

    setScrollProgress: (p) => set({ scrollProgress: Math.max(0, Math.min(1, p)) }),
  };
});
