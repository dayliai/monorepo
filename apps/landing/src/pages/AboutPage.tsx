import Nav from '../components/Nav'
import ButterflyLogo from '../components/ButterflyLogo'
import Footer from '../components/Footer'

const partners = [
  { name: 'University of North Texas', initial: 'UNT' },
  { name: 'Aperio Insights', initial: 'AI' },
  { name: 'Clemson University', initial: 'CU' },
]

const pillars = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9230E3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    title: 'Solve Challenges',
    description: 'We help solve issues and challenges related to Activities of Daily Living — connecting people with practical solutions that already exist.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9230E3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    title: 'Build What Doesn\'t Exist',
    description: 'When a solution doesn\'t exist yet, we help brainstorm, design, and build new solutions to daily living challenges.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9230E3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: 'Partner & Collaborate',
    description: 'We partner with universities, organizations, and events to expand the reach and impact of daily living solutions.',
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-dayli-bg flex flex-col">
      <Nav />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 sm:py-24 px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-center mb-6">
              <ButterflyLogo size={64} className="animate-float" />
            </div>
            <p className="font-body text-sm font-semibold text-dayli-vibrant uppercase tracking-widest mb-4">
              About Daily Living Labs
            </p>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-dayli-deep leading-tight mb-6">
              From Ideas to Independence
            </h1>
            <p className="font-body text-lg text-dayli-deep/70 leading-relaxed max-w-2xl mx-auto">
              A community that helps families and caregivers locate what already works — and build what doesn't yet exist — to make daily life easier and more independent.
            </p>
          </div>
        </section>

        {/* What We Do */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-heading text-3xl font-bold text-dayli-deep text-center mb-4">
              What We Do
            </h2>
            <p className="font-body text-dayli-deep/60 text-center mb-14 max-w-xl mx-auto">
              Three pillars that drive our mission
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pillars.map((pillar) => (
                <div
                  key={pillar.title}
                  className="bg-dayli-bg rounded-2xl p-8 text-center border border-dayli-pale"
                >
                  <div className="w-14 h-14 rounded-xl bg-dayli-vibrant/10 flex items-center justify-center mx-auto mb-5">
                    {pillar.icon}
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-dayli-deep mb-3">
                    {pillar.title}
                  </h3>
                  <p className="font-body text-sm text-dayli-deep/60 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ADL Explainer */}
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-heading text-3xl font-bold text-dayli-deep mb-6">
              What are ADLs?
            </h2>
            <p className="font-body text-dayli-deep/70 leading-relaxed mb-8">
              <span className="font-bold text-dayli-vibrant">A</span>ctivities of{' '}
              <span className="font-bold text-dayli-vibrant">D</span>aily{' '}
              <span className="font-bold text-dayli-vibrant">L</span>iving are the fundamental
              tasks we all perform every day — bathing, dressing, eating, mobility, toileting,
              and transferring. When these become difficult due to disability, injury, aging, or
              illness, the impact on independence and dignity is enormous.
            </p>
            <p className="font-body text-dayli-deep/70 leading-relaxed">
              Daily Living Labs exists to bridge the gap — connecting people who face these
              challenges with practical, real-world solutions shared by others who have been there.
            </p>
          </div>
        </section>

        {/* Partners */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-heading text-3xl font-bold text-dayli-deep mb-4">
              Our Partners
            </h2>
            <p className="font-body text-dayli-deep/60 mb-12">
              Working alongside leading institutions to advance daily living solutions
            </p>

            <div className="flex flex-wrap justify-center gap-8">
              {partners.map((partner) => (
                <div
                  key={partner.name}
                  className="bg-dayli-bg rounded-2xl px-8 py-6 border border-dayli-pale flex flex-col items-center min-w-[200px]"
                >
                  <div className="w-14 h-14 rounded-full bg-dayli-vibrant/10 flex items-center justify-center mb-3">
                    <span className="font-heading text-lg font-bold text-dayli-vibrant">
                      {partner.initial}
                    </span>
                  </div>
                  <span className="font-body text-sm font-semibold text-dayli-deep">
                    {partner.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact / CTA */}
        <section className="py-16 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-heading text-3xl font-bold text-dayli-deep mb-4">
              Get Involved
            </h2>
            <p className="font-body text-dayli-deep/70 leading-relaxed mb-8">
              Want to make a difference with solutions you've built or partner with us on new ideas for Daily Living Labs? We'd love to hear from you!
            </p>

            <div className="flex justify-center items-center gap-6 mb-10">
              <a
                href="mailto:info@dailylivinglabs.com"
                aria-label="Email info@dailylivinglabs.com"
                className="w-14 h-14 rounded-full bg-white border-2 border-dayli-pale hover:border-dayli-vibrant hover:bg-dayli-vibrant/5 transition-all flex items-center justify-center shadow-sm hover:shadow-md"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9230E3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </a>

              <span className="group relative">
                <button
                  type="button"
                  aria-label="Instagram — Coming Soon"
                  className="w-14 h-14 rounded-full bg-white border-2 border-dayli-pale hover:border-dayli-vibrant hover:bg-dayli-vibrant/5 transition-all flex items-center justify-center shadow-sm hover:shadow-md cursor-default"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9230E3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </button>
                <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 -top-10 px-3 py-1.5 rounded-md bg-dayli-deep text-white text-xs font-body whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  Coming Soon!
                </span>
              </span>

              <span className="group relative">
                <button
                  type="button"
                  aria-label="X — Coming Soon"
                  className="w-14 h-14 rounded-full bg-white border-2 border-dayli-pale hover:border-dayli-vibrant hover:bg-dayli-vibrant/5 transition-all flex items-center justify-center shadow-sm hover:shadow-md cursor-default"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#9230E3">
                    <path d="M18.244 2H21.5l-7.64 8.73L23 22h-6.77l-5.3-6.94L4.8 22H1.54l8.18-9.34L1 2h6.91l4.79 6.34L18.244 2zm-1.19 18h1.87L7.04 4H5.06l12 16z" />
                  </svg>
                </button>
                <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 -top-10 px-3 py-1.5 rounded-md bg-dayli-deep text-white text-xs font-body whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  Coming Soon!
                </span>
              </span>

              <span className="group relative">
                <button
                  type="button"
                  aria-label="Facebook — Coming Soon"
                  className="w-14 h-14 rounded-full bg-white border-2 border-dayli-pale hover:border-dayli-vibrant hover:bg-dayli-vibrant/5 transition-all flex items-center justify-center shadow-sm hover:shadow-md cursor-default"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9230E3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </button>
                <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 -top-10 px-3 py-1.5 rounded-md bg-dayli-deep text-white text-xs font-body whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  Coming Soon!
                </span>
              </span>
            </div>          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
