import type { Metadata } from 'next'
import Link from 'next/link'
import { AuthButton } from '@/components/AuthButton'

export const metadata: Metadata = {
  title: 'Accessibility — Dayli AI',
  description:
    'Dayli AI accessibility statement. We aim to meet WCAG 2.2 Level AA. Contact us for accommodations or feedback.',
}

export default function AccessibilityPage() {
  return (
    <div className="flex min-h-screen w-full flex-col font-sans bg-white">
      <header className="flex h-[72px] shrink-0 items-center justify-between border-b border-gray-100 bg-white px-6 md:px-12 sticky top-0 z-50">
        <Link href="/" className="transition-transform hover:scale-105" aria-label="Dayli AI home">
          <img src="/dayli-logotype.png" alt="Dayli AI" className="h-8 md:h-9 object-contain" />
        </Link>
        <AuthButton showText />
      </header>

      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 max-w-3xl mx-auto w-full px-6 py-12 focus:outline-none"
      >
        <h1 className="font-serif text-[32px] md:text-[40px] font-bold text-[#121928] mb-2">
          Accessibility Statement
        </h1>
        <p className="text-sm text-[#4b5563] mb-8">Last updated: April 24, 2026</p>

        <div className="text-[#1f2937] leading-relaxed space-y-6 text-[15px] md:text-[16px]">
          <section>
            <h2 className="font-serif text-xl md:text-2xl font-semibold text-[#121928] mb-2">
              Our Commitment
            </h2>
            <p>
              Dayli AI is committed to making our platform accessible to everyone, including
              people with disabilities. Accessibility isn&apos;t just a compliance goal for us — it
              is core to our mission of helping people, families, and caregivers find solutions
              that support independent daily living.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl md:text-2xl font-semibold text-[#121928] mb-2">
              Conformance Target
            </h2>
            <p>
              We aim to meet{' '}
              <a
                href="https://www.w3.org/WAI/WCAG22/quickref/?currentsidebar=%23col_overview&levels=aaa"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#4A154B] underline hover:text-[#310D32]"
              >
                Web Content Accessibility Guidelines (WCAG) 2.2 Level AA
              </a>
              . These guidelines explain how to make web content more accessible for people with
              disabilities, including those who use assistive technologies.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl md:text-2xl font-semibold text-[#121928] mb-2">
              What We&apos;ve Done
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Semantic HTML structure with proper landmarks (header, nav, main, footer)</li>
              <li>Keyboard accessibility throughout — every interactive element can be reached and used without a mouse</li>
              <li>Skip-to-main-content link for keyboard and screen reader users</li>
              <li>Visible focus indicators on all interactive elements</li>
              <li>Descriptive labels on all buttons, links, and form controls</li>
              <li>Modal dialogs with correct ARIA roles, focus trapping, focus restore, and Escape key support</li>
              <li>Color contrast that meets WCAG 2.2 AA minimums (4.5:1 for body text)</li>
              <li>
                Respect for user preferences including{' '}
                <code className="font-mono bg-[#F3E8F4] px-1 py-0.5 rounded text-sm">prefers-reduced-motion</code>
              </li>
              <li>Decorative images marked as such; informative images have descriptive alt text</li>
              <li>Built-in dark, high-contrast, large-text, and grayscale display modes</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl md:text-2xl font-semibold text-[#121928] mb-2">
              Known Limitations
            </h2>
            <p>
              We&apos;re continuously improving. If you encounter an accessibility barrier or notice
              something that could be better, we want to hear about it. Reports from the community
              help us prioritize improvements.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl md:text-2xl font-semibold text-[#121928] mb-2">
              Accommodation Requests &amp; Feedback
            </h2>
            <p className="mb-3">
              If you need content in an alternative format, run into an accessibility barrier, or
              have feedback about how we can improve, please contact us. We aim to respond within
              two business days.
            </p>
            <p>
              <strong className="text-[#121928]">Email:</strong>{' '}
              <a
                href="mailto:info@dailylivinglabs.com?subject=Accessibility%20feedback"
                className="text-[#4A154B] underline hover:text-[#310D32]"
              >
                info@dailylivinglabs.com
              </a>
            </p>
            <p className="mt-2">When reporting an issue, it helps to include:</p>
            <ul className="list-disc pl-5 space-y-1 mt-1">
              <li>The page URL where the issue occurred</li>
              <li>A description of the problem</li>
              <li>Your browser and assistive technology (if any)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl md:text-2xl font-semibold text-[#121928] mb-2">
              Assessment Approach
            </h2>
            <p>
              This site is evaluated through a combination of manual review against WCAG 2.2 Level
              AA success criteria, keyboard-only navigation testing, and color contrast analysis.
              We update this statement as the site changes.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl md:text-2xl font-semibold text-[#121928] mb-2">
              Formal Complaints
            </h2>
            <p>
              We take accessibility seriously and will work to resolve any issues directly. If you
              are not satisfied with our response, you may file a complaint with the appropriate
              authority in your jurisdiction, such as the U.S. Department of Justice under the
              Americans with Disabilities Act (ADA).
            </p>
          </section>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-100 px-6 py-8 text-center">
        <p className="text-sm text-gray-700">
          © {new Date().getFullYear()} Dayli AI ·{' '}
          <Link href="/" className="text-[#4A154B] hover:underline">Home</Link>
        </p>
      </footer>
    </div>
  )
}
