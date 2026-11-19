import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import { useRouteFocus } from '../../lib/useRouteFocus'

/** Shared page frame: skip link, header, main content, footer (the theme switch is at the end of the nav). */
export default function Layout() {
  useRouteFocus()
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main" tabIndex={-1} className="relative outline-none">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
