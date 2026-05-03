import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Legal Disclaimer — Dayli AI',
  description: 'Legal disclaimer for the Dayli AI platform and Daily Living Labs website.',
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
          Legal Disclaimer
        </h1>
        <p className="text-sm text-[#461F65]/70">Daily Living Labs (doing business as Dayli AI)</p>
        <p className="text-sm text-[#461F65]/70">Effective Date: April 13, 2026</p>
        <p className="text-sm text-[#461F65]/70 mb-8">Last updated: April 05, 2026</p>

        <div className="text-[#461F65]/80 leading-relaxed space-y-6 text-[15px]">
          <section>
            <p>This Legal Disclaimer applies to all content, resources, and links provided through the Dayli AI platform and the Daily Living Labs website (collectively, "our Services").</p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#461F65] mb-2">No Medical Advice</h2>
            <p>The content available through our Services is provided for general informational purposes only. Nothing in our Services constitutes medical advice, diagnosis, treatment, or a substitute for professional healthcare consultation. Daily Living Labs is not a healthcare provider, and use of our Services does not create a provider-patient relationship.</p>
            <p>Always consult a qualified healthcare professional before making any decisions about your health, medical treatments, or caregiving practices. Do not disregard professional medical advice or delay seeking it because of information you accessed through our Services.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#461F65] mb-2">Third-Party Content and External Links</h2>
            <p>Our Services retrieve, display, and link to content from third-party sources, including external websites, online forums, community platforms, and other digital resources. This content is provided for informational purposes only.</p>
            <p>Daily Living Labs makes no representations or warranties regarding:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>The accuracy, completeness, reliability, or timeliness of any third-party content</li>
              <li>The quality, safety, or suitability of any solution, product, or service described in third-party content</li>
              <li>The availability or uptime of any third-party website or resource</li>
              <li>Whether any third-party website complies with applicable laws, including the Americans with Disabilities Act (ADA) or Web Content Accessibility Guidelines (WCAG)</li>
            </ul>
            <p>Daily Living Labs is not responsible for the content, practices, or policies of any third-party websites or resources linked to or retrieved through our Services. Your use of any third-party website or resource is at your own risk and subject to the terms and conditions of that third party.</p>
            <p>By using our Services, you acknowledge and agree that Daily Living Labs shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any third-party content, goods, or services available on or through any such linked sites or resources.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#461F65] mb-2">Accessibility of Third-Party Content</h2>
            <p>While Daily Living Labs is committed to making our own platform accessible to all users, including individuals with disabilities, we cannot guarantee or control the accessibility of third-party websites and resources that may be linked to or surfaced through our Services.</p>
            <p>We are not responsible for the accessibility of third-party content, including whether such content meets ADA requirements or WCAG standards. Users who encounter accessibility barriers on third-party sites should contact those sites directly.</p>
            <p>
              If you encounter accessibility issues with our own platform, please contact us at{' '}
              <a href="mailto:info@dailylivinglabs.com" className="text-[#9230E3] underline hover:no-underline focus-visible:outline-2 focus-visible:outline-[#9230E3] focus-visible:outline-offset-2 rounded">
                info@dailylivinglabs.com
              </a>{' '}
              and we will work to address the issue promptly.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#461F65] mb-2">AI-Generated Content</h2>
            <p>Our Services use artificial intelligence to retrieve and recommend resources and solutions based on user needs assessments. AI-generated recommendations are based on available data and are provided for informational purposes only.</p>
            <p>Daily Living Labs does not guarantee the accuracy, completeness, or appropriateness of any AI-generated content or recommendation for your specific situation. You are responsible for independently verifying any information or recommendations before acting on them.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#461F65] mb-2">User Responsibility</h2>
            <p>By using our Services, you acknowledge that:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>You are responsible for independently evaluating any resources, solutions, or third-party content surfaced through our Services</li>
              <li>You are responsible for checking the accessibility, content, and reliability of any external websites you visit through links provided by our Services</li>
              <li>Our Services are not a substitute for professional medical, legal, financial, or other professional advice</li>
              <li>You use our Services and any third-party resources at your own risk</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#461F65] mb-2">Limitation of Liability</h2>
            <p>To the fullest extent permitted by applicable law, Daily Living Labs, its officers, directors, employees, agents, and affiliates shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from or related to your use of or inability to use our Services, including any third-party content accessed through our Services.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#461F65] mb-2">Contact</h2>
            <p>For questions regarding this disclaimer, please contact us at:</p>
            <p>
              Daily Living Labs (doing business as Dayli AI)<br />
              6057 Preston Haven Dr<br />
              Dallas, TX 75230<br />
              United States<br />
              Email:{' '}
              <a href="mailto:info@dailylivinglabs.com" className="text-[#9230E3] underline hover:no-underline focus-visible:outline-2 focus-visible:outline-[#9230E3] focus-visible:outline-offset-2 rounded">
                info@dailylivinglabs.com
              </a>
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
