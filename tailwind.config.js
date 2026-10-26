/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        cream: {
          50: '#fbfbf9',
          100: '#f7f6f0',
          200: '#eeebe1',
          300: '#e0dbcb',
        },
        brand: {
          primary: '#14532d', // Deep forest green
          accent: '#16a34a', // Fresh green accent
          surface: '#fbfbf9', // Warm off-white
          charcoal: '#1e293b', // Dark charcoal text
          card: '#ffffff',
          gold: '#eab308',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)',
        'card': '0 4px 20px -2px rgba(20, 83, 45, 0.06), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'lift': '0 12px 28px -4px rgba(20, 83, 45, 0.12), 0 4px 8px -2px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
