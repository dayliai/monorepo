import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import { ThemeRow } from '../ThemeToggle'
import { useRouteFocus } from '../../lib/useRouteFocus'

/** Shared page frame: skip link, header, main content with the theme switch, footer. */
export default function Layout() {
  useRouteFocus()
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main" tabIndex={-1} className="relative outline-none">
        <ThemeRow />
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
