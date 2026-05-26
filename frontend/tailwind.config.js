/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Multi-tema usando Variables CSS Custom Properties
        bgPrimary: 'var(--bg-primary)',
        bgCard: 'var(--bg-card)',
        bgInput: 'var(--bg-input)',
        textPrimary: 'var(--text-primary)',
        textSecondary: 'var(--text-secondary)',
        textMuted: 'var(--text-muted)',
        accentNeon: 'var(--color-indigo-glow)',
        availableGreen: 'var(--color-available)',
        soldRed: 'var(--color-sold)',
        infrastructure: 'var(--color-infrastructure)',

        // Compatibilidad Legacy
        'legacy-darkBg': '#0b0f19',
        'legacy-cardBg': 'rgba(17, 24, 39, 0.7)',
        'legacy-accentNeon': '#6366f1',
        'legacy-availableGreen': '#10b981',
        'legacy-soldRed': '#f43f5e',
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
