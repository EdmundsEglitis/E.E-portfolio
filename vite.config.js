import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  resolve: {
    alias: {
      // Force animejs to its ESM build
      animejs: 'animejs/lib/anime.es.js',
    },
  },
  plugins: [react()],
});
