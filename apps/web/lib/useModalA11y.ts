import { useEffect, useRef } from 'react'

/**
 * Accessibility helper for modal dialogs.
 *
 * - Closes on Escape key
 * - Traps keyboard focus within the modal (Tab cycles; Shift+Tab reverses)
 * - Restores focus to the element that opened the modal when it closes
 * - Moves initial focus into the modal on mount
 *
 * Returns a ref to attach to the modal's root element.
 */
export function useModalA11y<T extends HTMLElement = HTMLDivElement>(onClose: () => void) {
  const containerRef = useRef<T>(null)

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null
    const container = containerRef.current
    if (!container) return

    const getFocusable = (): HTMLElement[] => {
      const selector = [
        'a[href]',
        'button:not([disabled])',
        'textarea:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
      ].join(',')
      return Array.from(container.querySelectorAll<HTMLElement>(selector)).filter(
        (el) => !el.hasAttribute('aria-hidden') && el.offsetParent !== null,
      )
    }

    const focusables = getFocusable()
    if (focusables.length > 0) {
      focusables[0].focus()
    } else {
      container.focus()
    }

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
        return
      }

      if (e.key !== 'Tab') return

      const items = getFocusable()
      if (items.length === 0) {
        e.preventDefault()
        return
      }

      const first = items[0]
      const last = items[items.length - 1]
      const active = document.activeElement as HTMLElement

      if (e.shiftKey && active === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && active === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKey)

    return () => {
      document.removeEventListener('keydown', handleKey)
      previouslyFocused?.focus?.()
    }
  }, [onClose])

  return containerRef
}
