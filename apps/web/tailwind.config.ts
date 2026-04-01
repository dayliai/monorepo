import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'dayli-deep': '#461F65',
        'dayli-vibrant': '#9230E3',
        'dayli-light': '#DBB0FF',
        'dayli-pale': '#F1E1FF',
        'dayli-cyan': '#1FEEEA',
        'dayli-error': '#B91C1C',
        'dayli-bg': '#F6F0FC',
        'dayli-navy': '#1a1a2e',
      },
      fontFamily: {
        heading: ['"Fraunces"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
