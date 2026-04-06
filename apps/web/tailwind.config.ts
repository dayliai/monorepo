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
        'dayli-dark': '#4a154b',
        'dayli-charcoal': '#121928',
        'dayli-cyan-500': '#06b6d4',
        'dayli-cyan-50': '#e0f7fa',
        'dayli-purple-50': '#f3e8f4',
        'dayli-pink-50': '#fce7f3',
        'dayli-gray': '#6a7282',
        'dayli-gray-50': '#f9fafb',
        'dayli-gray-100': '#f3f4f6',
        'dayli-gray-200': '#e5e7eb',
        'dayli-gray-300': '#d1d5dc',
        'dayli-gray-400': '#99a1af',
      },
      fontFamily: {
        heading: ['"Fraunces"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
