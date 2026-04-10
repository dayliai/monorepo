'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  MessageSquare,
  Search,
  Sparkles,
  ShieldCheck,
  HeartHandshake,
  Send,
  FlaskConical,
  ChevronRight,
} from 'lucide-react'
import { AuthButton } from '@/components/AuthButton'

export default function LandingPage() {
  const [mockupStep, setMockupStep] = useState(0)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setMockupStep(s => (s + 1) % 8)
    }, 1500)
    return () => clearInterval(interval)
  }, [])

  const diagStep1 = mockupStep >= 1
  const diagStep2 = mockupStep >= 2
  const chatStep1 = mockupStep >= 4
  const chatStep2 = mockupStep >= 5
  const chatStep3 = mockupStep >= 6
  const chatStep4 = mockupStep >= 7

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name && email && message) {
      setIsSubmitted(true)
      setTimeout(() => {
        setName('')
        setEmail('')
        setMessage('')
        setIsSubmitted(false)
      }, 3000)
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col font-sans bg-white overflow-x-hidden">

      {/* Header */}
      <header className="flex h-[72px] shrink-0 items-center justify-between border-b border-gray-100 bg-white/80 px-6 md:px-12 backdrop-blur-md sticky top-0 z-50">
        <Link href="/" className="transition-transform hover:scale-105">
          <img src="/dayli-logotype.png" alt="Dayli AI" className="h-8 md:h-9 object-contain" />
        </Link>
        <AuthButton showText />
      </header>

      <main className="flex-1 bg-[#fdfafb]">

        {/* Hero */}
        <section className="px-6 py-12 md:py-24 text-center mx-auto max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#E0F7FA] px-4 py-1.5 md:py-2 mb-8 shadow-sm">
            <Sparkles className="h-4 w-4 text-[#06b6d4]" />
            <span className="text-[12px] md:text-[13px] font-bold uppercase tracking-wider text-[#06b6d4]">Meet Your AI Assistant</span>
          </div>

          <h1 className="mb-6 font-serif text-[40px] md:text-[64px] font-bold leading-[1.1] text-[#121928]">
            Empower Your Daily Life
          </h1>

          <p className="mb-10 text-[16px] md:text-[20px] leading-relaxed text-[#6a7282] max-w-[90%] md:max-w-[70%] mx-auto">
            Find a solution to improve daily life or chat with Dayli AI for personalized support, customized perfectly to your needs.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-md md:max-w-xl mx-auto">
            <Link
              href="/diagnostic"
              className="flex w-full md:w-auto md:flex-1 items-center justify-center gap-2 rounded-full bg-[#4A154B] px-8 py-4 text-[16px] font-bold text-white shadow-[0px_8px_20px_0px_rgba(74,21,75,0.3)] transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Search className="h-5 w-5" />
              Start Diagnostic Tool
            </Link>
            <Link
              href="/assessment"
              className="flex w-full md:w-auto md:flex-1 items-center justify-center gap-2 rounded-full border-2 border-[#06b6d4] bg-white px-8 py-4 text-[16px] font-bold text-[#06b6d4] transition-transform hover:bg-[#E0F7FA] active:scale-[0.98]"
            >
              <MessageSquare className="h-5 w-5" />
              Chat with Dayli AI
            </Link>
          </div>
        </section>

        {/* App Previews */}
        <section className="px-6 py-12 md:py-20 relative overflow-hidden bg-white">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#F3E8F4] opacity-50 pointer-events-none" />

          <div className="relative z-10 flex flex-row gap-6 md:gap-12 md:justify-center overflow-x-auto pb-8 snap-x snap-mandatory px-6 md:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

            {/* Diagnostic Mockup */}
            <div className="snap-center shrink-0 w-[280px] md:w-[320px] h-[360px] md:h-[400px] rounded-[32px] bg-white border-[6px] border-gray-100 shadow-[0px_16px_40px_0px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col transform md:rotate-[-2deg] transition-transform hover:rotate-0">
              <div className="h-12 border-b border-gray-100 flex items-center justify-center bg-gray-50/50">
                <div className="w-1/3 h-1.5 bg-gray-200 rounded-full" />
              </div>
              <div className="p-6 flex-1 bg-white">
                <h3 className="font-serif text-[20px] font-bold text-[#121928] mb-5">What areas do you need support with?</h3>
                <div className="space-y-4">
                  <div className={`h-14 w-full rounded-[16px] border-2 flex items-center px-4 gap-3 transition-all duration-300 ${diagStep1 ? 'border-[#4A154B] bg-[#fdfafb] shadow-sm' : 'border-gray-100 bg-white'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[14px] transition-colors ${diagStep1 ? 'bg-[#4A154B] text-white' : 'border-2 border-gray-200 text-transparent'}`}>✓</div>
                    <div className={`w-1/2 h-2.5 rounded-full transition-colors ${diagStep1 ? 'bg-[#121928]' : 'bg-gray-300'}`} />
                  </div>
                  <div className={`h-14 w-full rounded-[16px] border-2 flex items-center px-4 gap-3 transition-all duration-300 ${diagStep2 ? 'border-[#4A154B] bg-[#fdfafb] shadow-sm' : 'border-gray-100 bg-white'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[14px] transition-colors ${diagStep2 ? 'bg-[#4A154B] text-white' : 'border-2 border-gray-200 text-transparent'}`}>✓</div>
                    <div className={`w-1/3 h-2.5 rounded-full transition-colors ${diagStep2 ? 'bg-[#121928]' : 'bg-gray-300'}`} />
                  </div>
                  <div className="h-14 w-full rounded-[16px] border-2 border-gray-100 bg-white flex items-center px-4 gap-3">
                    <div className="w-6 h-6 rounded-full border-2 border-gray-200" />
                    <div className="w-2/5 h-2.5 bg-gray-300 rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Mockup */}
            <div className="snap-center shrink-0 w-[280px] md:w-[320px] h-[360px] md:h-[400px] rounded-[32px] bg-white border-[6px] border-gray-100 shadow-[0px_16px_40px_0px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col transform md:rotate-[2deg] md:translate-y-6 transition-transform hover:rotate-0">
              <div className="h-12 border-b border-gray-100 flex items-center px-4 bg-gray-50/50 gap-2">
                <div className="w-8 h-8 rounded-full bg-[#E0F7FA] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#06b6d4]" />
                </div>
                <div className="w-1/3 h-2.5 bg-[#121928] rounded-full" />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-end gap-4 bg-[#fdfafb]">
                <div className="self-start w-full bg-white border border-gray-100 shadow-sm rounded-[20px] rounded-bl-sm p-4">
                  <div className="w-full h-2.5 bg-gray-300 rounded-full mb-2" />
                  <div className="w-[90%] h-2.5 bg-gray-300 rounded-full mb-2" />
                  <div className="w-1/2 h-2.5 bg-gray-300 rounded-full" />
                </div>
                {chatStep2 && (
                  <div className="self-end w-full bg-[#4A154B] rounded-[20px] rounded-br-sm p-4 shadow-sm">
                    <div className="w-full h-2.5 bg-white/80 rounded-full mb-2" />
                    <div className="w-2/3 h-2.5 bg-white/80 rounded-full" />
                  </div>
                )}
                {chatStep3 && !chatStep4 && (
                  <div className="self-start w-full bg-white border border-gray-100 shadow-sm rounded-[20px] rounded-bl-sm p-4 flex gap-1.5">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  </div>
                )}
                {chatStep4 && (
                  <div className="self-start w-full bg-white border border-gray-100 shadow-sm rounded-[20px] rounded-bl-sm p-4">
                    <div className="w-full h-2.5 bg-gray-300 rounded-full mb-2" />
                    <div className="w-[85%] h-2.5 bg-gray-300 rounded-full" />
                  </div>
                )}
                <div className="h-12 mt-2 w-full rounded-full border-2 border-gray-200 bg-gray-50 flex items-center px-4 gap-3">
                  <div className="flex-1 flex items-center">
                    <div className={`h-2 bg-gray-200 rounded-full transition-all duration-300 ${chatStep1 && !chatStep2 ? 'w-1/2' : 'w-0'}`} />
                    {chatStep1 && !chatStep2 && <div className="ml-1 w-0.5 h-3.5 bg-[#4A154B] animate-pulse" />}
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${chatStep1 && !chatStep2 ? 'bg-[#4A154B]' : 'bg-gray-300'}`}>
                    <div className="w-3 h-3 bg-white" style={{ clipPath: 'polygon(0 0, 0 100%, 100% 50%)' }} />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Trust Signals */}
        <section className="px-6 py-12 md:py-20 bg-white border-t border-gray-50">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[20px] bg-[#F3E8F4] text-[#4A154B]">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <div>
                <h3 className="font-bold text-[#121928] text-[18px] mb-1">Trusted by Caregivers</h3>
                <p className="text-[15px] text-[#6a7282]">Verified strategies tested for actual daily use.</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[20px] bg-[#E0F7FA] text-[#06b6d4]">
                <HeartHandshake className="h-8 w-8" />
              </div>
              <div>
                <h3 className="font-bold text-[#121928] text-[18px] mb-1">Thousands of Solutions</h3>
                <p className="text-[15px] text-[#6a7282]">A massive database of adaptive tools to discover.</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[20px] bg-[#fce7f3] text-[#db2777]">
                <FlaskConical className="h-8 w-8" />
              </div>
              <div>
                <h3 className="font-bold text-[#121928] text-[18px] mb-1">Community Tested</h3>
                <p className="text-[15px] text-[#6a7282]">Rigorous evaluation of every single tool.</p>
              </div>
            </div>
          </div>
        </section>

        {/* What is Dayli AI */}
        <section className="px-6 py-16 md:py-24 text-center bg-[#4A154B] text-white">
          <div className="max-w-3xl mx-auto">
            <img src="/butterfly.png" alt="Dayli AI" className="h-40 w-40 md:h-48 md:w-48 object-contain mx-auto mb-8" />
            <h2 className="mb-6 font-serif text-[32px] md:text-[40px] font-bold">What is Dayli AI?</h2>
            <p className="text-[16px] md:text-[20px] leading-relaxed text-gray-300 mx-auto">
              Dayli AI is a personalized intelligence tool specifically designed to help people living with disabilities, their families, and caregivers navigate the massive world of adaptive equipment and daily living strategies.
            </p>
          </div>
        </section>

        {/* Daily Living Labs */}
        <section className="px-6 py-16 md:py-24 bg-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#F3E8F4] rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="max-w-4xl mx-auto relative z-10 text-center">
            <h2 className="mb-6 font-serif text-[32px] md:text-[48px] font-bold text-[#121928] leading-tight">
              Real-Life Solutions Powered By
              <span className="block text-[#4A154B] mt-2">Daily Living Labs</span>
            </h2>
            <p className="mb-8 text-[16px] md:text-[20px] leading-relaxed text-[#6a7282] max-w-2xl mx-auto">
              Our AI engine is fueled by human-tested, rigorously verified solutions documented by Daily Living Labs.
            </p>
            <Link
              href="/daily-living-labs"
              className="inline-flex items-center gap-2 rounded-full border-2 border-[#4A154B] bg-white px-8 py-4 text-[16px] font-bold text-[#4A154B] transition-colors hover:bg-[#F3E8F4]"
            >
              Learn more about the Lab
              <ChevronRight className="h-5 w-5" />
            </Link>
          </div>
        </section>

        {/* Contact Form */}
        <section className="px-6 py-16 md:py-24 bg-gray-50 border-t border-gray-100">
          <div className="max-w-2xl mx-auto">
            <div className="rounded-[32px] md:rounded-[40px] bg-white p-8 md:p-12 shadow-[0px_8px_24px_0px_rgba(0,0,0,0.04)] border border-gray-100">
              <h2 className="mb-3 font-serif text-[28px] md:text-[32px] font-bold text-[#121928] text-center">Get in Touch</h2>
              <p className="mb-8 text-[15px] md:text-[16px] text-[#6a7282] text-center">Have a question or want to partner with us? Drop a line.</p>

              {isSubmitted ? (
                <div className="rounded-[24px] bg-[#F3E8F4] p-8 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#4A154B] text-white">
                    <Send className="h-8 w-8" />
                  </div>
                  <h3 className="font-bold text-[#4A154B] text-[20px] mb-2">Message Sent!</h3>
                  <p className="text-[16px] text-[#310D32]">We'll be in touch shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                      className="h-14 w-full rounded-[16px] border-2 border-gray-200 bg-gray-50 px-5 text-[16px] text-[#121928] focus:border-[#4A154B] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#F3E8F4] transition-all"
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      className="h-14 w-full rounded-[16px] border-2 border-gray-200 bg-gray-50 px-5 text-[16px] text-[#121928] focus:border-[#4A154B] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#F3E8F4] transition-all"
                    />
                  </div>
                  <textarea
                    placeholder="How can we help?"
                    rows={4}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    required
                    className="w-full rounded-[16px] border-2 border-gray-200 bg-gray-50 p-5 text-[16px] text-[#121928] focus:border-[#4A154B] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#F3E8F4] resize-none transition-all"
                  />
                  <button
                    type="submit"
                    className="flex h-14 w-full items-center justify-center gap-2 rounded-[16px] bg-[#121928] text-[16px] font-bold text-white transition-colors hover:bg-black"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 px-6 py-12 md:py-16 text-center">
        <img src="/dayli-logotype.png" alt="Dayli AI" className="h-6 object-contain mx-auto mb-6 opacity-40 grayscale" />
        <p className="text-[14px] text-gray-400 mb-4">
          © {new Date().getFullYear()} Dayli AI. All rights reserved.
        </p>
        <div className="flex justify-center gap-6 text-[14px] text-gray-500 font-medium">
          <span className="cursor-pointer hover:text-[#4A154B] transition-colors">Terms & Conditions</span>
          <span>•</span>
          <span className="cursor-pointer hover:text-[#4A154B] transition-colors">Privacy Policy</span>
          <span>•</span>
          <span className="cursor-pointer hover:text-[#4A154B] transition-colors">Legal</span>
          <span>•</span>
          <span className="cursor-pointer hover:text-[#4A154B] transition-colors">Accessibility</span>
        </div>
      </footer>
    </div>
  )
}
