import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * After moving to another page, start at the top and move keyboard and
 * screen reader focus to the page's h1, as the prototype does.
 * For links to a section (e.g. /volunteer#open-challenges), scroll there
 * and focus that section's heading instead.
 * Does nothing on the first page load, so the browser starts at the top.
 */
export function useRouteFocus() {
  const { pathname, hash } = useLocation()
  const first = useRef(true)

  useEffect(() => {
    if (first.current) {
      first.current = false
      // A section link opened directly still needs to scroll to its section.
      if (hash) requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView())
      return
    }
    // The skip link changes the hash to #main; the browser already handles that.
    if (hash === '#main') return

    const focus = (el: HTMLElement | null) => {
      if (!el) return
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1')
      el.focus({ preventScroll: true })
    }

    // Wait a frame so the new page has rendered.
    requestAnimationFrame(() => {
      const section = hash ? document.getElementById(hash.slice(1)) : null
      if (section) {
        focus(section.querySelector<HTMLElement>('h1, h2'))
        section.scrollIntoView()
      } else {
        window.scrollTo(0, 0)
        focus(document.querySelector<HTMLElement>('#main h1'))
      }
    })
  }, [pathname, hash])
}
