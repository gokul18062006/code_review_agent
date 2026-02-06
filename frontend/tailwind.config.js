/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1f77b4',
        secondary: '#ff7f0e',
        success: '#28a745',
        warning: '#ffc107',
        danger: '#dc3545',
      }
    },
  },
  plugins: [],
}
