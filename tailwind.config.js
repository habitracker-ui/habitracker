/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Design system tokens (legacy kept for db.js compatibility)
        paper: '#F7F3EC',
        ink: '#23302B',
        moss: '#5B7B5A',
        clay: '#C4633F',
        gold: '#C9A66B',
        line: '#DED6C4',
        // Dark mode surface tokens
        dark: {
          bg:      '#0F172A',
          surface: '#1E293B',
          card:    '#1E293B',
          border:  '#334155',
          ink:     '#F1F5F9',
          muted:   '#64748B',
        }
      },
      fontFamily: {
        serif: ['Fraunces', 'serif'],
        sans: ['"IBM Plex Sans"', 'sans-serif']
      },
      keyframes: {
        'fade-in': {
          '0%':   { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)'    }
        },
        'slide-up': {
          '0%':   { opacity: '0', transform: 'translateY(100%)' },
          '100%': { opacity: '1', transform: 'translateY(0)'    }
        },
        'slide-right': {
          '0%':   { opacity: '0', transform: 'translateX(-100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)'      }
        },
        'pop': {
          '0%':   { transform: 'scale(1)'    },
          '50%':  { transform: 'scale(1.35)' },
          '100%': { transform: 'scale(1)'    }
        },
        'xp-flash': {
          '0%':   { opacity: '0', transform: 'translateY(0) scale(0.8)'   },
          '20%':  { opacity: '1', transform: 'translateY(-8px) scale(1)'  },
          '80%':  { opacity: '1', transform: 'translateY(-12px) scale(1)' },
          '100%': { opacity: '0', transform: 'translateY(-20px) scale(0.9)' }
        }
      },
      animation: {
        'fade-in':    'fade-in 0.3s ease-out',
        'slide-up':   'slide-up 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'slide-right':'slide-right 0.3s ease-out',
        'pop':        'pop 0.3s ease-out',
        'xp-flash':   'xp-flash 1.6s ease-out forwards'
      }
    }
  },
  plugins: []
}
