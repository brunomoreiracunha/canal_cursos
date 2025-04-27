import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'netflix-black': '#141414',
        'netflix-dark': '#111111',
        'netflix-red': '#E50914',
        'netflix-red-dark': '#B81D24',
        'netflix-gray': '#757575',
        'netflix-light-gray': '#8C8C8C',
      },
      height: {
        'hero': '80vh',
      },
      spacing: {
        '128': '32rem',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(to top, rgba(0,0,0,0.8) 0, rgba(0,0,0,0) 60%, rgba(0,0,0,0.8) 100%)',
      },
      boxShadow: {
        'card': '0 10px 15px -3px rgba(0, 0, 0, 0.7), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
