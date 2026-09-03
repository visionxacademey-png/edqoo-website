/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#6D22B5',
          'primary-dark': '#4B1680',
          'primary-light': '#F1E8FA',
          'primary-soft': '#F8F4FC',
          dark: '#202126',
          text: '#34343A',
          border: '#E6E3EA',
        },
        purple: {
          50: '#F8F4FC',
          100: '#F1E8FA',
          200: '#E0CEF5',
          300: '#C5A5EE',
          400: '#9F6AE2',
          500: '#853FD5',
          600: '#6D22B5',
          700: '#5C1C9A',
          800: '#4B1680',
          900: '#381061',
          950: '#22083D',
        },
        slate: {
          50: '#F8F4FC',
          100: '#F1E8FA',
          200: '#E6E3EA',
          300: '#D3CFD9',
          400: '#9B98A3',
          500: '#6B6875',
          600: '#4D4A56',
          700: '#34343A',
          800: '#29292F',
          900: '#202126',
          950: '#141518',
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
