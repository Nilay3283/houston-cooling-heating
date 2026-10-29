/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        midnight: { DEFAULT: '#071426', 2: '#0C1D35', 3: '#122842' },
        electric: { DEFAULT: '#168BFF', deep: '#0A6FD6' },
        ice: '#8DDCFF',
        silver: '#DCE5EF',
        warm: '#FFB86B',
      },
      fontFamily: { sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'] },
      boxShadow: {
        glow: '0 0 0 1px rgba(141,220,255,0.12), 0 24px 60px -20px rgba(22,139,255,0.45)',
      },
      transitionTimingFunction: { soft: 'cubic-bezier(0.22, 1, 0.36, 1)' },
    },
  },
  plugins: [],
};
