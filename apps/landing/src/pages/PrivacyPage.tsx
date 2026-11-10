import { Link } from 'react-router-dom'
import LegalDoc from '../components/legal/LegalDoc'
import { useDocumentTitle } from '../lib/useDocumentTitle'

// Text from dll-prototype-v22.html, used as is.
export default function PrivacyPage() {
  useDocumentTitle('Privacy Policy')
  return (
    <LegalDoc title="Privacy Policy" meta="Effective date: November 9, 2026 · Last updated: November 9, 2026">
      <h2>Introduction</h2>
      <p>Daily Living Labs ("we," "us," or "our") is a nonprofit that cares about your privacy. This policy explains what information we collect on dailylivinglabs.com, how we use it, and the choices you have.</p>
      <h2>Information we collect</h2>
      <p><b>Information you give us.</b> When you fill out our Partner or Connect forms, we collect what you enter, such as your name, email address, organization name, and message.</p>
      <p><b>Information collected automatically.</b> When you visit our website, we may collect information about your device and how you use the site, such as your IP address, browser type, pages visited, and time spent on the site. We may use analytics tools, such as Google Analytics, to understand how people use our site. These tools may use cookies.</p>
      <p><b>Your display setting.</b> If you choose light or dark mode, your choice is saved in your own browser so the site remembers it. It is not sent to us.</p>
      <h2>How we use your information</h2>
      <ul>
      <li>Respond to your messages and partnership requests</li>
      <li>Share updates about our programs when you ask us to</li>
      <li>Understand how people use our website so we can improve it</li>
      <li>Meet legal requirements and prevent misuse</li>
      </ul>
      <h2>How we share your information</h2>
      <p>We share information only with service providers that help us run our website, such as Resend, which delivers the messages sent through our forms to our team by email, Vercel, which hosts our website, and analytics providers. We may also share information when the law requires it, or with your permission.</p>
      <p>We do not sell, rent, or trade your personal information.</p>
      <h2>Our community forum and Dayli AI</h2>
      <p>Our community forum and Dayli AI are separate sites with their own policies. When you register or post in the forum, its policies apply:</p>
      <ul>
      <li><a href="https://dailylivinglabs.community.forum/help/privacy-policy/">Forum privacy policy</a></li>
      <li><a href="https://dailylivinglabs.community.forum/help/terms/">Forum terms and rules</a></li>
      <li><a href="https://dailylivinglabs.community.forum/help/cookies/">Forum cookie policy</a></li>
      </ul>
      <h2>Cookies</h2>
      <p>See our <Link to="/cookies">Cookies page</Link> to learn which cookies we use and how to control them.</p>
      <h2>Keeping your information safe</h2>
      <p>We take reasonable steps to protect your information, but no method of sending data over the internet is completely secure.</p>
      <h2>Your rights</h2>
      <ul>
      <li>Ask to see the personal information we have about you</li>
      <li>Ask us to correct or delete it</li>
      <li>Opt out of updates from us</li>
      <li>Control cookies through your browser settings</li>
      </ul>
      <p>To make a request, email us at <a href="mailto:info@dailylivinglabs.com">info@dailylivinglabs.com</a>.</p>
      <h2>Children's privacy</h2>
      <p>Our website is not meant for children under 13, and we do not knowingly collect information from them. Caregivers are welcome to contact us on a child's behalf.</p>
      <h2>Where we operate</h2>
      <p>Our website is run from Texas, United States. Your information may be processed in the United States.</p>
      <h2>Changes to this policy</h2>
      <p>We may update this policy from time to time. We'll post changes on this page with a new "Last updated" date.</p>
      <h2>Contact us</h2>
      <p>Daily Living Labs<br />Texas, United States<br /><a href="mailto:info@dailylivinglabs.com">info@dailylivinglabs.com</a></p>
    </LegalDoc>
  )
}
