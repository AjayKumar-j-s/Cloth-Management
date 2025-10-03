/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          sky1: '#e0f2fe',
          sky2: '#bae6fd',
          sky3: '#7dd3fc',
          sky4: '#38bdf8',
          sky5: '#0ea5e9',
          navy1: '#0b1220',
          navy2: '#0f1b33',
          navy3: '#13294b',
          neon: '#00f0ff',
          accent: '#80ffea',
          magenta: '#ff1b6b',
          purple: '#7a5cff'
        }
      },
      boxShadow: {
        neon: '0 0 10px rgba(14,165,233,0.8), 0 0 20px rgba(0,240,255,0.6)',
        neonStrong: '0 0 12px #00f0ff, 0 0 24px #00f0ff, 0 0 48px #38bdf8'
      },
      dropShadow: {
        neon: '0 0 6px rgba(0,240,255,0.9)'
      },
      backgroundImage: {
        grid: 'radial-gradient(circle at 1px 1px, rgba(14,165,233,0.15) 1px, transparent 0)',
      },
    },
  },
  plugins: [],
}