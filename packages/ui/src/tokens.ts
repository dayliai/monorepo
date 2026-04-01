export const colors = {
  deepPurple: '#461F65',
  vibrantPurple: '#9230E3',
  lightPurple: '#DBB0FF',
  palePurple: '#F1E1FF',
  cyan: '#1FEEEA',
  errorRed: '#B91C1C',
  bgMain: '#F6F0FC',
  white: '#FFFFFF',
  darkNavy: '#1a1a2e',
} as const

export const fonts = {
  heading: "'Fraunces', serif",
  body: "'DM Sans', sans-serif",
} as const

export const tailwindColors = {
  'dayli-deep': colors.deepPurple,
  'dayli-vibrant': colors.vibrantPurple,
  'dayli-light': colors.lightPurple,
  'dayli-pale': colors.palePurple,
  'dayli-cyan': colors.cyan,
  'dayli-error': colors.errorRed,
  'dayli-bg': colors.bgMain,
  'dayli-navy': colors.darkNavy,
} as const

export const tailwindFonts = {
  heading: ['"Fraunces"', 'serif'],
  body: ['"DM Sans"', 'sans-serif'],
} as const
