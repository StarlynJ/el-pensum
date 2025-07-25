// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // <--- AÑADE ESTA LÍNEA
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}