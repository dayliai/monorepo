import { Link } from 'react-router-dom'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-dayli-bg flex flex-col">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Nav />
      <main id="main-content" tabIndex={-1} className="flex-1 max-w-3xl mx-auto w-full px-4 py-12">
        <h1 className="font-heading text-3xl font-bold text-dayli-deep mb-2">Privacy Policy</h1>
        <p className="font-body text-sm text-dayli-deep/40 mb-8">Effective Date: October 13, 2025 &middot; Last Updated: October 13, 2025</p>

        <div className="font-body text-dayli-deep/70 leading-relaxed space-y-6 text-[15px]">
          <section>
            <h2 className="font-heading text-xl font-semibold text-dayli-deep mb-2">Introduction</h2>
            <p>Daily Living Labs ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and protect your information when you use our website.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-dayli-deep mb-2">Information We Collect</h2>
            <p className="mb-2"><strong className="text-dayli-deep">Information You Provide:</strong> When you donate, register, sign up for newsletters, volunteer, or contact us, we may collect your name, email address, mailing address, phone number, payment information, and any other information you provide.</p>
            <p><strong className="text-dayli-deep">Automatically Collected Information:</strong> We automatically collect information about your device and usage, including IP address, browser type, pages visited, and time spent on our site through cookies and similar technologies.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-dayli-deep mb-2">How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Process donations and provide tax receipts</li>
              <li>Communicate about our programs and mission</li>
              <li>Send newsletters and updates (with your consent)</li>
              <li>Respond to inquiries and provide support</li>
              <li>Improve our website and user experience</li>
              <li>Comply with legal obligations and prevent fraud</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-dayli-deep mb-2">How We Share Your Information</h2>
            <p className="mb-2">We may share your information with service providers who help us operate (payment processors, email services, hosting), legal authorities when required by law or to protect our rights, and others with your consent.</p>
            <p>We do not sell, rent, or trade your personal information to third parties for marketing purposes.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-dayli-deep mb-2">Donor Privacy</h2>
            <p>We respect donor privacy and will not share your information with third parties for their marketing. Donor names may be recognized publicly unless you request anonymity.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-dayli-deep mb-2">Cookies</h2>
            <p>We use cookies to enhance your experience. You can control cookies through your browser settings, though this may affect website functionality.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-dayli-deep mb-2">Data Security</h2>
            <p>We implement reasonable security measures to protect your information, but no internet transmission is 100% secure.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-dayli-deep mb-2">Your Rights</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Access and review your personal information</li>
              <li>Request corrections or deletion of your information</li>
              <li>Opt-out of marketing communications</li>
              <li>Control cookies through browser settings</li>
            </ul>
            <p className="mt-2">Contact us to exercise these rights.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-dayli-deep mb-2">Children's Privacy</h2>
            <p>Our website is not intended for children under 13. We do not knowingly collect information from children under 13.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-dayli-deep mb-2">International Users</h2>
            <p>Our website is operated in Texas, United States. Your information may be transferred to and processed in the U.S.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-dayli-deep mb-2">Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated "Last Updated" date.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-dayli-deep mb-2">Contact Us</h2>
            <p>If you have questions about this Privacy Policy, please contact us:</p>
            <p className="mt-1">Daily Living Labs<br />Texas, United States<br />
              <a href="mailto:info@dailylivinglabs.com" className="text-dayli-vibrant hover:underline">info@dailylivinglabs.com</a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
