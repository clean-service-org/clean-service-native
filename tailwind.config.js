/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,tsx,ts,jsx}', './components/**/*.{js,ts,jsx,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#333',
        secondary: '#334',
        light: {
          100: '#D6C6FF',
          200: '#A8B5DB',
          300: '#9CA4AB',
        },
        dark: {
          100: '#221F3D',
          200: '#0F0D23',
        },
        accent: '#AB8BFF',
      },
    },
  },
  plugins: [],
};
