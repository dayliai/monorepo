import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Header from '../components/Header'
import ButterflyLogo from '../components/ButterflyLogo'

const PREVIEW_STEPS = [
  'Select your challenges...',
  'Choose sub-categories...',
  'Generating solutions...',
  'Chat with Dayli AI...',
]

export default function LandingScreen() {
  const navigate = useNavigate()
  const [activePreview, setActivePreview] = useState(0)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [formSubmitted, setFormSubmitted] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePreview((prev) => (prev + 1) % PREVIEW_STEPS.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-dayli-bg">
      <Header showSettings={false} />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="font-heading text-5xl sm:text-6xl font-bold text-dayli-deep mb-6">
          Empower Your Daily Life
        </h1>
        <p className="font-body text-lg text-dayli-deep/70 max-w-2xl mx-auto mb-10">
          Discover personalized assistive technology solutions and get expert guidance
          through our diagnostic tool and AI-powered chat.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/diagnostic')}
            className="px-8 py-3 bg-dayli-vibrant text-white font-body font-semibold rounded-xl hover:opacity-90 transition-opacity"
          >
            Try the Diagnostic Tool
          </button>
          <button
            onClick={() => navigate('/chat')}
            className="px-8 py-3 border-2 border-dayli-vibrant text-dayli-vibrant font-body font-semibold rounded-xl hover:bg-dayli-vibrant/10 transition-colors"
          >
            Chat with Dayli AI
          </button>
        </div>
      </section>

      {/* Animated Preview Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="relative bg-white rounded-2xl shadow-lg border border-dayli-pale overflow-hidden p-8 h-48 flex items-center justify-center">
          {PREVIEW_STEPS.map((step, index) => (
            <div
              key={step}
              className="absolute inset-0 flex items-center justify-center transition-opacity duration-700"
              style={{ opacity: activePreview === index ? 1 : 0 }}
            >
              <div className="text-center">
                <div className="flex justify-center gap-2 mb-4">
                  {PREVIEW_STEPS.map((_, dotIdx) => (
                    <div
                      key={dotIdx}
                      className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                        dotIdx <= index ? 'bg-dayli-vibrant' : 'bg-dayli-pale'
                      }`}
                    />
                  ))}
                </div>
                <p className="font-body text-xl text-dayli-deep font-medium">{step}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Signals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Community Tested',
              description:
                'Built with input from real users and disability communities to ensure practical, meaningful solutions.',
            },
            {
              title: 'Accessibility First',
              description:
                'WCAG 2.2 compliant design with large tap targets, clear contrast, and screen reader support throughout.',
            },
            {
              title: 'Privacy Focused',
              description:
                'Your data stays yours. We never sell personal information and all diagnostic data is handled securely.',
            },
          ].map((card) => (
            <div
              key={card.title}
              className="bg-white rounded-2xl p-6 border border-dayli-pale shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="font-heading text-xl font-semibold text-dayli-deep mb-2">
                {card.title}
              </h3>
              <p className="font-body text-dayli-deep/70 text-sm leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* What is Dayli AI Section */}
      <section className="bg-dayli-deep py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <ButterflyLogo size={64} linkTo="" />
          </div>
          <h2 className="font-heading text-3xl font-bold text-white mb-6">
            What is Dayli AI?
          </h2>
          <p className="font-body text-white/80 text-lg leading-relaxed max-w-2xl mx-auto">
            Dayli AI is an assistive technology platform designed to help individuals
            and caregivers discover practical solutions for daily living challenges.
            Whether you need help with mobility, dexterity, vision, or cognitive
            support, our diagnostic tool and AI chat guide you toward the right
            products, strategies, and resources tailored to your unique needs.
          </p>
        </div>
      </section>

      {/* Daily Living Labs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="font-heading text-3xl font-bold text-dayli-deep mb-4">
          Daily Living Labs
        </h2>
        <p className="font-body text-dayli-deep/70 max-w-2xl mx-auto mb-8">
          Explore curated guides, product comparisons, and hands-on tutorials created
          by our community to help you live more independently every day.
        </p>
        <Link
          to="/daily-living-labs"
          className="inline-block px-8 py-3 bg-dayli-vibrant text-white font-body font-semibold rounded-xl hover:opacity-90 transition-opacity"
        >
          Explore Daily Living Labs
        </Link>
      </section>

      {/* Contact Form Section */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <h2 className="font-heading text-3xl font-bold text-dayli-deep mb-8 text-center">
          Get in Touch
        </h2>
        {formSubmitted ? (
          <div className="bg-white rounded-2xl border border-dayli-pale p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-heading text-xl font-semibold text-dayli-deep mb-2">
              Message Sent!
            </h3>
            <p className="font-body text-dayli-deep/70">
              Thank you for reaching out. We'll get back to you soon.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl border border-dayli-pale p-8 space-y-5"
          >
            <div>
              <label htmlFor="contact-name" className="block font-body text-sm font-medium text-dayli-deep mb-1">
                Name
              </label>
              <input
                id="contact-name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-dayli-pale font-body text-dayli-deep focus:outline-none focus:ring-2 focus:ring-dayli-vibrant/50 focus:border-dayli-vibrant transition-colors"
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="block font-body text-sm font-medium text-dayli-deep mb-1">
                Email
              </label>
              <input
                id="contact-email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-dayli-pale font-body text-dayli-deep focus:outline-none focus:ring-2 focus:ring-dayli-vibrant/50 focus:border-dayli-vibrant transition-colors"
              />
            </div>
            <div>
              <label htmlFor="contact-message" className="block font-body text-sm font-medium text-dayli-deep mb-1">
                Message
              </label>
              <textarea
                id="contact-message"
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-dayli-pale font-body text-dayli-deep focus:outline-none focus:ring-2 focus:ring-dayli-vibrant/50 focus:border-dayli-vibrant transition-colors resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-dayli-vibrant text-white font-body font-semibold rounded-xl hover:opacity-90 transition-opacity"
            >
              Send Message
            </button>
          </form>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-dayli-navy py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ButterflyLogo size={28} linkTo="" />
            <span className="font-heading text-lg font-semibold text-white">Dayli AI</span>
          </div>
          <p className="font-body text-white/50 text-sm">
            &copy; {new Date().getFullYear()} Dayli AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
