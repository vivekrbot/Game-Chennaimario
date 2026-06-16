import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  // No client-side routing in this single-page game — disable the SPA
  // history fallback so missing public/ assets (e.g. audio not added yet)
  // 404 cleanly in dev instead of resolving to index.html, which Phaser's
  // loaders would otherwise try (and fail) to decode as image/audio data.
  appType: 'mpa',
});
