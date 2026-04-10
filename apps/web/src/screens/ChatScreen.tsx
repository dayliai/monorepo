import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send,
  Menu,
  X,
  ExternalLink,
  Heart,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react'
import Header from '../components/Header'
import { useUser } from '../context/UserContext'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ResourceCard {
  id: string
  title: string
  url: string
  source: string
}

interface ChatMessage {
  id: string
  role: 'user' | 'ai'
  text: string
  resources?: ResourceCard[]
  timestamp: number
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const uid = () => Math.random().toString(36).slice(2, 10)

const SUGGESTED_TOPICS = [
  'Mobility aids',
  'Bathroom safety',
  'Dressing tips',
  'Kitchen adaptations',
  'Caregiver support',
]

/* ------------------------------------------------------------------ */
/*  Side Panel                                                         */
/* ------------------------------------------------------------------ */

function SidePanel({
  isOpen,
  onClose,
  isSignedIn,
}: {
  isOpen: boolean
  onClose: () => void
  isSignedIn: boolean
}) {
  const navigate = useNavigate()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.aside
            className="fixed top-0 left-0 bottom-0 w-72 bg-white shadow-xl z-50 flex flex-col"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-dayli-pale">
              <h2 className="font-heading text-lg font-semibold text-dayli-deep">
                Menu
              </h2>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-dayli-pale transition-colors"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
              {/* Chats */}
              <div>
                <h3 className="font-body text-xs font-semibold text-dayli-deep/40 uppercase tracking-wider mb-2">
                  Chats
                </h3>
                <p className="font-body text-sm text-dayli-deep/50 italic">
                  No previous chats yet
                </p>
              </div>

              {/* Recent */}
              <div>
                <h3 className="font-body text-xs font-semibold text-dayli-deep/40 uppercase tracking-wider mb-2">
                  Recent
                </h3>
                <p className="font-body text-sm text-dayli-deep/50 italic">
                  No recent activity
                </p>
              </div>

              {/* Signed-in sections */}
              {isSignedIn && (
                <>
                  <button
                    onClick={() => {
                      navigate('/dashboard')
                      onClose()
                    }}
                    className="w-full text-left font-body text-sm text-dayli-deep hover:text-dayli-vibrant transition-colors"
                  >
                    Back to Dashboard
                  </button>

                  <div>
                    <h3 className="font-body text-xs font-semibold text-dayli-deep/40 uppercase tracking-wider mb-2">
                      Collections
                    </h3>
                    <p className="font-body text-sm text-dayli-deep/50 italic">
                      No saved collections
                    </p>
                  </div>
                </>
              )}
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

/* ------------------------------------------------------------------ */
/*  Thinking dots                                                      */
/* ------------------------------------------------------------------ */

function ThinkingDots() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-2 h-2 rounded-full bg-dayli-light"
          animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Inline Resource Card                                               */
/* ------------------------------------------------------------------ */

function InlineResourceCard({
  resource,
  isSignedIn,
  liked,
  onToggleLike,
  feedback,
  onFeedback,
}: {
  resource: ResourceCard
  isSignedIn: boolean
  liked: boolean
  onToggleLike: () => void
  feedback: 'up' | 'down' | null
  onFeedback: (v: 'up' | 'down') => void
}) {
  return (
    <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
      <p className="font-body text-sm font-semibold text-dayli-deep mb-1 line-clamp-1">
        {resource.title}
      </p>
      <p className="font-body text-xs text-dayli-deep/50 mb-3">
        {resource.source}
      </p>

      <div className="flex items-center gap-2 flex-wrap">
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-body font-medium text-dayli-deep hover:border-dayli-vibrant transition-colors"
        >
          Learn More
        </a>
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-dayli-vibrant text-white text-xs font-body font-medium hover:opacity-90 transition-opacity"
        >
          <ExternalLink size={12} />
          Go To Solution
        </a>

        <div className="flex items-center gap-1 ml-auto">
          {isSignedIn && (
            <button
              onClick={onToggleLike}
              aria-label={liked ? 'Remove from favorites' : 'Add to favorites'}
              className="p-1 rounded-full hover:bg-red-50 transition-colors"
            >
              <Heart
                size={14}
                className={
                  liked
                    ? 'fill-red-500 text-red-500'
                    : 'text-dayli-deep/30'
                }
              />
            </button>
          )}
          <button
            onClick={() => onFeedback('up')}
            aria-label="Helpful"
            className="p-1 rounded-full hover:bg-green-50 transition-colors"
          >
            <ThumbsUp
              size={14}
              className={
                feedback === 'up'
                  ? 'fill-green-500 text-green-500'
                  : 'text-dayli-deep/30'
              }
            />
          </button>
          <button
            onClick={() => onFeedback('down')}
            aria-label="Not helpful"
            className="p-1 rounded-full hover:bg-red-50 transition-colors"
          >
            <ThumbsDown
              size={14}
              className={
                feedback === 'down'
                  ? 'fill-red-500 text-red-500'
                  : 'text-dayli-deep/30'
              }
            />
          </button>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function ChatScreen() {
  const navigate = useNavigate()
  const { isSignedIn, username, toggleLike, isLiked } = useUser()

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [sideOpen, setSideOpen] = useState(false)
  const [feedbackState, setFeedbackState] = useState<
    Record<string, 'up' | 'down' | null>
  >({})

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  /* auto-scroll on new messages */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isThinking])

  /* feedback helper */
  const handleResourceFeedback = useCallback(
    (resourceId: string, value: 'up' | 'down') => {
      setFeedbackState((prev) => ({
        ...prev,
        [resourceId]: prev[resourceId] === value ? null : value,
      }))
    },
    []
  )

  /* send message */
  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return
      const userMsg: ChatMessage = {
        id: uid(),
        role: 'user',
        text: text.trim(),
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, userMsg])
      setInput('')
      setIsThinking(true)

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/chat`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: text.trim(),
              history: messages.map((m) => ({
                role: m.role,
                content: m.text,
              })),
            }),
          }
        )

        if (!res.ok) throw new Error('Chat request failed')

        const data = await res.json()

        const aiMsg: ChatMessage = {
          id: uid(),
          role: 'ai',
          text:
            data.reply ??
            "I'm sorry, I couldn't process that. Could you try rephrasing?",
          resources: data.resources ?? [],
          timestamp: Date.now(),
        }
        setMessages((prev) => [...prev, aiMsg])
      } catch {
        /* Fallback so the UI doesn't break during development */
        const fallback: ChatMessage = {
          id: uid(),
          role: 'ai',
          text: "I appreciate your question! I'm still connecting to my knowledge base. In the meantime, you can browse our curated solutions on the Results page.",
          resources: [
            {
              id: uid(),
              title: 'Browse Adaptive Solutions',
              url: '/results',
              source: 'Dayli AI',
            },
          ],
          timestamp: Date.now(),
        }
        setMessages((prev) => [...prev, fallback])
      } finally {
        setIsThinking(false)
      }
    },
    [messages]
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const isEmpty = messages.length === 0

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */
  return (
    <div className="flex flex-col h-screen bg-dayli-bg">
      {/* Header bar */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-dayli-pale">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={() => setSideOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-dayli-pale transition-colors text-dayli-deep"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          <span className="font-heading text-lg font-semibold text-dayli-deep">
            Dayli AI Chat
          </span>

          <button
            onClick={() => navigate(-1)}
            className="px-3 py-1.5 rounded-xl border border-dayli-pale font-body text-xs font-medium text-dayli-deep hover:bg-dayli-pale/50 transition-colors"
          >
            Exit Chat
          </button>
        </div>
      </header>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
          {/* Empty state */}
          {isEmpty && !isThinking && (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
              <motion.h2
                className="font-heading text-2xl sm:text-3xl font-semibold text-dayli-deep mb-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {isSignedIn
                  ? `Hi ${username}! I'm Dayli AI.`
                  : "Hi! I'm Dayli AI."}
              </motion.h2>
              <motion.p
                className="font-body text-dayli-deep/60 max-w-md"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
              >
                How can I assist you today?
              </motion.p>
            </div>
          )}

          {/* Message bubbles */}
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div
                className={`min-w-0 max-w-[95%] sm:max-w-[75%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-dayli-vibrant text-white rounded-br-md'
                    : 'bg-white border border-gray-200 text-dayli-deep rounded-bl-md'
                }`}
              >
                <p className="font-body text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.text}
                </p>

                {/* Resource cards */}
                {msg.resources?.map((r) => (
                  <InlineResourceCard
                    key={r.id}
                    resource={r}
                    isSignedIn={isSignedIn}
                    liked={isLiked(r.id)}
                    onToggleLike={() => toggleLike(r.id)}
                    feedback={feedbackState[r.id] ?? null}
                    onFeedback={(v) => handleResourceFeedback(r.id, v)}
                  />
                ))}
              </div>
            </motion.div>
          ))}

          {/* Thinking indicator */}
          {isThinking && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md">
                <ThinkingDots />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Suggested topics (only when empty) */}
      {isEmpty && !isThinking && (
        <div className="max-w-4xl mx-auto px-4 pb-2 flex flex-wrap gap-2 justify-center">
          {SUGGESTED_TOPICS.map((topic) => (
            <button
              key={topic}
              onClick={() => sendMessage(topic)}
              className="px-4 py-2 rounded-full bg-white border border-dayli-pale font-body text-sm text-dayli-deep hover:border-dayli-vibrant hover:text-dayli-vibrant transition-colors"
            >
              {topic}
            </button>
          ))}
        </div>
      )}

      {/* Input area */}
      <div className="border-t border-dayli-pale bg-white">
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto px-4 py-3 flex items-end gap-3"
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            rows={1}
            className="flex-1 resize-none rounded-xl border border-dayli-pale bg-dayli-bg px-4 py-2.5 font-body text-sm text-dayli-deep placeholder:text-dayli-deep/40 focus:outline-none focus:border-dayli-vibrant transition-colors"
            aria-label="Chat message input"
          />
          <button
            type="submit"
            disabled={!input.trim() || isThinking}
            className="shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-dayli-vibrant text-white disabled:opacity-40 hover:opacity-90 transition-opacity"
            aria-label="Send message"
          >
            <Send size={18} />
          </button>
        </form>
      </div>

      {/* Side panel */}
      <SidePanel
        isOpen={sideOpen}
        onClose={() => setSideOpen(false)}
        isSignedIn={isSignedIn}
      />
    </div>
  )
}
