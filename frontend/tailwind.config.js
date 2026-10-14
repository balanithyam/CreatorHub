/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        studio: {
          bg: '#FAF8F5',
          card: '#FFFFFF',
          cardMuted: '#F4F0EA',
          border: '#E4DDD3',
          borderDark: '#121316',
          text: '#121316',
          muted: '#6B6864',
          subtle: '#9E9B95',
          accent: '#FF5A36',
          accentHover: '#E004825',
          accentSoft: '#FFEFEA',
          lime: '#D2F800',
          yellow: '#FFD028',
          blue: '#2A72FF',
          darkBg: '#121316',
          darkCard: '#1C1D21',
          darkBorder: '#2E3038'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'brutal-sm': '2x 2x 0px #121316',
        'brutal': '4x 4x 0px #121316',
        'brutal-lg': '6x 6x 0px #121316',
        'brutal-accent': '4x 4x 0px #FF5A36',
        'brutal-lime': '4x 4x 0px #121316',
      },
      borderRadius: {
        'brutal': '6px',
      }
    },
  },
  plugins: [],
}
