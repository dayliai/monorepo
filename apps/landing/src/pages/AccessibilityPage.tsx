import { Link } from 'react-router-dom'
import LegalDoc from '../components/legal/LegalDoc'
import { useDocumentTitle } from '../lib/useDocumentTitle'

// Text from dll-prototype-v22.html, used as is.
export default function AccessibilityPage() {
  useDocumentTitle('Accessibility')
  return (
    <LegalDoc title="Accessibility Statement" meta="Effective date: November 9, 2026 · Last reviewed: November 9, 2026">
      <h2>Our commitment</h2>
      <p>Daily Living Labs is built by and for the disability community. Accessibility is not a checklist for us. It is the foundation of our mission. We want people of all abilities, using any assistive technology, to be able to use our website to find solutions, share experiences, and connect with others.</p>
      <h2>Conformance status</h2>
      <p>Daily Living Labs aims to conform to the Web Content Accessibility Guidelines (WCAG) 2.2 Level AA. These guidelines explain how to make web content more accessible to people with a wide range of disabilities, including visual, auditory, motor, and cognitive disabilities.</p>
      <p><b>Current status: partially conformant.</b> Our website was built to meet WCAG 2.2 AA, but it has not been fully audited yet. We share where we are in the process openly.</p>
      <h2>What we've built in</h2>
      <p>These pages of dailylivinglabs.com were built against the WCAG 2.2 AA criteria and checked with automated tools: Home, Who We Are, Volunteer, Partner, Projects, Connect, and our policy pages. They include:</p>
      <ul>
      <li>Keyboard navigation, with visible focus outlines</li>
      <li>Strong color contrast in light and dark mode</li>
      <li>Light and dark mode that follow your device setting, with a switch to change them</li>
      <li>Text descriptions for images</li>
      <li>Clear headings and page landmarks for screen readers</li>
      <li>Form errors described in text, not by color alone</li>
      <li>Reduced animation when your device asks for less motion</li>
      <li>Links that open a new tab are marked</li>
      </ul>
      <h2>Known limitations</h2>
      <ul>
      <li><b>Community forum:</b> our forum runs on a separate platform, so its accessibility may differ from this website.</li>
      <li><b>Screen reader testing:</b> we're working toward full testing with VoiceOver, NVDA, and JAWS, and with people who use assistive technology.</li>
      </ul>
      <p>If you run into a barrier in any of these areas, please tell us. User reports go to the top of our list.</p>
      <h2>Compatibility</h2>
      <p>Our website is designed to work with recent versions of Chrome, Safari, Firefox, and Edge, keyboard only navigation, browser zoom up to 200%, and operating system settings for reduced motion and dark mode.</p>
      <h2>How we check</h2>
      <p>We review our work against the WCAG 2.2 AA criteria by hand and with automated tools such as axe and Lighthouse. We plan to ask an outside expert to audit the site in the future.</p>
      <h2>Feedback</h2>
      <p>If something is hard to use, you have a suggestion, or you need information in another format, contact us at <a href="mailto:info@dailylivinglabs.com">info@dailylivinglabs.com</a> or through our <Link to="/connect">Connect page</Link>. We aim to respond within 5 business days.</p>
      <h2>Technical details</h2>
      <p>Our website relies on HTML, CSS, JavaScript, ARIA, and SVG, working together with your browser and assistive technology.</p>
      <h2>Updates to this statement</h2>
      <p>We review this statement at least every three months, and whenever we make changes that affect accessibility.</p>
    </LegalDoc>
  )
}
