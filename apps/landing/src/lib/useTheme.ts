import { useCallback, useEffect, useState } from 'react'
import { THEME_STORAGE_KEY, type ThemeName } from '@dayli/ui'

const readSaved = (): ThemeName | null => {
  try {
    const t = localStorage.getItem(THEME_STORAGE_KEY)
    return t === 'light' || t === 'dark' ? t : null
  } catch {
    return null
  }
}

const apply = (t: ThemeName) => document.documentElement.setAttribute('data-theme', t)

/**
 * Light/dark theme. Follows the device until the person picks a mode,
 * then remembers that choice in localStorage. The first value is set by
 * the inline script in index.html before React loads.
 */
export function useTheme() {
  const [theme, setThemeState] = useState<ThemeName>(() =>
    document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
  )

  // Keep following the device while no choice has been saved.
  useEffect(() => {
    if (!window.matchMedia) return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (e: MediaQueryListEvent) => {
      if (readSaved()) return
      const t = e.matches ? 'dark' : 'light'
      apply(t)
      setThemeState(t)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const toggle = useCallback(() => {
    setThemeState((prev) => {
      const next: ThemeName = prev === 'dark' ? 'light' : 'dark'
      apply(next)
      try {
        localStorage.setItem(THEME_STORAGE_KEY, next)
      } catch {
        // Storage blocked: the switch still works for this visit.
      }
      return next
    })
  }, [])

  return { theme, toggle }
}
