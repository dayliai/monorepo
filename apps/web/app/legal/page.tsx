import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Legal — Dayli AI',
  description: 'Legal information about Dayli AI, including governing law and notices.',
}

export default function LegalPage() {
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
          Legal
        </h1>
        <p className="text-sm text-[#461F65]/70 mb-8">
          Last Updated: May 2, 2026
        </p>

        <div className="text-[#461F65]/80 leading-relaxed space-y-6 text-[15px]">
          <section>
            <p>
              The full legal information page is being prepared. The summary below
              covers the basics today; this page will be updated as more detail is
              published.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#461F65] mb-2">
              Operator
            </h2>
            <p>
              Dayli AI is a product of Daily Living Labs. For business or legal
              correspondence, please email{' '}
              <a
                href="mailto:info@dailylivinglabs.com"
                className="text-[#9230E3] underline hover:no-underline focus-visible:outline-2 focus-visible:outline-[#9230E3] focus-visible:outline-offset-2 rounded"
              >
                info@dailylivinglabs.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#461F65] mb-2">
              Trademarks &amp; Content
            </h2>
            <p>
              "Dayli AI" and "Daily Living Labs" are trademarks of Daily Living Labs.
              Other names may be trademarks of their respective owners. Content
              contributed by community members remains the property of those members,
              shared under the license described in our Terms &amp; Conditions.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#461F65] mb-2">
              Reporting Issues
            </h2>
            <p>
              If you believe content on Dayli AI infringes your rights, or if you have
              any other legal concern, please contact us at the email above and
              include enough detail for us to investigate. We aim to respond within 5
              business days.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#461F65] mb-2">
              Related Documents
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <Link
                  href="/terms"
                  className="text-[#9230E3] underline hover:no-underline focus-visible:outline-2 focus-visible:outline-[#9230E3] focus-visible:outline-offset-2 rounded"
                >
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-[#9230E3] underline hover:no-underline focus-visible:outline-2 focus-visible:outline-[#9230E3] focus-visible:outline-offset-2 rounded"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/accessibility"
                  className="text-[#9230E3] underline hover:no-underline focus-visible:outline-2 focus-visible:outline-[#9230E3] focus-visible:outline-offset-2 rounded"
                >
                  Accessibility Statement
                </Link>
              </li>
            </ul>
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
