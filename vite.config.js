import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  resolve: {
    alias: {
      animejs: 'animejs/lib/anime.es.js',
    },
  },
  plugins: [react()],
});
