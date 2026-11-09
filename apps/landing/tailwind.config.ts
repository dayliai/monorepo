import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'
import { tailwindColors, tailwindFonts, themeCssVars } from '@dayli/ui'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      // All colors come from @dayli/ui: bg-dll-card, text-dll-muted, ...
      colors: tailwindColors,
      screens: {
        // Header switches from the Menu button to the full nav above 960px, as in the prototype.
        nav: '961px',
      },
      fontFamily: tailwindFonts,
      maxWidth: { wrap: '1140px' },
    },
  },
  plugins: [
    // Theme colors as CSS variables, built from @dayli/ui.
    plugin(({ addBase }) => {
      addBase({
        ':root': themeCssVars('light'),
        ':root[data-theme="dark"]': themeCssVars('dark'),
      })
    }),
  ],
} satisfies Config
