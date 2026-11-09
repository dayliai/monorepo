import LegalDoc from '../components/legal/LegalDoc'
import { useDocumentTitle } from '../lib/useDocumentTitle'

// Text from dll-prototype-v22.html, used as is.
export default function TermsPage() {
  useDocumentTitle('Terms of Service')
  return (
    <LegalDoc title="Terms of Service" meta="Effective date: November 9, 2026 · Last updated: November 9, 2026">
      <h2>Agreement to these terms</h2>
      <p>By using the Daily Living Labs website, you agree to these Terms of Service. If you do not agree, please do not use our website.</p>
      <h2>Using our website</h2>
      <p>Please use our website only for lawful purposes. You may not:</p>
      <ul>
      <li>Break any laws or regulations</li>
      <li>Infringe on anyone's intellectual property</li>
      <li>Send harmful, offensive, or illegal content</li>
      <li>Try to access our systems without permission</li>
      <li>Use automated tools to access the website without permission</li>
      <li>Interfere with other people's use of the website</li>
      </ul>
      <h2>Community forum accounts</h2>
      <p>Accounts are created on our community forum, not on this website. The forum has its own <a href="https://dailylivinglabs.community.forum/help/terms/">terms and rules</a>, which apply when you register or post there.</p>
      <h2>Content and ownership</h2>
      <p>Text, graphics, and logos created by Daily Living Labs belong to Daily Living Labs and are protected by copyright and trademark laws. Please ask us before reproducing, sharing, or changing them.</p>
      <p>Some photos on our website belong to other photographers and are used under their licenses. These photos stay the property of their owners and are listed in our photo credits. Partner logos belong to their organizations.</p>
      <p>When you send us something through our forms, you confirm that you have the right to share it.</p>
      <h2>Disclaimers</h2>
      <p>Our website is provided "as is." We work to keep it accurate and available, but we cannot promise it will be free of errors or interruptions. Information on our website is for general purposes and is not professional, medical, or legal advice.</p>
      <h2>Limitation of liability</h2>
      <p>Daily Living Labs and its directors, officers, staff, and volunteers are not liable for indirect, incidental, or consequential damages that come from using the website, including loss of data or interruption.</p>
      <h2>Indemnification</h2>
      <p>You agree to protect Daily Living Labs from claims, damages, or expenses that come from your use of the website or from breaking these terms.</p>
      <h2>Links to other sites</h2>
      <p>Our website links to other sites, such as our forum, Dayli AI, and our partners. We are not responsible for the content or practices of sites we do not run.</p>
      <h2>Ending access</h2>
      <p>We may limit or end your access to the website if you break these terms.</p>
      <h2>Governing law</h2>
      <p>These terms follow the laws of Texas, United States. Disputes will be handled in Texas courts.</p>
      <h2>Changes to these terms</h2>
      <p>We may update these terms from time to time. If you keep using the website after changes are posted, you accept the updated terms.</p>
      <h2>Contact</h2>
      <p>Daily Living Labs<br />Texas, United States<br /><a href="mailto:info@dailylivinglabs.com">info@dailylivinglabs.com</a></p>
    </LegalDoc>
  )
}
