import { useState } from 'react'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://xmqehnuguvlihvqrojme.supabase.co'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setMessage('')

    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      setStatus('success')
      setMessage(data.message || 'You\'re subscribed!')
      setEmail('')
    } catch (err) {
      setStatus('error')
      setMessage((err as Error).message)
    }
  }

  return (
    <section className="bg-dayli-deep py-16 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-3">
          Stay in the loop
        </h2>
        <p className="font-body text-white/60 mb-8">
          Get updates on new solutions, community stories, and features from Daily Living Labs.
        </p>

        {status === 'success' ? (
          <p className="font-body text-dayli-cyan text-lg font-medium">{message}</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center">
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="font-body flex-1 max-w-sm px-5 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-dayli-light focus:bg-white/15 transition-colors"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="font-body bg-dayli-vibrant text-white px-7 py-3 rounded-full font-semibold hover:bg-dayli-vibrant/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-dayli-vibrant/25"
            >
              {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
            </button>
          </form>
        )}

        {status === 'error' && (
          <p className="font-body text-dayli-error mt-3 text-sm">{message}</p>
        )}
      </div>
    </section>
  )
}
