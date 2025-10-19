/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Space Grotesk', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      colors: {
        'accent': {
          'primary': '#ff6b35',
          'secondary': '#f7931e',
        }
      },
      animation: {
        'float': 'float 20s ease-in-out infinite',
        'gradient': 'gradientShift 3s ease infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      backdropBlur: {
        'xs': '2px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
};