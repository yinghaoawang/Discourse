/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#202225',
        secondary: '#5865f2',
      },
      spacing: {
        '18': '4.25rem',
      },
    },
  },
  plugins: [],
}