import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'
import { tailwindColors, tailwindFonts, themeCssVars, cssVar } from '@dayli/ui'

const v = (token: Parameters<typeof cssVar>[0]) => `rgb(var(${cssVar(token)}) / <alpha-value>)`

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        ...tailwindColors,
        // Temporary: old class names mapped onto the new palette so pages that
        // haven't been rebuilt yet still follow it. Removed in the cleanup step.
        'dayli-deep': v('ink'),
        'dayli-vibrant': v('primary'),
        'dayli-light': v('lilac'),
        'dayli-pale': v('lav'),
        'dayli-cyan': v('yellow'),
        'dayli-error': v('err'),
        'dayli-bg': v('bg'),
        'dayli-navy': v('navy'),
      },
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
