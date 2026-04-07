import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/emails/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-serif)', 'serif'],
        display: ['var(--font-playfair)', 'serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        border: 'hsl(var(--border))',
      },
      keyframes: {
        'mechanical-fade': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'mechanical-slide': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'invert-active': {
          '0%': { filter: 'invert(0)' },
          '100%': { filter: 'invert(1)' },
        }
      },
      animation: {
        'mech-fade': 'mechanical-fade 150ms cubic-bezier(0.19, 1, 0.22, 1)',
        'mech-slide': 'mechanical-slide 200ms cubic-bezier(0.19, 1, 0.22, 1)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
