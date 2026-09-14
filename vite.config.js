import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const REPO_NAME = 'habitracker'

export default defineConfig({
  base: `/${REPO_NAME}/`,
  build: {
    target: 'es2015'
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'Hábitos — Tu tracker personal',
        short_name: 'Hábitos',
        description: 'Registra tus hábitos diarios, semanales y mensuales. Todo guardado en tu dispositivo.',
        theme_color: '#23302B',
        background_color: '#F7F3EC',
        display: 'standalone',
        orientation: 'portrait',
        start_url: `/${REPO_NAME}/`,
        scope: `/${REPO_NAME}/`,
        id: `/${REPO_NAME}/`,
        lang: 'es',
        categories: ['lifestyle', 'health'],
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ]
})
