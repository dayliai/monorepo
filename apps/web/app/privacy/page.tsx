import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy — Dayli AI',
  description: 'How Dayli AI handles your personal information.',
}

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>
        <p className="text-sm text-[#461F65]/70 mb-8">
          Last Updated: May 2, 2026
        </p>

        <div className="text-[#461F65]/80 leading-relaxed space-y-6 text-[15px]">
          <section>
            <p>
              The full Privacy Policy is being finalized. This summary describes how
              Dayli AI handles your information today.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#461F65] mb-2">
              Information We Collect
            </h2>
            <p>
              When you use Dayli AI we collect only the information needed to operate
              the service. This includes account details (such as your email if you
              sign in), the content of conversations and forms you choose to submit,
              and basic usage information that helps us improve the product. We do not
              sell your personal information.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#461F65] mb-2">
              How We Use Information
            </h2>
            <p>
              We use the information you provide to deliver the service, respond to
              your messages, improve our solutions, and keep the platform safe. AI
              conversations are processed to provide responses; we do not use
              identifiable conversation data for advertising.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#461F65] mb-2">
              Your Choices
            </h2>
            <p>
              You can request a copy of the information we hold about you, ask for
              corrections, or ask us to delete your account at any time. Email{' '}
              <a
                href="mailto:info@dailylivinglabs.com"
                className="text-[#9230E3] underline hover:no-underline focus-visible:outline-2 focus-visible:outline-[#9230E3] focus-visible:outline-offset-2 rounded"
              >
                info@dailylivinglabs.com
              </a>{' '}
              and we will respond as quickly as possible.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#461F65] mb-2">
              Updates
            </h2>
            <p>
              We will update this page as the full Privacy Policy is finalized. The
              "Last Updated" date at the top reflects the most recent change.
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
