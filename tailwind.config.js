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
        'left-sidebar': '4.25rem',
        'inner-sidebar': '15rem',
        'right-sidebar': '15rem',
        'chatbar': '8rem',
        '13': '3.15rem',
        '18': '4.25rem',
      },
    },
  },
  plugins: [],
}