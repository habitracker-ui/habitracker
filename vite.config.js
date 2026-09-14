import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// IMPORTANTE: cambia 'habit-tracker' por el nombre exacto de tu repositorio
// de GitHub si es diferente. Esto es necesario para que las rutas
// funcionen correctamente en GitHub Pages (que sirve desde /repo-name/).
const REPO_NAME = 'habitracker'

export default defineConfig({
  base: `/${REPO_NAME}/`,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Habit Tracker',
        short_name: 'Habits',
        description: 'Registra tus hábitos diarios, todo guardado en tu dispositivo.',
        theme_color: '#23302B',
        background_color: '#F7F3EC',
        display: 'standalone',
        start_url: `/${REPO_NAME}/`,
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    })
  ]
})
