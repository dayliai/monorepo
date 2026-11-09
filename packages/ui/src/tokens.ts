/**
 * Daily Living Labs design tokens.
 *
 * Source of truth: dll-prototype-v22.html. Every color has a light and a dark
 * value; both meet WCAG 2.2 AA contrast for the pairings used in the prototype.
 * Apps should read colors from here (or from the CSS variables built from it),
 * never hardcode hex values.
 */

export type ThemeName = 'light' | 'dark'

const light = {
  // Core
  bg: '#FFFDF7', // page background
  ink: '#14213D', // body text and headings
  muted: '#3E4560', // secondary text
  primary: '#6B2BC0', // links, buttons, eyebrow labels
  violet: '#3D2C8D', // button hover, active nav, hero accent line
  onPrimary: '#FFFFFF', // text on primary buttons
  yellow: '#F7C948', // focus ring, highlights, step numbers, skip link
  yellowHover: '#FFD866', // yellow button hover
  onAccent: '#14213D', // text on yellow and accent* fills (both themes). On mint/pink/sky/tints use ink.
  navy: '#14213D', // footer background
  err: '#A3141F', // inline form errors

  // Surfaces
  card: '#FFFFFF',
  soft: '#F6F2E8', // alternate section band
  lav: '#F8F5FD', // hero and lavender bands, hover fill
  line: '#E4DED0', // borders and dividers
  fieldBorder: '#8A826F', // form field borders
  phBorder: '#A8A08C', // dashed placeholder borders

  // Pastel fills (icon tiles, chips)
  mint: '#BDE8DA',
  pink: '#F3D3EC',
  sky: '#CFE4F7',
  lilac: '#D9C8F2', // hero link highlight, lavender loop border

  // Share Challenges loop card tints
  tintLav: '#F8F5FD',
  tintYellow: '#FFF7E0',
  tintSky: '#EFF5FB',
  tintPink: '#FFF1FC',
  tintCoral: '#FFE5E7',
  coral: '#FFA1A7', // coral loop border and tag
  tintMint: '#EDFEF8',

  // Accent strokes for icons and dark-mode outlines
  accentLav: '#C9B0FF',
  accentYellow: '#F7C948',
  accentSky: '#9CC8F0',
  accentPink: '#F2B8E3',
  accentCoral: '#FF9DA6',
  accentMint: '#8FDCC3',
  noteMint: '#2E8A6E', // loop note icon
  noteCoral: '#C2414B', // loop note icon
  doorMint: '#7FC9B0', // card top border

  // Footer (always on navy, same in both themes)
  footText: '#C9CFDD',
  onDark: '#FFFFFF',
} as const

export type ColorToken = keyof typeof light

const dark: Record<ColorToken, string> = {
  ...light,
  bg: '#14213D',
  soft: '#1A2948',
  lav: '#1E2C52',
  card: '#22325A',
  line: '#3A4A70',
  ink: '#F3F5FA',
  muted: '#C3CADB',
  primary: '#C9B0FF',
  violet: '#DCCCFF',
  mint: '#1D5248',
  sky: '#1F4370',
  pink: '#57304F',
  navy: '#0B1428',
  onPrimary: '#14213D',
  err: '#FF9DA6',
  fieldBorder: '#8C9AB8',
  phBorder: '#8C9AB8',
  lilac: '#4A3F80',
  tintLav: '#2A2550',
  tintYellow: '#3A3420',
  tintSky: '#1E3350',
  tintPink: '#3A2745',
  tintCoral: '#46262C',
  coral: '#9A4A52',
  tintMint: '#1C3B38',
  // Brighter than the prototype (#1D5248 / #9A4A52), which were nearly invisible on navy. Approved by Camila.
  noteMint: '#8FDCC3',
  noteCoral: '#FF9DA6',
}

export const palette: Record<ThemeName, Record<ColorToken, string>> = { light, dark }

/** Light-mode values, for places that need a single static color. */
export const colors = light

export const colorTokens = Object.keys(light) as ColorToken[]

/** CSS variable name for a token, e.g. cssVar('primary') -> '--dll-primary'. */
export const cssVar = (token: ColorToken) =>
  `--dll-${token.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}`

/** '#6B2BC0' -> '107 43 192', so Tailwind opacity modifiers keep working. */
export const hexToRgbChannels = (hex: string) => {
  const n = parseInt(hex.replace('#', ''), 16)
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`
}

/** CSS custom properties for one theme, ready for a :root rule. */
export const themeCssVars = (theme: ThemeName) =>
  Object.fromEntries(
    colorTokens.map((t) => [cssVar(t), hexToRgbChannels(palette[theme][t])])
  ) as Record<string, string>

/** Tailwind color map: bg-dll-primary, text-dll-ink/70, and so on. */
export const tailwindColors = {
  dll: Object.fromEntries(
    colorTokens.map((t) => [
      t.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`),
      `rgb(var(${cssVar(t)}) / <alpha-value>)`,
    ])
  ),
}

/** Atkinson Hyperlegible Next: headings, display, accents. DM Sans: body and labels. */
export const fonts = {
  heading: "'Atkinson Hyperlegible Next', 'Atkinson Hyperlegible', system-ui, sans-serif",
  body: "'DM Sans', system-ui, sans-serif",
} as const

export const tailwindFonts = {
  heading: ['"Atkinson Hyperlegible Next"', '"Atkinson Hyperlegible"', 'system-ui', 'sans-serif'],
  body: ['"DM Sans"', 'system-ui', 'sans-serif'],
}

export const googleFontsHref =
  'https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Next:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700;9..40,800&display=swap'

/** localStorage key for the saved light/dark choice. */
export const THEME_STORAGE_KEY = 'dll-theme'
