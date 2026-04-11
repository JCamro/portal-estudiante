/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gold: { DEFAULT: '#C9A84C', light: '#D4B85A', dark: '#A88A3D' },
        'red-brand': { DEFAULT: '#C41E3A', light: '#D63A55' },
        crema: { DEFAULT: '#F5F0E8', dark: '#E8E0D5' },
      },
      fontFamily: {
        righteous: ['Righteous', 'cursive'],
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
