import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Heart, ThumbsUp, ThumbsDown, ChevronRight, Plus } from 'lucide-react'
import Header from '../components/Header'
import { useUser } from '../context/UserContext'
import { supabase } from '../lib/supabase'

/* ------------------------------------------------------------------ */
/* Mock data – replace with real API calls                            */
/* ------------------------------------------------------------------ */
interface Solution {
  id: string
  title: string
  description: string
  image?: string
}

const FALLBACK_COLLECTIONS = [
  { id: 'col-1', name: 'Kitchen Aids', count: 4, emoji: '🍽️' },
  { id: 'col-2', name: 'Bathroom Safety', count: 3, emoji: '🚿' },
  { id: 'col-3', name: 'Mobility Gear', count: 5, emoji: '🦽' },
]

const QUICK_PROMPTS = [
  'Best mobility aids for seniors',
  'Bathroom safety tips',
  'Adaptive eating utensils',
]

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */
function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */
export default function DashboardScreen() {
  const { isSignedIn, username, isLiked, toggleLike } = useUser()
  const navigate = useNavigate()

  const [chatInput, setChatInput] = useState('')
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)

  const [allSolutions, setAllSolutions] = useState<Solution[]>([])
  const [recommendations, setRecommendations] = useState<Solution[]>([])
  const [collections, setCollections] = useState<{id: string, name: string, count: number, emoji: string}[]>([])
  const [feedbackStats, setFeedbackStats] = useState({ up: 0, down: 0 })

  // Auth guard
  useEffect(() => {
    if (!isSignedIn) navigate('/', { replace: true })
  }, [isSignedIn, navigate])

  useEffect(() => {
    async function fetchDashboardData() {
      // Fetch solutions for recommendations
      const { data: solutions } = await supabase
        .from('internal_solutions')
        .select('*')
        .limit(3)

      if (solutions) {
        setRecommendations(solutions.map(s => ({
          id: s.id,
          title: s.title,
          description: s.description,
        })))
      }

      // Fetch all solutions for "liked" display (user's liked ones come from UserContext)
      const { data: allSolutionsData } = await supabase
        .from('internal_solutions')
        .select('*')

      if (allSolutionsData) {
        setAllSolutions(allSolutionsData.map(s => ({
          id: s.id,
          title: s.title,
          description: s.description,
        })))
      }

      // Fetch feedback stats
      const { count: upCount } = await supabase
        .from('solution_feedback')
        .select('*', { count: 'exact', head: true })
        .eq('is_helpful', true)

      const { count: downCount } = await supabase
        .from('solution_feedback')
        .select('*', { count: 'exact', head: true })
        .eq('is_helpful', false)

      setFeedbackStats({ up: upCount || 0, down: downCount || 0 })
    }

    if (isSignedIn) fetchDashboardData()
  }, [isSignedIn])

  if (!isSignedIn) return null

  const likedSolutions = allSolutions.filter((s) => isLiked(s.id))
  const displayCollections = collections.length > 0 ? collections : FALLBACK_COLLECTIONS

  const handleChatSubmit = (text?: string) => {
    const msg = text ?? chatInput.trim()
    if (!msg) return
    navigate('/chat', { state: { autoSend: msg } })
  }

  return (
    <div className="min-h-screen bg-dayli-bg">
      <Header showDashboardText={true} showSettings={true} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Greeting */}
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-dayli-deep">
          {getGreeting()}, {username}!
        </h1>

        {/* Chat Input + Quick Prompts */}
        <section className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleChatSubmit()}
              placeholder="Ask Dayli AI anything..."
              className="flex-1 px-4 py-3 rounded-xl border border-dayli-pale bg-white font-body text-dayli-deep placeholder:text-dayli-deep/40 focus:outline-none focus:ring-2 focus:ring-dayli-vibrant/50 focus:border-dayli-vibrant transition-colors"
            />
            <button
              onClick={() => handleChatSubmit()}
              className="px-5 py-3 bg-dayli-vibrant text-white font-body font-semibold rounded-xl hover:opacity-90 transition-opacity"
            >
              Send
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {QUICK_PROMPTS.map((pill) => (
              <button
                key={pill}
                onClick={() => handleChatSubmit(pill)}
                className="px-4 py-1.5 rounded-full bg-dayli-pale text-dayli-deep font-body text-sm hover:bg-dayli-light transition-colors"
              >
                {pill}
              </button>
            ))}
          </div>
        </section>

        {/* Find A Solution CTA */}
        <Link
          to="/diagnostic"
          className="block rounded-2xl bg-gradient-to-r from-dayli-deep to-dayli-vibrant p-6 sm:p-8 text-white hover:opacity-95 transition-opacity"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading text-2xl font-bold mb-1">Find A Solution</h2>
              <p className="font-body text-white/80 text-sm">
                Use our guided diagnostic to discover assistive tools tailored to your needs.
              </p>
            </div>
            <ChevronRight size={28} className="shrink-0" />
          </div>
        </Link>

        {/* Solutions You Love */}
        <section>
          <h2 className="font-heading text-xl font-semibold text-dayli-deep mb-4">
            Solutions You Love
          </h2>
          {likedSolutions.length === 0 ? (
            <p className="font-body text-dayli-deep/60 text-sm">
              Tap the heart on any solution to save it here.
            </p>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory md:grid md:grid-cols-3 lg:grid-cols-4 md:overflow-visible">
              {likedSolutions.map((sol) => (
                <div
                  key={sol.id}
                  className="snap-start shrink-0 w-64 md:w-auto bg-white rounded-2xl border border-dayli-pale p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-heading text-base font-semibold text-dayli-deep leading-snug">
                      {sol.title}
                    </h3>
                    <button
                      onClick={() => toggleLike(sol.id)}
                      aria-label={`Remove ${sol.title} from favorites`}
                      className="shrink-0 ml-2"
                    >
                      <Heart size={20} className="fill-red-500 text-red-500" />
                    </button>
                  </div>
                  <p className="font-body text-dayli-deep/70 text-sm">{sol.description}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* What You Found Helpful */}
        <section>
          <h2 className="font-heading text-xl font-semibold text-dayli-deep mb-4">
            What You Found Helpful
          </h2>
          <button
            onClick={() => setShowFeedbackModal(true)}
            className="inline-flex items-center rounded-full border border-dayli-pale bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            <span className="flex items-center gap-1.5 px-4 py-2 text-green-600 font-body text-sm font-medium">
              <ThumbsUp size={16} /> {feedbackStats.up}
            </span>
            <span className="w-px h-8 bg-dayli-pale" />
            <span className="flex items-center gap-1.5 px-4 py-2 text-dayli-error font-body text-sm font-medium">
              <ThumbsDown size={16} /> {feedbackStats.down}
            </span>
          </button>
        </section>

        {/* Your Collections */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-xl font-semibold text-dayli-deep">
              Your Collections
            </h2>
            <button
              className="flex items-center gap-1 text-dayli-vibrant font-body text-sm font-medium hover:underline"
              onClick={() => {/* TODO: create collection */}}
            >
              <Plus size={16} /> New
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory md:grid md:grid-cols-3 lg:grid-cols-4 md:overflow-visible">
            {displayCollections.map((col) => (
              <div
                key={col.id}
                className="snap-start shrink-0 w-52 md:w-auto bg-white rounded-2xl border border-dayli-pale p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <span className="text-3xl mb-2 block">{col.emoji}</span>
                <h3 className="font-heading text-base font-semibold text-dayli-deep">{col.name}</h3>
                <p className="font-body text-dayli-deep/60 text-sm">{col.count} items</p>
              </div>
            ))}
          </div>
        </section>

        {/* New Recommendations */}
        <section>
          <h2 className="font-heading text-xl font-semibold text-dayli-deep mb-4">
            New Recommendations
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory md:grid md:grid-cols-3 lg:grid-cols-4 md:overflow-visible">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="snap-start shrink-0 w-64 md:w-auto bg-white rounded-2xl border border-dayli-pale p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="font-heading text-base font-semibold text-dayli-deep mb-1">
                  {rec.title}
                </h3>
                <p className="font-body text-dayli-deep/70 text-sm">{rec.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Feedback Stats Modal */}
      {showFeedbackModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setShowFeedbackModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-heading text-xl font-bold text-dayli-deep mb-4">
              Feedback Stats
            </h3>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <ThumbsUp size={20} className="text-green-600" />
                <span className="font-body text-dayli-deep">{feedbackStats.up} solutions marked helpful</span>
              </div>
              <div className="flex items-center gap-3">
                <ThumbsDown size={20} className="text-dayli-error" />
                <span className="font-body text-dayli-deep">{feedbackStats.down} solutions marked not helpful</span>
              </div>
            </div>
            <button
              onClick={() => setShowFeedbackModal(false)}
              className="w-full py-2.5 bg-dayli-vibrant text-white font-body font-semibold rounded-xl hover:opacity-90 transition-opacity"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
