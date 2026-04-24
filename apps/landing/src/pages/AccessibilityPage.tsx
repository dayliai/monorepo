import Nav from '../components/Nav'
import Footer from '../components/Footer'

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-dayli-bg flex flex-col">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Nav />
      <main id="main-content" tabIndex={-1} className="flex-1 max-w-3xl mx-auto w-full px-4 py-12">
        <h1 className="font-heading text-3xl font-bold text-dayli-deep mb-2">Accessibility Statement</h1>
        <p className="font-body text-sm text-dayli-deep/70 mb-8">
          Last updated: April 16, 2026
        </p>

        <div className="font-body text-dayli-deep/80 leading-relaxed space-y-6 text-[15px]">
          <section>
            <h2 className="font-heading text-xl font-semibold text-dayli-deep mb-2">Our Commitment</h2>
            <p>
              Daily Living Labs is committed to making our website accessible to everyone, including
              people with disabilities. Accessibility isn't just a compliance goal for us — it's core
              to our mission of helping families and caregivers find solutions that support independent
              daily living.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-dayli-deep mb-2">Conformance Target</h2>
            <p>
              We aim to meet{' '}
              <a
                href="https://www.w3.org/WAI/WCAG22/quickref/?currentsidebar=%23col_overview&levels=aaa"
                target="_blank"
                rel="noopener noreferrer"
                className="text-dayli-vibrant hover:underline focus-visible:outline-2 focus-visible:outline-dayli-vibrant focus-visible:outline-offset-2 rounded"
              >
                Web Content Accessibility Guidelines (WCAG) 2.2 Level AA
              </a>
              . These guidelines explain how to make web content more accessible for people with
              disabilities, including those who use assistive technologies.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-dayli-deep mb-2">What We've Done</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Semantic HTML structure with proper landmarks (header, nav, main, footer)</li>
              <li>Keyboard accessibility throughout — every interactive element can be reached and used without a mouse</li>
              <li>Skip-to-main-content link for keyboard and screen reader users</li>
              <li>Visible focus indicators on all interactive elements</li>
              <li>Descriptive labels on all buttons, links, and form controls</li>
              <li>Modal dialogs with correct ARIA roles, focus trapping, and Escape key support</li>
              <li>Color contrast that meets WCAG 2.2 AA minimums</li>
              <li>Respect for user preferences including <code className="font-mono bg-dayli-pale px-1 py-0.5 rounded text-sm">prefers-reduced-motion</code></li>
              <li>Alt text on images and appropriate handling of decorative imagery</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-dayli-deep mb-2">Known Limitations</h2>
            <p>
              We're continuously improving. If you encounter an accessibility barrier or notice
              something that could be better, we want to hear about it. Reports from the community
              help us prioritize improvements.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-dayli-deep mb-2">Accommodation Requests &amp; Feedback</h2>
            <p className="mb-3">
              If you need content in an alternative format, run into an accessibility barrier, or
              have feedback about how we can improve, please contact us. We aim to respond within
              two business days.
            </p>
            <p>
              <strong className="text-dayli-deep">Email:</strong>{' '}
              <a
                href="mailto:info@dailylivinglabs.com?subject=Accessibility%20feedback"
                className="text-dayli-vibrant hover:underline focus-visible:outline-2 focus-visible:outline-dayli-vibrant focus-visible:outline-offset-2 rounded"
              >
                info@dailylivinglabs.com
              </a>
            </p>
            <p className="mt-2">
              When reporting an issue, it helps to include:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-1">
              <li>The page URL where the issue occurred</li>
              <li>A description of the problem</li>
              <li>Your browser and assistive technology (if any)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-dayli-deep mb-2">Assessment Approach</h2>
            <p>
              This site is evaluated through a combination of manual review against WCAG 2.2 Level
              AA success criteria, keyboard-only navigation testing, and color contrast analysis.
              We update this statement as the site changes.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-dayli-deep mb-2">Formal Complaints</h2>
            <p>
              We take accessibility seriously and will work to resolve any issues directly. If you
              are not satisfied with our response, you may file a complaint with the appropriate
              authority in your jurisdiction, such as the U.S. Department of Justice under the
              Americans with Disabilities Act (ADA).
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
