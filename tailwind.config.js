/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        space: {
          900: '#0B0B1A',
          800: '#151532',
          700: '#1D1D4A',
          600: '#262663',
          500: '#3D3D8A',
        },
        neon: {
          blue: '#00F0FF',
          purple: '#B000FF',
        }
      },
      backgroundImage: {
        'space-gradient': 'linear-gradient(to bottom right, #0B0B1A, #151532)',
      }
    },
  },
  plugins: [],
}
