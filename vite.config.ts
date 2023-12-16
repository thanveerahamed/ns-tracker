import react from '@vitejs/plugin-react';

import { defineConfig } from 'vite';
import { VitePWA, VitePWAOptions } from 'vite-plugin-pwa';

const manifestForPlugin: Partial<VitePWAOptions> = {
  registerType: 'prompt',
  includeAssets: ['masked-icon.svg'],
  manifest: {
    name: 'NS Tracker App',
    short_name: 'NS Tracker',
    description: 'An app that can help with better NS Train tracking',
    icons: [
      {
        src: '/train_256.png',
        sizes: '256X256',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
    orientation: 'portrait',
    start_url: '.',
    display: 'standalone',
    theme_color: '#000000',
    background_color: '#ffffff',
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA(manifestForPlugin)],
  server: {
    open: '/index.html',
    port: 5174,
  },
  build: {
    outDir: 'build',
  },
});
