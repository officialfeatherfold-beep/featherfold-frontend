/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'feather': {
          50: '#faf6f0',
          100: '#f5ede3',
          200: '#ebe0d2',
          300: '#d4c4ae',
          400: '#b8a184',
          500: '#9c8060',
          600: '#7a6245',
          700: '#5c4830',
          800: '#3d2e1e',
          900: '#2c1810',
        },
        'sandstone': '#c9b99a',
        'wheat': '#e8dcc8',
        'caramel': '#c9982e',
        'mocha': '#8b6f47'
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'serif': ['Playfair Display', 'serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
