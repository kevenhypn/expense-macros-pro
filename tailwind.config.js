/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        card: '#111111',
        cardAlt: '#161616',
        border: '#222222',
        borderAlt: '#1a1a1a',
        accent: '#10b981',
        accentMuted: '#064e3b',
        danger: '#ef4444',
        dangerMuted: '#7f1d1d',
        muted: '#6b7280',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};
