import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Accessibility Statement — Dayli AI',
  description:
    'Our commitment to WCAG 2.2 AA conformance, what is conformant today, known limitations, and how to send feedback.',
}

export default function AccessibilityPage() {
  return (
    <div className="flex min-h-screen w-full flex-col font-sans bg-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-lg focus:bg-[#461F65] focus:px-4 focus:py-2 focus:text-white focus:font-semibold focus:shadow-lg"
      >
        Skip to main content
      </a>

      <header className="flex h-[72px] shrink-0 items-center justify-between border-b border-gray-100 bg-white/80 px-6 md:px-12 backdrop-blur-md sticky top-0 z-50">
        <Link href="/" className="transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-[#461F65] focus-visible:outline-offset-2 rounded">
          <img src="/dayli-logotype.png" alt="Dayli AI" className="h-8 md:h-9 object-contain" />
        </Link>
      </header>

      <main id="main-content" tabIndex={-1} className="flex-1 max-w-3xl mx-auto w-full px-4 py-12 focus:outline-none">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#461F65] mb-2">
          Accessibility Statement
        </h1>
        <p className="text-sm text-[#461F65]/70 mb-8">
          Effective Date: May 2, 2026 &middot; Last Reviewed: May 2, 2026
        </p>

        <div className="text-[#461F65]/80 leading-relaxed space-y-6 text-[15px]">
          <section>
            <h2 className="font-serif text-xl font-semibold text-[#461F65] mb-2">
              Our Commitment
            </h2>
            <p>
              Dayli AI is built by and for the disability community. Accessibility is not
              a checklist for us &mdash; it is the foundation of our mission. We are
              committed to ensuring that everyone, regardless of ability or assistive
              technology, can use this app to find solutions, share experiences, and
              connect with others.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#461F65] mb-2">
              Conformance Status
            </h2>
            <p className="mb-2">
              Dayli AI aims to conform to the{' '}
              <a
                href="https://www.w3.org/TR/WCAG22/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#9230E3] underline hover:no-underline focus-visible:outline-2 focus-visible:outline-[#9230E3] focus-visible:outline-offset-2 rounded"
              >
                Web Content Accessibility Guidelines (WCAG) 2.2 Level AA
              </a>
              . These guidelines explain how to make web content more accessible to
              people with a wide range of disabilities, including visual, auditory,
              motor, and cognitive impairments.
            </p>
            <p className="mb-2">
              <strong className="text-[#461F65]">Current status: Partially conformant.</strong>{' '}
              Parts of the app fully meet WCAG 2.2 AA. Other areas are still being
              audited and improved. We are transparent about where we are in the
              process, and we publish each fix as we ship it.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#461F65] mb-2">
              What's Conformant Today
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>The Community page (Recent Pulse, Wins Wall, Circles preview) including its primary navigation</li>
              <li>The Accessibility, Terms, Privacy, and Legal pages</li>
              <li>The home-page footer navigation</li>
              <li>Skip-to-main-content links and visible focus indicators across the app shell</li>
            </ul>
            <p className="mt-2">
              These pages have been built and tested against the full WCAG 2.2 AA
              criteria, including keyboard navigation, visible focus indicators, color
              contrast, semantic landmarks, ARIA roles, and reduced-motion preferences.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#461F65] mb-2">
              Known Limitations
            </h2>
            <p className="mb-2">
              The following areas have not yet completed a full WCAG 2.2 AA audit and
              may have gaps. We are prioritizing these for review:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>The diagnostic and assessment flows</li>
              <li>The dashboard and saved-collections views</li>
              <li>The chat interface (some controls still need accessible names; new-message announcements are being added)</li>
              <li>The profile and account-settings modals (focus management is being hardened)</li>
              <li>The share-solution modal</li>
            </ul>
            <p className="mt-2">
              If you encounter a barrier in any of these areas, please tell us &mdash;
              user reports go to the top of our queue.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#461F65] mb-2">
              Compatibility
            </h2>
            <p className="mb-2">
              Dayli AI is designed to be compatible with:
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
            <h2 className="font-serif text-xl font-semibold text-[#461F65] mb-2">
              Assessment Approach
            </h2>
            <p>
              Our accessibility status is determined through{' '}
              <strong className="text-[#461F65]">self-evaluation</strong>, combining
              manual review against the WCAG 2.2 AA criteria with automated tools
              including Lighthouse and axe DevTools. We plan to commission a third-party
              audit in the future.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#461F65] mb-2">
              Feedback
            </h2>
            <p className="mb-2">
              We welcome your feedback on the accessibility of Dayli AI. If you run into
              a barrier, have a suggestion, or want to share what's working, please
              reach out:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Email:{' '}
                <a
                  href="mailto:info@dailylivinglabs.com"
                  className="text-[#9230E3] underline hover:no-underline focus-visible:outline-2 focus-visible:outline-[#9230E3] focus-visible:outline-offset-2 rounded"
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
            <h2 className="font-serif text-xl font-semibold text-[#461F65] mb-2">
              Technical Specifications
            </h2>
            <p>
              Accessibility of Dayli AI relies on the following technologies: HTML, CSS,
              JavaScript, ARIA, and SVG. These are used in combination with standard
              browser features and assistive technologies.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#461F65] mb-2">
              Updates to This Statement
            </h2>
            <p>
              This statement is reviewed at least quarterly and updated whenever we
              ship changes that meaningfully affect accessibility. The "Last Reviewed"
              date at the top reflects the most recent review.
            </p>
          </section>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-100 px-6 py-12 md:py-16 text-center">
        <p className="text-[14px] text-gray-400">
          © {new Date().getFullYear()} Dayli AI. All rights reserved.
        </p>
      </footer>
    </div>
  )
}
