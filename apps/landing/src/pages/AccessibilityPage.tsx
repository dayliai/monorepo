import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export default function AccessibilityPage() {
  useDocumentTitle('Accessibility Statement')
  return (
    <div className="min-h-screen bg-dayli-bg flex flex-col">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Nav />
      <main id="main-content" tabIndex={-1} className="flex-1 max-w-3xl mx-auto w-full px-4 py-12">
        <h1 className="font-heading text-3xl font-bold text-dayli-deep mb-2">
          Accessibility Statement
        </h1>
        <p className="font-body text-sm text-dayli-deep/70 mb-8">
          Effective Date: April 24, 2026 &middot; Last Reviewed: May 2, 2026
        </p>

        <div className="font-body text-dayli-deep/70 leading-relaxed space-y-6 text-[15px]">
          <section>
            <h2 className="font-heading text-xl font-semibold text-dayli-deep mb-2">
              Our Commitment
            </h2>
            <p>
              Daily Living Labs is built by and for the disability community. Accessibility
              is not a checklist for us &mdash; it is the foundation of our mission. We are
              committed to ensuring that everyone, regardless of ability or assistive
              technology, can use our website to find solutions, share experiences, and
              connect with others.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-dayli-deep mb-2">
              Conformance Status
            </h2>
            <p className="mb-2">
              Daily Living Labs aims to conform to the{' '}
              <a
                href="https://www.w3.org/TR/WCAG22/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-dayli-vibrant hover:underline focus-visible:outline-2 focus-visible:outline-dayli-vibrant focus-visible:outline-offset-2 rounded"
              >
                Web Content Accessibility Guidelines (WCAG) 2.2 Level AA
              </a>
              . These guidelines explain how to make web content more accessible to people
              with a wide range of disabilities, including visual, auditory, motor, and
              cognitive impairments.
            </p>
            <p className="mb-2">
              <strong className="text-dayli-deep">Current status: Partially conformant.</strong>{' '}
              Parts of the site fully meet WCAG 2.2 AA, while other areas are still being
              audited and improved. We are transparent about where we are in the process.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-dayli-deep mb-2">
              What's Conformant Today
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>The dailylivinglabs.com landing site (Home, About, Contribute, Privacy, Terms, Accessibility)</li>
              <li>The Activities of Daily Living section, including the per-activity panel and solution detail modals</li>
              <li>The newsletter signup and the contribute flow's onboarding form</li>
              <li>The Community page on dayliai.org (Recent Pulse, Wins Wall, Circles preview)</li>
            </ul>
            <p className="mt-2">
              These pages have been built and tested against the full WCAG 2.2 AA criteria,
              including keyboard navigation, visible focus indicators, color contrast,
              semantic landmarks, ARIA roles, accessible names on all interactive controls,
              and reduced-motion preferences.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-dayli-deep mb-2">
              Known Limitations
            </h2>
            <p className="mb-2">
              We're still working through the rest of the dayliai.org web app. The
              following areas have not yet completed a full WCAG 2.2 AA audit and may have
              gaps:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>The diagnostic and assessment flows</li>
              <li>The dashboard and saved-collections views</li>
              <li>The chat interface</li>
            </ul>
            <p className="mt-2">
              We're prioritizing these for review. If you encounter a barrier in any of
              these areas, please tell us &mdash; user reports go to the top of our queue.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-dayli-deep mb-2">
              Compatibility
            </h2>
            <p className="mb-2">
              Daily Living Labs is designed to be compatible with:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Recent versions of Chrome, Safari, Firefox, and Edge</li>
              <li>VoiceOver on macOS and iOS</li>
              <li>NVDA and JAWS on Windows (under continued testing)</li>
              <li>Keyboard-only navigation</li>
              <li>Browser zoom up to 200%, with most layouts holding to 400%</li>
              <li>Operating system reduced-motion and high-contrast settings</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-dayli-deep mb-2">
              Assessment Approach
            </h2>
            <p>
              Our accessibility status is determined through{' '}
              <strong className="text-dayli-deep">self-evaluation</strong>, combining
              manual review against the WCAG 2.2 AA criteria with automated tools
              including Lighthouse and axe DevTools. We plan to commission a third-party
              audit in the future.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-dayli-deep mb-2">
              Feedback
            </h2>
            <p className="mb-2">
              We welcome your feedback on the accessibility of Daily Living Labs. If you
              run into a barrier, have a suggestion, or want to share what's working,
              please reach out:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Email:{' '}
                <a
                  href="mailto:info@dailylivinglabs.com"
                  className="text-dayli-vibrant hover:underline focus-visible:outline-2 focus-visible:outline-dayli-vibrant focus-visible:outline-offset-2 rounded"
                >
                  info@dailylivinglabs.com
                </a>
              </li>
            </ul>
            <p className="mt-2">
              We aim to respond to accessibility feedback within 5 business days and to
              resolve confirmed issues as quickly as possible.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-dayli-deep mb-2">
              Technical Specifications
            </h2>
            <p>
              Accessibility of Daily Living Labs relies on the following technologies:
              HTML, CSS, JavaScript, ARIA, and SVG. These are used in combination with
              standard browser features and assistive technologies.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-dayli-deep mb-2">
              Updates to This Statement
            </h2>
            <p>
              This statement is reviewed at least quarterly and updated whenever we ship
              changes that meaningfully affect accessibility. The "Last Reviewed" date at
              the top reflects the most recent review.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
