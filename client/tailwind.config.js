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
        'gray-850': 'rgb(26,36,50)',
        'gray-950': 'rgb(8,15,30)',
        'gray-975': 'rgb(4,11,26)',
      },
    },
  },
  plugins: [],
}