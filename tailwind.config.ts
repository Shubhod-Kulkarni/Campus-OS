import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./stores/**/*.{js,ts,jsx,tsx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
    "./types/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'os-bg':        '#0f172a',
        'os-primary':   '#60a5fa',
        'os-secondary': '#a78bfa',
        'os-success':   '#34d399',
        'os-warning':   '#fbbf24',
        'os-danger':    '#f472b6',
        'os-text-1':    '#e2e8f0',
        'os-text-2':    '#94a3b8',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backdropBlur: {
        os: '12px',
      },
      animation: {
        'spin-slow':   'spin-slow 8s linear infinite',
        'pulse-ring':  'pulse-ring 2s ease-in-out infinite',
        'blink':       'blink 1s step-end infinite',
      },
    },
  },
  plugins: [],
};

export default config;
