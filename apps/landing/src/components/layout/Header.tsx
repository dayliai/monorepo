import { useEffect, useRef, useState, type FocusEvent, type KeyboardEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ButterflyLogo from '../ButterflyLogo'
import { buttonClass } from '../ui/Button'
import { forum, mainLinks, waysToHelp } from '../../data/site'

// Shared look for top-level nav items (links and the dropdown button)
const navItem =
  'inline-flex items-center gap-[.35em] min-h-[44px] px-[.85em] py-[.5em] rounded-[10px] font-medium text-dll-ink no-underline bg-transparent border-0 cursor-pointer hover:bg-dll-lav hover:text-dll-violet'
const navItemCurrent = 'bg-dll-lav text-dll-violet'

export default function Header() {
  const { pathname } = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const menuBtnRef = useRef<HTMLButtonElement>(null)
  const ddRef = useRef<HTMLDivElement>(null)
  const ddBtnRef = useRef<HTMLButtonElement>(null)
  const ddMenuRef = useRef<HTMLUListElement>(null)

  const inWaysToHelp = waysToHelp.some((w) => w.to === pathname)

  // Close everything when the page changes.
  useEffect(() => {
    setMobileOpen(false)
    setMenuOpen(false)
  }, [pathname])

  // Close the dropdown on a click outside it.
  useEffect(() => {
    if (!menuOpen) return
    const onClick = (e: MouseEvent) => {
      if (!ddRef.current?.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [menuOpen])

  // Escape closes the mobile menu and returns focus to its button.
  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape' && !menuOpen) {
        setMobileOpen(false)
        menuBtnRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [mobileOpen, menuOpen])

  const menuItems = () => Array.from(ddMenuRef.current?.querySelectorAll<HTMLAnchorElement>('a') ?? [])

  const openMenuAndFocusFirst = () => {
    setMenuOpen(true)
    // Wait for the list to be shown before moving focus into it.
    requestAnimationFrame(() => menuItems()[0]?.focus())
  }

  const onDdButtonKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      openMenuAndFocusFirst()
    } else if (e.key === 'Escape' && menuOpen) {
      e.stopPropagation()
      setMenuOpen(false)
    }
  }

  const onMenuKey = (e: KeyboardEvent) => {
    const items = menuItems()
    const i = items.indexOf(document.activeElement as HTMLAnchorElement)
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      items[(i + 1) % items.length]?.focus()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      items[(i - 1 + items.length) % items.length]?.focus()
    } else if (e.key === 'Escape') {
      e.stopPropagation()
      setMenuOpen(false)
      ddBtnRef.current?.focus()
    }
  }

  // Desktop: close the floating dropdown when focus moves outside it (e.g. Tab past the last item).
  // Phone widths: the list sits inline in the menu, so leave it open. Closing it there would
  // shift the links below it mid-tap and the tap would miss.
  const onDdBlur = (e: FocusEvent) => {
    if (!window.matchMedia('(min-width: 961px)').matches) return
    if (!ddRef.current?.contains(e.relatedTarget as Node | null)) setMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-dll-bg border-b border-dll-line">
      <div className="relative max-w-wrap mx-auto px-4 flex items-center gap-4 min-h-[74px]">
        <Link
          to="/"
          className="flex items-center gap-[10px] min-h-[44px] font-heading font-extrabold text-[1.22rem] text-dll-ink no-underline whitespace-nowrap"
        >
          <ButterflyLogo />
          Daily Living Labs
        </Link>

        <button
          ref={menuBtnRef}
          type="button"
          aria-expanded={mobileOpen}
          aria-controls="site-nav"
          onClick={() => setMobileOpen((o) => !o)}
          className="nav:hidden ml-auto min-h-[44px] px-[.8em] py-[.35em] rounded-[10px] border-2 border-dll-ink bg-transparent font-bold text-dll-ink cursor-pointer"
        >
          Menu
        </button>

        <nav
          id="site-nav"
          aria-label="Main"
          className={`${mobileOpen ? 'flex' : 'hidden'} absolute left-0 right-0 top-full flex-col items-stretch gap-1 px-4 pt-2 pb-[18px] bg-dll-bg border-b border-dll-line shadow-[0_10px_20px_rgba(20,33,61,.08)]
            nav:static nav:flex nav:flex-row nav:items-center nav:ml-auto nav:p-0 nav:border-0 nav:shadow-none nav:bg-transparent`}
        >
          <div ref={ddRef} className="relative" onBlur={onDdBlur}>
            <button
              ref={ddBtnRef}
              type="button"
              aria-expanded={menuOpen}
              aria-controls="ways-menu"
              onClick={() => setMenuOpen((o) => !o)}
              onKeyDown={onDdButtonKey}
              className={`${navItem} w-full justify-between nav:w-auto nav:justify-start ${inWaysToHelp ? navItemCurrent : ''}`}
            >
              Ways to Help
              <span
                aria-hidden="true"
                className={`text-[.8em] transition-transform duration-150 ${menuOpen ? 'rotate-180' : ''}`}
              >
                ▾
              </span>
            </button>
            <ul
              id="ways-menu"
              ref={ddMenuRef}
              hidden={!menuOpen}
              onKeyDown={onMenuKey}
              className="list-none m-0 pl-3 nav:absolute nav:left-0 nav:top-[calc(100%+6px)] nav:min-w-[270px] nav:p-2 nav:bg-dll-card nav:border nav:border-dll-line nav:rounded-[14px] nav:shadow-[0_14px_34px_rgba(20,33,61,.16)] dark:nav:shadow-[0_14px_34px_rgba(0,0,0,.45)]"
            >
              {waysToHelp.map((w) => {
                const current = pathname === w.to
                return (
                  <li key={w.to}>
                    <Link
                      to={w.to}
                      aria-current={current ? 'page' : undefined}
                      className={`block min-h-[44px] px-[.8em] py-[.6em] rounded-[10px] font-semibold no-underline hover:bg-dll-lav focus:bg-dll-lav ${
                        current ? 'bg-dll-lav text-dll-violet' : 'text-dll-ink'
                      }`}
                    >
                      {w.label}
                      <small className="block font-normal text-dll-muted text-[.85rem]">{w.description}</small>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          {mainLinks.map((l) => {
            const current = pathname === l.to
            return (
              <Link
                key={l.to}
                to={l.to}
                aria-current={current ? 'page' : undefined}
                className={`${navItem} ${current ? navItemCurrent : ''}`}
              >
                {l.label}
              </Link>
            )
          })}

          <a href={forum.register} className={buttonClass('primary', 'sm', 'mt-[10px] nav:mt-0 nav:ml-[10px]')}>
            Join the Community
          </a>
        </nav>
      </div>
    </header>
  )
}
