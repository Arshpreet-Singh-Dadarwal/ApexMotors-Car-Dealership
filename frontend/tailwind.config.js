/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
      },
      colors: {
        // Deep blacks — "ink" scale
        ink: {
          950: '#05060a',
          900: '#0a0c12',
          800: '#11141c',
          700: '#1a1e2a',
          600: '#262b3a',
          500: '#3a4052',
        },
        // Metallic blue — "steel" scale
        steel: {
          50: '#eef4ff',
          100: '#d9e6ff',
          200: '#bcd3ff',
          300: '#8eb6ff',
          400: '#5e8efc',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [],
};
