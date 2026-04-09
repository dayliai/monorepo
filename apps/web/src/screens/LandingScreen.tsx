import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Search, MessageSquare, ArrowRight, ShieldCheck, Database, Users } from 'lucide-react'
import Header from '../components/Header'
import ButterflyLogo from '../components/ButterflyLogo'

export default function LandingScreen() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [formSubmitted, setFormSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-white">
      <Header showSettings={false} />

      {/* Hero Section */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-dayli-cyan-50 rounded-full px-4 py-2 shadow-sm mb-8">
          <span className="text-dayli-cyan-500 text-xs font-bold uppercase tracking-wider font-body">
            Meet Your AI Assistant
          </span>
        </div>

        <h1 className="font-heading text-5xl sm:text-6xl font-bold text-dayli-charcoal mb-6 leading-tight">
          Empowering Your Daily Life
        </h1>

        <p className="font-body text-xl text-dayli-gray max-w-xl mx-auto mb-10 leading-relaxed">
          Find a solution to improve daily life or chat with Dayli AI for
          personalized support, customized perfectly to your needs.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/diagnostic')}
            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-dayli-dark text-white font-body font-bold text-base rounded-full shadow-[0_8px_20px_rgba(74,21,75,0.3)] hover:opacity-90 transition-opacity"
          >
            <Search size={20} />
            Start Diagnostic Tool
          </button>
          <button
            onClick={() => navigate('/chat')}
            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white border-2 border-dayli-cyan-500 text-dayli-cyan-500 font-body font-bold text-base rounded-full hover:bg-dayli-cyan-50 transition-colors"
          >
            <MessageSquare size={20} />
            Chat with Dayli AI
          </button>
        </div>
      </section>

      {/* Phone Mockup Preview Section */}
      <section className="relative overflow-hidden py-16">
        {/* Gradient background */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(243,232,244,0) 0%, rgba(243,232,244,0.5) 50%, rgba(243,232,244,0) 100%)',
          }}
        />
        <div className="relative max-w-3xl mx-auto px-4 flex items-center justify-center gap-6">
          {/* Left phone - Diagnostic */}
          <div className="transform -rotate-2">
            <div className="bg-white border-[6px] border-dayli-gray-100 rounded-[32px] shadow-[0_16px_40px_rgba(0,0,0,0.08)] w-[240px] sm:w-[280px] h-[300px] sm:h-[350px] overflow-hidden">
              <div className="bg-dayli-gray-50/50 border-b border-dayli-gray-100 h-11 flex items-center justify-center">
                <div className="w-20 h-2 bg-dayli-gray-200 rounded-full" />
              </div>
              <div className="p-5">
                <p className="font-heading text-base font-bold text-dayli-charcoal mb-4 leading-snug">
                  What areas do you need support with?
                </p>
                <div className="space-y-3">
                  {[80, 56, 68].map((w, i) => (
                    <div key={i} className="border-2 border-dayli-gray-100 rounded-xl p-3 flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-dayli-gray-200 shrink-0" />
                      <div className={`h-2.5 bg-dayli-gray-300 rounded-full`} style={{ width: `${w}px` }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right phone - Chat */}
          <div className="transform rotate-2">
            <div className="bg-white border-[6px] border-dayli-gray-100 rounded-[32px] shadow-[0_16px_40px_rgba(0,0,0,0.08)] w-[240px] sm:w-[280px] h-[300px] sm:h-[350px] overflow-hidden">
              <div className="bg-dayli-gray-50/50 border-b border-dayli-gray-100 h-11 flex items-center gap-3 px-4">
                <div className="w-7 h-7 bg-dayli-cyan-50 rounded-full flex items-center justify-center">
                  <MessageSquare size={14} className="text-dayli-cyan-500" />
                </div>
                <div className="w-16 h-2.5 bg-dayli-charcoal rounded-full" />
              </div>
              <div className="p-4 bg-[#fdfafb] h-full">
                <div className="mt-28">
                  <div className="bg-white border border-dayli-gray-100 rounded-tl-2xl rounded-tr-2xl rounded-br-2xl shadow-sm p-3 w-32 mb-3">
                    <div className="space-y-2">
                      <div className="h-2 bg-dayli-gray-300 rounded-full w-full" />
                      <div className="h-2 bg-dayli-gray-300 rounded-full w-full" />
                      <div className="h-2 bg-dayli-gray-300 rounded-full w-3/4" />
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-8 left-4 right-4">
                  <div className="border-2 border-dayli-gray-200 bg-dayli-gray-50 rounded-full h-11 flex items-center px-4">
                    <div className="w-1 h-3 bg-dayli-gray-200 rounded-full" />
                    <div className="ml-auto w-7 h-7 bg-dayli-gray-300 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="border-t border-dayli-gray-100 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: ShieldCheck,
                title: 'Trusted by Caregivers',
                description: 'Verified strategies tested for actual daily use.',
                bg: 'bg-dayli-purple-50',
              },
              {
                icon: Database,
                title: 'Thousands of Solutions',
                description: 'A massive database of adaptive tools to discover.',
                bg: 'bg-dayli-cyan-50',
              },
              {
                icon: Users,
                title: 'Community Tested',
                description: 'Rigorous evaluation of every single tool.',
                bg: 'bg-dayli-pink-50',
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4">
                <div className={`${item.bg} w-16 h-16 rounded-[20px] flex items-center justify-center shrink-0`}>
                  <item.icon size={28} className="text-dayli-charcoal" />
                </div>
                <div>
                  <h3 className="font-body text-lg font-bold text-dayli-charcoal mb-1">
                    {item.title}
                  </h3>
                  <p className="font-body text-[15px] text-dayli-gray leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What is Dayli AI? Section */}
      <section className="bg-dayli-dark py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-8">
            <ButterflyLogo size={96} linkTo="" />
          </div>
          <h2 className="font-heading text-4xl font-bold text-white mb-6">
            What is Dayli AI?
          </h2>
          <p className="font-body text-xl text-dayli-gray-300 leading-relaxed max-w-2xl mx-auto">
            Dayli AI is a personalized intelligence tool specifically designed to help people
            living with disabilities, their families, and caregivers navigate the massive world
            of adaptive equipment and daily living strategies.
          </p>
        </div>
      </section>

      {/* Daily Living Labs Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Decorative blur blob */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-dayli-purple-50 rounded-full blur-[64px] opacity-50 -translate-y-1/2" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-4xl sm:text-5xl font-bold text-dayli-charcoal mb-2 leading-tight">
            Real-Life Solutions Powered By
          </h2>
          <h2 className="font-heading text-4xl sm:text-5xl font-bold text-dayli-dark mb-6">
            Daily Living Labs
          </h2>
          <p className="font-body text-xl text-dayli-gray max-w-xl mx-auto mb-10 leading-relaxed">
            Our AI engine is fueled by human-tested, rigorously verified solutions
            documented by Daily Living Labs.
          </p>
          <Link
            to="/daily-living-labs"
            className="inline-flex items-center gap-2 px-8 py-4 border-2 border-dayli-dark text-dayli-dark font-body font-bold text-base rounded-full hover:bg-dayli-purple-50 transition-colors"
          >
            Learn more about the Lab
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="bg-dayli-gray-50 border-t border-dayli-gray-100 py-24">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
          {formSubmitted ? (
            <div className="bg-white rounded-[40px] border border-dayli-gray-100 shadow-[0_8px_24px_rgba(0,0,0,0.04)] p-12 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-heading text-2xl font-bold text-dayli-charcoal mb-2">
                Message Sent!
              </h3>
              <p className="font-body text-dayli-gray">
                Thank you for reaching out. We'll get back to you soon.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-[40px] border border-dayli-gray-100 shadow-[0_8px_24px_rgba(0,0,0,0.04)] p-12"
            >
              <h2 className="font-heading text-3xl font-bold text-dayli-charcoal text-center mb-2">
                Get in Touch
              </h2>
              <p className="font-body text-base text-dayli-gray text-center mb-8">
                Have a question or want to partner with us? Drop a line.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-dayli-gray-200 bg-dayli-gray-50 font-body text-base text-dayli-charcoal placeholder:text-dayli-charcoal/50 focus:outline-none focus:border-dayli-vibrant transition-colors"
                />
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-dayli-gray-200 bg-dayli-gray-50 font-body text-base text-dayli-charcoal placeholder:text-dayli-charcoal/50 focus:outline-none focus:border-dayli-vibrant transition-colors"
                />
              </div>

              <textarea
                required
                rows={5}
                placeholder="How can we help?"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-5 py-4 rounded-2xl border-2 border-dayli-gray-200 bg-dayli-gray-50 font-body text-base text-dayli-charcoal placeholder:text-dayli-charcoal/50 focus:outline-none focus:border-dayli-vibrant transition-colors resize-none mb-5"
              />

              <button
                type="submit"
                className="w-full py-4 bg-dayli-charcoal text-white font-body font-bold text-base rounded-2xl hover:opacity-90 transition-opacity"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-dayli-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-4">
            <ButterflyLogo size={24} linkTo="" className="opacity-40" />
          </div>
          <p className="font-body text-sm text-dayli-gray-400 mb-4">
            &copy; {new Date().getFullYear()} Dayli AI. All rights reserved.
          </p>
          <div className="flex items-center justify-center gap-6">
            <span className="font-body text-sm font-medium text-dayli-gray cursor-pointer hover:text-dayli-charcoal transition-colors">
              Privacy Policy
            </span>
            <span className="text-dayli-gray text-sm">•</span>
            <span className="font-body text-sm font-medium text-dayli-gray cursor-pointer hover:text-dayli-charcoal transition-colors">
              Terms of Service
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
