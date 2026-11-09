import { Link } from 'react-router-dom'
import LegalDoc from '../components/legal/LegalDoc'
import ExternalLink from '../components/ui/ExternalLink'
import { useDocumentTitle } from '../lib/useDocumentTitle'

// Text from dll-prototype-v22.html, used as is.
export default function CookiesPage() {
  useDocumentTitle('Cookies')
  return (
    <LegalDoc title="Cookies" meta="Effective date: November 9, 2026 · Last updated: November 9, 2026">
      <h2>What cookies are</h2>
      <p>Cookies are small text files that a website saves in your browser. They help the site work and help us understand how it's used.</p>
      <h2>Cookies we use</h2>
      <p><b>Analytics cookies.</b> We may use analytics tools, such as Google Analytics, to understand how people use our site, such as which pages are visited most. This helps us improve the site. These tools may set cookies.</p>
      <p><b>Your display setting.</b> Your light or dark mode choice is saved in your browser's local storage, not in a cookie, and it stays on your device.</p>
      <p>We do not use cookies for advertising.</p>
      <h2>Controlling cookies</h2>
      <p>You can block or delete cookies in your browser settings. Blocking analytics cookies won't stop the website from working. You can also use the <ExternalLink href="https://tools.google.com/dlpage/gaoptout">Google Analytics opt out browser add on</ExternalLink>.</p>
      <h2>Our community forum</h2>
      <p>Our forum sets its own cookies, for example to keep you signed in. See the <a href="https://dailylivinglabs.community.forum/help/cookies/">forum cookie policy</a>.</p>
      <h2>Questions</h2>
      <p>Email us at <a href="mailto:info@dailylivinglabs.com">info@dailylivinglabs.com</a>. For more about how we handle your information, see our <Link to="/privacy">Privacy Policy</Link>.</p>
    </LegalDoc>
  )
}
