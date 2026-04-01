import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'

type Theme = 'light' | 'dark' | 'high-contrast' | 'grayscale'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  largerText: boolean
  setLargerText: (enabled: boolean) => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light')
  const [largerText, setLargerTextState] = useState(false)

  const applyTheme = useCallback((t: Theme) => {
    const root = document.documentElement
    root.style.filter = ''
    switch (t) {
      case 'dark':
        root.style.filter = 'invert(1) hue-rotate(180deg)'
        break
      case 'high-contrast':
        root.style.filter = 'contrast(1.5) saturate(1.5)'
        break
      case 'grayscale':
        root.style.filter = 'saturate(0)'
        break
    }
  }, [])

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t)
    applyTheme(t)
  }, [applyTheme])

  const setLargerText = useCallback((enabled: boolean) => {
    setLargerTextState(enabled)
    document.body.style.zoom = enabled ? '1.08' : ''
  }, [])

  useEffect(() => {
    applyTheme(theme)
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, largerText, setLargerText }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
