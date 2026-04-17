import { Link } from 'react-router-dom'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-dayli-bg flex flex-col">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Nav />
      <main id="main-content" tabIndex={-1} className="flex-1 max-w-3xl mx-auto w-full px-4 py-12">
        <h1 className="font-heading text-3xl font-bold text-dayli-deep mb-2">Terms of Service</h1>
        <p className="font-body text-sm text-dayli-deep/40 mb-8">Effective Date: October 13, 2025 &middot; Last Updated: October 13, 2025</p>

        <div className="font-body text-dayli-deep/70 leading-relaxed space-y-6 text-[15px]">
          <section>
            <h2 className="font-heading text-xl font-semibold text-dayli-deep mb-2">Agreement to Terms</h2>
            <p>By accessing or using the Daily Living Labs website, you agree to these Terms of Service. If you do not agree, please do not use our website.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-dayli-deep mb-2">Acceptable Use</h2>
            <p className="mb-2">You agree to use our website only for lawful purposes. You may not:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Transmit harmful, offensive, or illegal content</li>
              <li>Attempt unauthorized access to our systems</li>
              <li>Use automated tools to access the website without permission</li>
              <li>Interfere with others' use of the website</li>
            </ul>
            <p className="mt-2">If you create an account, you are responsible for maintaining its confidentiality and all activities under it.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-dayli-deep mb-2">Intellectual Property</h2>
            <p className="mb-2">All website content (text, graphics, logos, images, videos) is owned by Daily Living Labs and protected by copyright and trademark laws. You may not reproduce, distribute, or modify our content without written permission.</p>
            <p>If you submit content to our website, you grant us the right to use, reproduce, and display it. You confirm that you own the rights to any content you submit and that it does not violate third-party rights.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-dayli-deep mb-2">Donations</h2>
            <p>Donations to Daily Living Labs may be tax-deductible as permitted by law. We will provide receipts for tax purposes. All donations are final and non-refundable except in cases of processing errors or where required by law. We use third-party payment processors and do not store full credit card information.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-dayli-deep mb-2">Disclaimers</h2>
            <p>Our website is provided "as is" without warranties of any kind. We do not guarantee that the website will be error-free, uninterrupted, or secure. The information on our website is for general purposes only and should not be relied upon as professional advice.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-dayli-deep mb-2">Limitation of Liability</h2>
            <p>Daily Living Labs and its directors, officers, employees, and volunteers are not liable for any indirect, incidental, or consequential damages arising from your use of the website, including loss of data, profits, or business interruption.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-dayli-deep mb-2">Indemnification</h2>
            <p>You agree to defend and hold harmless Daily Living Labs from any claims, damages, or expenses arising from your use of the website or violation of these Terms.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-dayli-deep mb-2">Third-Party Links</h2>
            <p>Our website may link to third-party websites. We are not responsible for their content or practices.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-dayli-deep mb-2">Termination</h2>
            <p>We may terminate your access to the website at any time for violating these Terms.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-dayli-deep mb-2">Governing Law</h2>
            <p>These Terms are governed by the laws of Texas, United States. Any disputes will be resolved in Texas courts.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-dayli-deep mb-2">Changes to Terms</h2>
            <p>We may update these Terms at any time. Continued use of the website after changes constitutes acceptance of the new Terms.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-dayli-deep mb-2">Contact</h2>
            <p>Daily Living Labs<br />Texas, United States<br />
              <a href="mailto:info@dailylivinglabs.com" className="text-dayli-vibrant hover:underline">info@dailylivinglabs.com</a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
