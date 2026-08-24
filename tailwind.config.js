/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-navy': {
          50: '#f4f6fa',
          100: '#e5e9f4',
          200: '#c5d0e7',
          300: '#94acdb',
          400: '#5c80cb',
          500: '#385cb5',
          600: '#29479a',
          700: '#22397c',
          800: '#0F172A',
          900: '#0A1128', // Core Brand Deep Navy
          950: '#020617',
        },
        'royal-blue': {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#badffd',
          300: '#7cc4fc',
          400: '#38a5f8',
          500: '#0e87e3',
          600: '#026bc5',
          700: '#02559f',
          800: '#064984',
          900: '#006494', // Core Brand Royal Blue
          950: '#031b33',
        },
        'light-blue': {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
