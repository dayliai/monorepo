import { useTheme } from '../lib/useTheme'

/**
 * Light/dark switch from the prototype. One button with aria-pressed:
 * screen readers hear "Dark mode, toggle button, pressed/not pressed".
 */
export default function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isDark}
      aria-label="Dark mode"
      title="Dark mode"
      className="group inline-flex items-center gap-[5px] min-h-[32px] min-w-[32px] px-2 rounded-full border-2 border-dll-line hover:border-dll-ink bg-dll-card text-dll-ink cursor-pointer"
    >
      <svg
        className={`w-3.5 h-3.5 ${isDark ? 'opacity-[.55]' : 'opacity-100'}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
      <span
        aria-hidden="true"
        className="relative flex-none w-7 h-4 rounded-full border-2 border-current"
      >
        <span
          className={`absolute top-[2px] left-[2px] w-2 h-2 rounded-full bg-current transition-transform duration-150 motion-reduce:transition-none ${
            isDark ? 'translate-x-3' : ''
          }`}
        />
      </span>
      <svg
        className={`w-3.5 h-3.5 ${isDark ? 'opacity-100' : 'opacity-[.55]'}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
      </svg>
    </button>
  )
}

/** Row that floats the toggle at the top right of the page content, under the header. */
export function ThemeRow() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-[5]">
      <div className="max-w-wrap mx-auto px-4 pt-3 flex justify-end">
        <span className="pointer-events-auto">
          <ThemeToggle />
        </span>
      </div>
    </div>
  )
}
