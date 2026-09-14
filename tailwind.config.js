/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Light mode
        paper: '#F7F3EC',
        ink: '#23302B',
        moss: '#5B7B5A',
        clay: '#C4633F',
        gold: '#C9A66B',
        line: '#DED6C4',
        // Dark mode surface tokens
        dark: {
          bg: '#0F1512',
          surface: '#1A2420',
          card: '#1F2D28',
          border: '#2A3C35',
          ink: '#E8E0D0',
          muted: '#8A9E96',
        }
      },
      fontFamily: {
        serif: ['Fraunces', 'serif'],
        sans: ['"IBM Plex Sans"', 'sans-serif']
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'pop': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.25)' },
          '100%': { transform: 'scale(1)' }
        },
        'pulse-ring': {
          '0%': { boxShadow: '0 0 0 0 rgba(91, 123, 90, 0.5)' },
          '70%': { boxShadow: '0 0 0 8px rgba(91, 123, 90, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(91, 123, 90, 0)' }
        },
        'slide-in': {
          '0%': { transform: 'translateX(-8px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        'xp-fill': {
          '0%': { width: '0%' },
          '100%': { width: 'var(--xp-width)' }
        }
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'pop': 'pop 0.3s ease-out',
        'pulse-ring': 'pulse-ring 1.5s ease-out infinite',
        'slide-in': 'slide-in 0.25s ease-out',
        'xp-fill': 'xp-fill 1s ease-out forwards'
      }
    }
  },
  plugins: []
}
