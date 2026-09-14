/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // ── Design tokens (reference-matched) ─────────────
        primary: {
          DEFAULT: '#5B68F5',
          50:  '#EEEFFE',
          100: '#D9DCFD',
          600: '#4452D3',
        },
        navy:    '#1A1D2E',   // Main headings
        subtle:  '#7C7FAD',   // Secondary text
        surface: '#F6F7FF',   // Background surface
        'app-border': '#EDEEF8', // Subtle borders
        // ── Legacy tokens (kept for db.js compat) ─────────
        paper: '#F7F3EC',
        ink:   '#23302B',
        moss:  '#5B7B5A',
        clay:  '#C4633F',
        gold:  '#C9A66B',
        line:  '#DED6C4',
        // ── Dark mode ─────────────────────────────────────
        dark: {
          bg:     '#0F172A',
          surface:'#1A2540',
          card:   '#1E2D45',
          border: '#2D3F5C',
          ink:    '#E2E8F0',
          muted:  '#64748B',
        }
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        'card': '0 4px 20px rgba(91, 104, 245, 0.12)',
        'card-hover': '0 8px 30px rgba(91, 104, 245, 0.20)',
        'primary': '0 4px 14px rgba(91, 104, 245, 0.35)',
      },
      keyframes: {
        'fade-in': {
          '0%':   { opacity:'0', transform:'translateY(8px)'  },
          '100%': { opacity:'1', transform:'translateY(0)'     }
        },
        'slide-up': {
          '0%':   { opacity:'0', transform:'translateY(100%)' },
          '100%': { opacity:'1', transform:'translateY(0)'     }
        },
        'slide-in': {
          '0%':   { opacity:'0', transform:'translateX(-100%)' },
          '100%': { opacity:'1', transform:'translateX(0)'      }
        },
        'pop': {
          '0%':   { transform:'scale(1)'    },
          '50%':  { transform:'scale(1.35)' },
          '100%': { transform:'scale(1)'    }
        },
        'xp-rise': {
          '0%':   { opacity:'0', transform:'translateY(4px) scale(0.85)'  },
          '25%':  { opacity:'1', transform:'translateY(-10px) scale(1)'   },
          '75%':  { opacity:'1', transform:'translateY(-16px) scale(1)'   },
          '100%': { opacity:'0', transform:'translateY(-22px) scale(0.9)' }
        }
      },
      animation: {
        'fade-in':  'fade-in 0.25s ease-out',
        'slide-up': 'slide-up 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'slide-in': 'slide-in 0.3s ease-out',
        'pop':      'pop 0.28s ease-out',
        'xp-rise':  'xp-rise 1.6s ease-out forwards',
      }
    }
  },
  plugins: []
}
