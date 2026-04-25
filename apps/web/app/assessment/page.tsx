'use client'

/**
 * /assessment — Socratic Needs Assessment Chat Interface
 * Design: matches Figma Make ChatScreen
 * Wired to: /api/assessment (Claude claude-opus-4-6)
 */

import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowUp, ArrowLeft, Sparkles, Mic, X, MessageSquare, Clock, Bookmark, Globe, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'
import { useUser } from '@/lib/hooks/useUser'
import { AuthButton } from '@/components/AuthButton'

type ChatSolution = {
  id: string
  title: string
  description: string
  adl_category: string
  disability_tags: string[]
  source_url?: string
  cover_image_url?: string
  sourceName?: string
  sourceType?: string
}

type Message = { role: 'user' | 'assistant'; content: string; solutions?: ChatSolution[] }

const DEFAULT_SUGGESTIONS = [
  'Accessible transport',
  'Daily living aids',
  'Local support groups',
]

type RecentSession = {
  session_id: string
  adl_focus: string | null
  extracted_categories: string[]
  completed: boolean
  updated_at: string
  summary: string | null
}

const ADL_LABELS: Record<string, string> = {
  bathing: 'Bathing', dressing: 'Dressing', eating: 'Eating',
  mobility: 'Mobility', toileting: 'Toileting', transferring: 'Transferring',
}

type SidebarCollection = { id: string; name: string; color: string; count: number }

export default function AssessmentPage() {
  return (
    <Suspense>
      <AssessmentContent />
    </Suspense>
  )
}

function AssessmentContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useUser()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false)
  const [showRecent, setShowRecent] = useState(false)
  const [recentSessions, setRecentSessions] = useState<RecentSession[]>([])
  const [loadingRecent, setLoadingRecent] = useState(false)
  const [sidebarCollections, setSidebarCollections] = useState<SidebarCollection[]>([])
  const [suggestions, setSuggestions] = useState<string[]>(DEFAULT_SUGGESTIONS)
  const [showAllRecent, setShowAllRecent] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isListening, setIsListening] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null)

  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || ''

  // Check for Web Speech API support
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    setSpeechSupported(!!SpeechRecognition)
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'en-US'
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInput(prev => (prev ? prev + ' ' : '') + transcript)
        setIsListening(false)
        inputRef.current?.focus()
      }
      recognition.onerror = () => setIsListening(false)
      recognition.onend = () => setIsListening(false)
      recognitionRef.current = recognition
    }
  }, [])

  function toggleVoiceInput() {
    if (!recognitionRef.current) return
    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  async function fetchRecentSessions() {
    setLoadingRecent(true)
    try {
      const res = await fetch('/api/assessment/sessions')
      const data = await res.json()
      // Exclude the currently active session
      const sessions = (data.sessions ?? []).filter(
        (s: RecentSession) => s.session_id !== sessionId
      )
      setRecentSessions(sessions)
    } catch {
      // Silent fail
    } finally {
      setLoadingRecent(false)
    }
  }

  function handleRecentClick() {
    setShowRecent(!showRecent)
    if (!showRecent) fetchRecentSessions()
  }

  function navigateToSession(session: RecentSession) {
    // Load session directly instead of relying on URL change + effect
    setSessionId(session.session_id)
    setLoading(true)
    setShowRecent(false)

    fetch(`/api/assessment/sessions?id=${session.session_id}`)
      .then(r => r.json())
      .then(async (data) => {
        if (data.session?.messages?.length) {
          const pastMessages: Message[] = data.session.messages
          setMessages(pastMessages)

          if (data.session.completed && data.session.extracted_categories?.length) {
            try {
              // Build queryText from user messages for semantic search
              const userQueryText = (pastMessages as Array<{ role: string; content: string }>)
                .filter(m => m.role === 'user')
                .map(m => m.content)
                .join(' ')

              const matchRes = await fetch('/api/match', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({
                  queryText: userQueryText,
                  categories: data.session.extracted_categories ?? [],
                  keywords: data.session.extracted_keywords ?? [],
                  sessionId: session.session_id,
                  limit: 3,
                }),
              })
              const matchData = await matchRes.json()
              if (matchData.solutions?.length > 0) {
                setMessages(prev => [...prev, {
                  role: 'assistant' as const,
                  content: 'Here are some solutions tailored to your needs:',
                  solutions: matchData.solutions.slice(0, 3),
                }])
                setSuggestions(['Show me solutions', 'I have other challenges too', "That's correct"])
              }
            } catch {}
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  // Fetch sidebar collections
  useEffect(() => {
    if (!user) return
    fetch('/api/collections')
      .then(r => r.json())
      .then(d => {
        if (d.collections) {
          setSidebarCollections(d.collections.map((c: { id: string; name: string; color: string; solutionIds: string[] }) => ({
            id: c.id, name: c.name, color: c.color, count: c.solutionIds.length,
          })))
        }
      })
      .catch(() => {})
  }, [user])

  // Fetch dynamic suggestions based on past sessions
  useEffect(() => {
    fetch('/api/assessment/sessions')
      .then(r => r.json())
      .then(d => {
        const sessions = d.sessions ?? []
        if (sessions.length > 0) {
          const pastCategories = sessions.flatMap((s: RecentSession) => s.extracted_categories ?? [])
          const unique = [...new Set(pastCategories)] as string[]
          if (unique.length > 0) {
            const dynamicSuggestions = unique.slice(0, 3).map((cat: string) => {
              const label = ADL_LABELS[cat] ?? cat
              return `Help with ${label.toLowerCase()}`
            })
            setSuggestions(dynamicSuggestions.length >= 2 ? dynamicSuggestions : DEFAULT_SUGGESTIONS)
          }
        }
      })
      .catch(() => {})
  }, [])

  // Set the personalized welcome message on mount (no API call)
  const welcomeSetRef = useRef(false)
  useEffect(() => {
    const name = displayName ? ` ${displayName}` : ''
    const welcomeContent = `Hi${name}! I'm Dayli AI. How can I assist you today?`
    if (!welcomeSetRef.current) {
      // First mount — set the welcome message
      welcomeSetRef.current = true
      setMessages([{ role: 'assistant', content: welcomeContent }])
    } else {
      // displayName loaded later — update the welcome message only if it's still the only message
      setMessages(prev => {
        if (prev.length === 1 && prev[0].role === 'assistant') {
          return [{ role: 'assistant', content: welcomeContent }]
        }
        return prev
      })
    }
  }, [displayName])

  // Auto-send query from dashboard suggestion pill
  const autoSentRef = useRef(false)
  useEffect(() => {
    const q = searchParams.get('q')
    if (q && !autoSentRef.current && messages.length === 1 && messages[0].role === 'assistant') {
      autoSentRef.current = true
      sendMessage(q)
    }
  }, [messages, searchParams])

  // Load a past session's conversation when sessionId is in the URL
  const sessionLoadedRef = useRef(false)
  useEffect(() => {
    const sid = searchParams.get('sessionId')
    if (!sid || sessionLoadedRef.current) return
    sessionLoadedRef.current = true
    setSessionId(sid)
    setLoading(true)

    fetch(`/api/assessment/sessions?id=${sid}`)
      .then(r => r.json())
      .then(async (data) => {
        if (data.session?.messages?.length) {
          const pastMessages: Message[] = data.session.messages
          setMessages(pastMessages)

          // If session was completed, also fetch and display solutions inline
          if (data.session.completed && data.session.extracted_categories?.length) {
            try {
              const pastUserText = (pastMessages as Array<{ role: string; content: string }>)
                .filter(m => m.role === 'user')
                .map(m => m.content)
                .join(' ')

              const matchRes = await fetch('/api/match', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({
                  queryText: pastUserText,
                  categories: data.session.extracted_categories ?? [],
                  keywords: data.session.extracted_keywords ?? [],
                  sessionId: sid,
                  limit: 3,
                }),
              })
              const matchData = await matchRes.json()
              if (matchData.solutions?.length > 0) {
                setMessages(prev => [...prev, {
                  role: 'assistant' as const,
                  content: 'Here are some solutions tailored to your needs:',
                  solutions: matchData.solutions.slice(0, 3),
                }])
              }
            } catch {
              // Solutions fetch failed — conversation still shows
            }
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [searchParams])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loading])

  async function sendMessage(text?: string) {
    const trimmed = (text ?? input).trim()
    if (!trimmed || loading) return

    const userMessage: Message = { role: 'user', content: trimmed }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)
    setError(null)

    try {
      // Strip solutions from messages before sending to API (Claude rejects unknown fields)
      const cleanMessages = updatedMessages.map(({ role, content }) => ({ role, content }))
      const res = await fetch('/api/assessment', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: cleanMessages, sessionId }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)

      setSessionId(data.sessionId)
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])

      // Update suggestion pills from AI response
      if (data.suggestions?.length > 0) {
        setSuggestions(data.suggestions)
      }

      if (data.done) {
        // Fetch top 3 solutions and display inline
        try {
          // Build queryText from all user messages in this conversation
          const chatQueryText = messages
            .filter(m => m.role === 'user')
            .map(m => m.content)
            .join(' ')

          const matchRes = await fetch('/api/match', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
              queryText: chatQueryText,
              categories: data.categories ?? [],
              keywords: data.keywords ?? [],
              sessionId: data.sessionId,
              limit: 3,
            }),
          })
          const matchData = await matchRes.json()
          if (matchData.solutions?.length > 0) {
            setMessages(prev => [...prev, {
              role: 'assistant',
              content: 'Here are some solutions tailored to your needs:',
              solutions: matchData.solutions.slice(0, 3),
            }])
            // Update suggestion pills to post-solution follow-ups
            setSuggestions(['Show me solutions', 'I have other challenges too', "That's correct"])
          }
        } catch {
          // Fallback: redirect to solutions page
          const params = new URLSearchParams({
            categories: (data.categories ?? []).join(','),
            keywords: (data.keywords ?? []).join(','),
            adlFocus: data.adlFocus ?? '',
            sessionId: data.sessionId ?? '',
          })
          router.push(`/solutions?${params.toString()}`)
        }
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  return (
    <div className="flex h-screen w-full bg-white font-sans overflow-hidden">

      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-80 flex-col border-r border-gray-100 bg-[#fdfafb] shrink-0">
        <div className="flex h-[72px] items-center px-6 border-b border-gray-100">
          <a href="/" className="transition-transform hover:scale-105">
            <img src="/dayli-logotype.png" alt="Dayli AI" className="h-7 object-contain" />
          </a>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {user && (
            <button
              onClick={() => router.push('/dashboard')}
              className="flex w-full items-center gap-3 rounded-[20px] p-4 text-left hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-[#121928]" />
              <span className="font-semibold text-[16px] text-[#121928]">Back to Dashboard</span>
            </button>
          )}

          <button className="flex w-full items-center gap-3 rounded-[20px] bg-[#F3E8F4] p-4 text-left">
            <MessageSquare className="h-6 w-6 text-[#4A154B]" />
            <span className="font-semibold text-[16px] text-[#4A154B]">Chats</span>
          </button>
          <button
            onClick={handleRecentClick}
            className={`flex w-full items-center gap-3 rounded-[20px] p-4 text-left border transition-colors ${showRecent ? 'bg-[#F3E8F4] border-[#F3E8F4]' : 'bg-white border-gray-100 hover:bg-gray-50'}`}
          >
            <Clock className={`h-6 w-6 ${showRecent ? 'text-[#4A154B]' : 'text-[#6a7282]'}`} />
            <div>
              <span className={`block font-semibold text-[16px] ${showRecent ? 'text-[#4A154B]' : 'text-[#121928]'}`}>Recent</span>
              <span className="block text-[13px] text-[#6a7282]">View past sessions</span>
            </div>
          </button>

          {showRecent && (
            <div className="mt-2 space-y-1">
              {loadingRecent && (
                <div className="px-4 py-3 text-[13px] text-[#6a7282]">Loading...</div>
              )}
              {!loadingRecent && recentSessions.length === 0 && (
                <div className="px-4 py-3 text-[13px] text-[#6a7282]">No past sessions yet</div>
              )}
              {(showAllRecent ? recentSessions : recentSessions.slice(0, 5)).map(session => (
                <button
                  key={session.session_id}
                  onClick={() => navigateToSession(session)}
                  className="flex w-full flex-col gap-1 rounded-xl px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-[14px] font-medium text-[#121928]">
                    {session.summary || (session.adl_focus ? ADL_LABELS[session.adl_focus] ?? session.adl_focus : 'Assessment')}
                  </span>
                  <span className="text-[12px] text-[#6a7282]">
                    {new Date(session.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                  </span>
                </button>
              ))}
              {recentSessions.length > 5 && (
                <button
                  onClick={() => setShowAllRecent(!showAllRecent)}
                  className="flex w-full items-center justify-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-[#4A154B] hover:bg-[#F3E8F4] rounded-xl transition-colors"
                >
                  {showAllRecent ? (
                    <>Show less <ChevronUp className="h-3.5 w-3.5" /></>
                  ) : (
                    <>View all ({recentSessions.length}) <ChevronDown className="h-3.5 w-3.5" /></>
                  )}
                </button>
              )}
            </div>
          )}

          {/* YOUR COLLECTIONS */}
          {sidebarCollections.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <span className="px-4 text-[11px] font-bold uppercase tracking-wider text-[#6a7282]">Your Collections</span>
              <div className="mt-2 space-y-1">
                {sidebarCollections.slice(0, 4).map(col => (
                  <button
                    key={col.id}
                    onClick={() => router.push(`/collections?view=collection&id=${col.id}`)}
                    className="flex w-full items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <Bookmark className="h-5 w-5" style={{ color: col.color }} fill={col.color} />
                    <span className="flex-1 text-[14px] font-medium text-[#121928] text-left">{col.name}</span>
                    <span className="text-[12px] text-[#6a7282] bg-gray-100 px-2 py-0.5 rounded-full">{col.count}</span>
                  </button>
                ))}
                {sidebarCollections.length > 4 && (
                  <button
                    onClick={() => router.push('/collections?view=collections')}
                    className="flex w-full items-center justify-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-[#4A154B] hover:bg-[#F3E8F4] rounded-xl transition-colors"
                  >
                    View all ({sidebarCollections.length}) <ExternalLink className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}
        </nav>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <header className="flex h-[60px] md:h-[72px] shrink-0 items-center justify-between border-b border-gray-100 bg-white px-4 md:px-8 shadow-sm z-10">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Open side menu"
              aria-expanded={isSideMenuOpen}
              onClick={() => setIsSideMenuOpen(true)}
              className="md:hidden flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" focusable="false"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <img src="/dayli-logotype.png" alt="Dayli AI" className="md:hidden h-7 object-contain" />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Exit chat"
              onClick={() => router.push('/')}
              className="flex items-center gap-2 h-10 px-4 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 hover:text-red-700 transition-colors text-[14px] font-medium"
            >
              <span className="hidden md:block">Exit Chat</span>
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
            <AuthButton />
          </div>
        </header>

        {/* Messages */}
        <main id="main-content" tabIndex={-1} className="flex-1 overflow-y-auto p-4 md:p-8 focus:outline-none">
          <div className="mx-auto w-full max-w-3xl flex flex-col flex-1">

            {/* Centered welcome state — only the initial greeting, no user messages yet */}
            {messages.length === 1 && messages[0].role === 'assistant' && !loading && (
              <div className="flex flex-1 flex-col items-center justify-center text-center px-4 min-h-[60vh]">
                <div className="mb-6 flex h-[88px] w-[88px] items-center justify-center rounded-full bg-[#E0F7FA] shadow-lg" aria-hidden="true">
                  <Sparkles className="h-11 w-11 text-[#06b6d4]" />
                </div>
                <div className="rounded-[32px] bg-white p-8 shadow border border-gray-100 max-w-md">
                  <h2 className="text-[26px] font-serif text-[#121928] leading-snug text-center" style={{ fontWeight: 950 }}>
                    {messages[0].content}
                  </h2>
                </div>
              </div>
            )}

            {/* Chat bubbles — shown once conversation has started */}
            <div className={`space-y-6 pb-4 ${messages.length === 1 && messages[0].role === 'assistant' && !loading ? 'hidden' : ''}`}>
              {messages.map((msg, i) => (
                <div key={i}>
                  <div className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex max-w-[85%] items-end gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>

                      {msg.role === 'assistant' ? (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow border border-gray-100" aria-hidden="true">
                          <Sparkles className="h-5 w-5 text-[#06b6d4]" />
                        </div>
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 border border-gray-100" aria-hidden="true">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2" focusable="false"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        </div>
                      )}

                      <div className={`text-[16px] leading-relaxed shadow-sm ${
                        msg.role === 'user'
                          ? 'px-5 py-4 bg-[#4A154B] text-white rounded-[24px] rounded-br-sm shadow-[0px_4px_12px_0px_rgba(74,21,75,0.2)]'
                          : 'px-5 py-4 bg-white text-[#121928] rounded-[24px] rounded-bl-sm border border-gray-100 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.03)]'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  </div>

                  {/* Inline Solution Cards */}
                  {msg.solutions && msg.solutions.length > 0 && (
                    <ul className="mt-3 ml-[52px] space-y-4 max-w-[85%]" role="list" aria-label="Suggested solutions">
                      {msg.solutions.map((sol) => (
                        <li key={sol.id} className="rounded-[20px] border border-gray-100 bg-white shadow-sm overflow-hidden">
                          {sol.cover_image_url && (
                            <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                              <img src={sol.cover_image_url} alt="" aria-hidden="true" className="h-full w-full object-cover" />
                              <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[12px] font-bold text-[#121928] backdrop-blur-sm">
                                <Globe className="h-3.5 w-3.5 text-blue-500" aria-hidden="true" />
                                <span>{sol.sourceType || 'Web'}</span>
                              </div>
                            </div>
                          )}
                          <div className="p-5">
                            {sol.disability_tags?.length > 0 && (
                              <div className="mb-3 flex flex-wrap gap-1.5">
                                {sol.disability_tags.slice(0, 3).map(tag => (
                                  <span key={tag} className="rounded-md bg-gray-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-gray-700">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                            <h4 className="text-[18px] font-bold text-[#121928] mb-1">{sol.title}</h4>
                            {sol.sourceName && (
                              <p className="text-[13px] text-[#6a7282] mb-2">Source: <span className="font-medium text-[#121928]">{sol.sourceName}</span></p>
                            )}
                            <p className="text-[14px] text-[#6a7282] leading-relaxed line-clamp-3 mb-4">{sol.description}</p>
                            {sol.source_url && (
                              <a
                                href={sol.source_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-[#121928] text-white text-[14px] font-bold hover:bg-[#1e293b] transition-colors"
                              >
                                Go to Solution
                                <span className="sr-only"> (opens in a new tab)</span>
                                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                              </a>
                            )}

                            {/* Was This Helpful */}
                            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                              <span id={`helpful-${sol.id}`} className="text-[13px] font-bold text-[#121928]">Was This Helpful?</span>
                              <div className="flex items-center gap-1" role="group" aria-labelledby={`helpful-${sol.id}`}>
                                <button type="button" aria-label="Helpful" className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 text-gray-700 hover:bg-green-100 hover:text-green-800 transition-colors">
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" focusable="false"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
                                </button>
                                <button type="button" aria-label="Not helpful" className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 text-gray-700 hover:bg-red-100 hover:text-red-800 transition-colors">
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" focusable="false"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z"/><path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/></svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex justify-start" role="status" aria-live="polite" aria-label="Dayli AI is typing">
                  <div className="flex items-end gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow border border-gray-100" aria-hidden="true">
                      <Sparkles className="h-5 w-5 text-[#06b6d4]" />
                    </div>
                    <div className="bg-white border border-gray-100 rounded-[24px] rounded-bl-sm px-5 py-4 shadow flex gap-1.5 items-center" aria-hidden="true">
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div role="alert" className="mt-4 p-3 bg-red-50 border border-[#B91C1C] rounded-xl text-sm text-[#B91C1C]">
                <strong>Error:</strong> {error}{' '}
                <button type="button" onClick={() => { setError(null); sendMessage(input || 'Hello') }} className="underline ml-1 font-bold">Retry</button>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </main>

        {/* Input Footer */}
        <footer className="shrink-0 border-t border-gray-100 bg-white/90 backdrop-blur-md px-4 md:px-8 pb-6 pt-4 shadow-[0px_-10px_20px_0px_rgba(0,0,0,0.02)] z-10">
          <div className="mx-auto w-full max-w-3xl">

            {/* Suggestion chips */}
            <div className="mb-4 flex gap-3 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" role="group" aria-label="Suggested questions">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => sendMessage(s)}
                  disabled={loading}
                  className="shrink-0 whitespace-nowrap rounded-full border-2 border-[#06b6d4] bg-white px-5 py-2 text-[14px] font-bold text-[#06b6d4] hover:bg-[#E0F7FA] transition-colors disabled:opacity-40"
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Input box */}
            <form
              onSubmit={(e) => { e.preventDefault(); sendMessage() }}
              className="relative flex items-center rounded-full border-2 border-gray-200 bg-gray-50 p-2 pl-5 pr-2 focus-within:border-[#4A154B] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#F3E8F4] transition-all shadow-sm"
              aria-label="Send message to Dayli AI"
            >
              <span className="mr-3 text-[#06b6d4] shrink-0" aria-hidden="true">
                <Sparkles className="h-5 w-5" />
              </span>

              <label htmlFor="chat-input" className="sr-only">Message Dayli AI</label>
              <input
                id="chat-input"
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') sendMessage() }}
                placeholder={displayName ? `Hi ${displayName}! How can I help?` : 'Hi! How can I help?'}
                disabled={loading}
                className="flex-1 bg-transparent h-12 text-[16px] text-[#121928] outline-none placeholder:text-gray-600 min-w-0 disabled:opacity-50"
              />

              {input.trim() ? (
                <button
                  type="submit"
                  aria-label="Send message"
                  disabled={loading}
                  className="ml-2 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#4A154B] text-white shadow-[0px_4px_12px_0px_rgba(74,21,75,0.3)] hover:bg-[#310D32] hover:scale-105 transition-all disabled:opacity-40"
                >
                  <ArrowUp className="h-5 w-5" aria-hidden="true" />
                </button>
              ) : speechSupported ? (
                <button
                  type="button"
                  aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
                  aria-pressed={isListening}
                  onClick={toggleVoiceInput}
                  className={`ml-2 flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-all ${
                    isListening
                      ? 'bg-red-500 text-white animate-pulse shadow-[0px_4px_12px_0px_rgba(239,68,68,0.4)]'
                      : 'text-gray-700 hover:text-[#4A154B]'
                  }`}
                >
                  <Mic className="h-5 w-5" aria-hidden="true" />
                </button>
              ) : null}
            </form>
          </div>
        </footer>
      </div>

      {/* Mobile overlay sidebar */}
      {isSideMenuOpen && (
        <div className="absolute inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsSideMenuOpen(false)} />
          <div className="relative flex h-full w-[300px] flex-col bg-white shadow-2xl">
            <div className="flex h-[60px] items-center justify-between px-4 border-b border-gray-100">
              <span className="font-serif text-[20px] font-semibold text-[#121928]">Dayli AI</span>
              <button onClick={() => setIsSideMenuOpen(false)} className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-gray-100">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <nav className="p-4 space-y-2">
              <button className="flex w-full items-center gap-3 rounded-[20px] bg-[#F3E8F4] p-4 text-left">
                <MessageSquare className="h-5 w-5 text-[#4A154B]" />
                <span className="font-semibold text-[15px] text-[#4A154B]">Chats</span>
              </button>
              <button
                onClick={handleRecentClick}
                className={`flex w-full items-center gap-3 rounded-[20px] p-4 text-left border transition-colors ${showRecent ? 'bg-[#F3E8F4] border-[#F3E8F4]' : 'bg-white border-gray-100 hover:bg-gray-50'}`}
              >
                <Clock className={`h-5 w-5 ${showRecent ? 'text-[#4A154B]' : 'text-[#6a7282]'}`} />
                <span className={`font-semibold text-[15px] ${showRecent ? 'text-[#4A154B]' : 'text-[#121928]'}`}>Recent</span>
              </button>
              {showRecent && recentSessions.length > 0 && (
                <div className="space-y-1">
                  {(showAllRecent ? recentSessions : recentSessions.slice(0, 5)).map(session => (
                    <button
                      key={session.session_id}
                      onClick={() => { navigateToSession(session); setIsSideMenuOpen(false) }}
                      className="flex w-full flex-col gap-1 rounded-xl px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-[14px] font-medium text-[#121928]">
                        {session.summary || (session.adl_focus ? ADL_LABELS[session.adl_focus] ?? session.adl_focus : 'Assessment')}
                      </span>
                      <span className="text-[12px] text-[#6a7282]">
                        {new Date(session.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                      </span>
                    </button>
                  ))}
                  {recentSessions.length > 5 && (
                    <button
                      onClick={() => setShowAllRecent(!showAllRecent)}
                      className="flex w-full items-center justify-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-[#4A154B] hover:bg-[#F3E8F4] rounded-xl transition-colors"
                    >
                      {showAllRecent ? (
                        <>Show less <ChevronUp className="h-3.5 w-3.5" /></>
                      ) : (
                        <>View all ({recentSessions.length}) <ChevronDown className="h-3.5 w-3.5" /></>
                      )}
                    </button>
                  )}
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </div>
  )
}
