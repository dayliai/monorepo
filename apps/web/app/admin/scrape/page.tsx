'use client'

import React, { useState } from 'react'

type SkippedItem = { title: string; reason: string }

type ScrapeReport = {
  url: string
  source_type: string
  total_found: number
  total_scraped: number
  total_skipped: number
  skipped: SkippedItem[]
}

type ScrapeResult = {
  solutions: Array<{
    title: string
    description: string
    adl_category: string
    disability_tags: string[]
    price_tier: string
    is_diy: boolean
    what_made_it_work: string
  }>
  report: ScrapeReport
  error?: string
}

export default function AdminScrapePage() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<ScrapeResult[]>([])
  const [error, setError] = useState<string | null>(null)

  async function handleScrape() {
    if (!url.trim()) return

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Scraping failed')
        return
      }

      setResults((prev) => [data, ...prev])
      setUrl('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main id="main-content" tabIndex={-1} style={{ maxWidth: 800, margin: '0 auto', padding: '2rem', fontFamily: 'system-ui, sans-serif', outline: 'none' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
        Dayli AI — Scrape Solutions
      </h1>
      <p style={{ color: '#444', marginBottom: '1.5rem' }}>
        Paste a URL to scrape assistive technology solutions into the database.
      </p>

      {/* Input */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleScrape() }}
        style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}
      >
        <label htmlFor="scrape-url" style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0 }}>
          URL to scrape
        </label>
        <input
          id="scrape-url"
          type="url"
          placeholder="https://example.com/assistive-tech"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={loading}
          required
          style={{
            flex: 1,
            padding: '0.75rem 1rem',
            fontSize: '1rem',
            border: '1px solid #757575',
            borderRadius: 8,
            outline: 'none',
            color: '#121928',
          }}
        />
        <button
          type="submit"
          disabled={loading || !url.trim()}
          aria-busy={loading}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            fontWeight: 600,
            backgroundColor: loading ? '#666' : '#4A154B',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            cursor: loading ? 'wait' : 'pointer',
          }}
        >
          {loading ? 'Scraping...' : 'Scrape'}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div role="alert" style={{
          padding: '1rem',
          backgroundColor: '#fee',
          border: '1px solid #B91C1C',
          borderRadius: 8,
          color: '#B91C1C',
          marginBottom: '1.5rem',
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Loading indicator */}
      {loading && (
        <div role="status" aria-live="polite" style={{
          padding: '1.5rem',
          textAlign: 'center',
          color: '#444',
          backgroundColor: '#f9f9f9',
          borderRadius: 8,
          marginBottom: '1.5rem',
        }}>
          Scraping and extracting solutions... This may take 30–60 seconds.
        </div>
      )}

      {/* Results */}
      {results.map((result, i) => (
        <div
          key={i}
          style={{
            border: '1px solid #ddd',
            borderRadius: 8,
            padding: '1.5rem',
            marginBottom: '1.5rem',
            backgroundColor: '#fff',
          }}
        >
          {/* Report header */}
          <div style={{ marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, wordBreak: 'break-all' }}>
              {result.report.url}
            </h2>
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem', color: '#555' }}>
              <span>Source: <strong>{result.report.source_type}</strong></span>
              <span>Found: <strong>{result.report.total_found}</strong></span>
              <span style={{ color: '#080' }}>Scraped: <strong>{result.report.total_scraped}</strong></span>
              <span style={{ color: '#c00' }}>Skipped: <strong>{result.report.total_skipped}</strong></span>
            </div>
          </div>

          {/* Scraped solutions */}
          {result.solutions.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#080', marginBottom: '0.5rem' }}>
                Scraped Solutions
              </h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
                    <th style={{ padding: '0.4rem' }}>Title</th>
                    <th style={{ padding: '0.4rem' }}>Category</th>
                    <th style={{ padding: '0.4rem' }}>Price</th>
                    <th style={{ padding: '0.4rem' }}>DIY</th>
                  </tr>
                </thead>
                <tbody>
                  {result.solutions.map((sol, j) => (
                    <tr key={j} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '0.4rem' }}>{sol.title}</td>
                      <td style={{ padding: '0.4rem' }}>{sol.adl_category}</td>
                      <td style={{ padding: '0.4rem' }}>{sol.price_tier}</td>
                      <td style={{ padding: '0.4rem' }}>{sol.is_diy ? 'Yes' : 'No'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Skipped solutions */}
          {result.report.skipped.length > 0 && (
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#c00', marginBottom: '0.5rem' }}>
                Skipped
              </h3>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.85rem', color: '#666' }}>
                {result.report.skipped.map((item, k) => (
                  <li key={k} style={{ marginBottom: '0.25rem' }}>
                    <strong>{item.title}</strong> — {item.reason}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* No solutions found */}
          {result.solutions.length === 0 && result.report.skipped.length === 0 && (
            <p style={{ color: '#666' }}>No assistive technology solutions found on this page.</p>
          )}
        </div>
      ))}
    </main>
  )
}
