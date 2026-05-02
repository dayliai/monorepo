'use client'

/**
 * /admin/insights — manually-triggered chat-analytics dashboard.
 * Pick a source + date range, click Run analysis, see the result.
 * Browse prior reports from the dropdown without re-running.
 */

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/lib/hooks/useUser'
import {
  Loader2, Sparkles, MessageSquare, TrendingUp, AlertTriangle, Hash, Lightbulb,
  Heart, ChevronRight, Calendar, Database, FileText, Quote, ArrowLeft, Download,
  ArrowUpRight, ArrowDownRight, Users, Filter,
} from 'lucide-react'
import { AuthButton } from '@/components/AuthButton'

type Source = 'all' | 'landing-submission' | 'landing-request' | 'web-assessment'
type Preset = '1d' | '3d' | '7d' | '30d' | 'custom'

type ReportRow = {
  id: string
  source: string
  period_start: string
  period_end: string
  generated_at: string
  triggered_by: string
  total_chats: number | null
}

type Report = ReportRow & {
  by_status: Record<string, number> | null
  by_category: Record<string, number> | null
  sentiment_overview: {
    dominant_sentiment?: string
    distribution?: Record<string, number>
    notable_quotes?: { quote: string; sentiment: string }[]
  } | null
  ai_success_overview: {
    score?: number
    what_worked?: string[]
    what_failed?: string[]
    examples?: { type: string; note: string }[]
  } | null
  top_themes: { theme: string; count: number; sample_quote: string }[] | null
  drop_off_patterns: { pattern: string; frequency: number; recommendation: string }[] | null
  recommendations: string | null
  metrics: {
    funnel?: { stages: { key: string; label: string; count: number; pct: number }[] }
    drop_off_turns?: { bucket: string; count: number }[]
    persona_split?: { role: string; count: number; completed: number; completion_pct: number; top_category: string | null }[] | null
    coverage_gaps?: { category: string; mentions: number; solutions_in_category: number; coverage_ratio: number }[]
    previous_period?: {
      period_start: string
      period_end: string
      deltas: {
        total_chats:     { previous: number; current: number; delta: number }
        completed_count: { previous: number; current: number; delta: number }
        completed_pct:   { previous: number; current: number; delta_pts: number }
        abandoned_pct:   { previous: number; current: number; delta_pts: number }
      }
    } | null
  } | null
}

const SOURCE_LABELS: Record<Exclude<Source, 'all'>, string> = {
  'landing-submission': 'DLL — Share a Solution',
  'landing-request':    'DLL — Share a Challenge',
  'web-assessment':     'Dayli — AI Assessment',
}
const SOURCE_SHORT: Record<string, string> = {
  'landing-submission': 'Solution',
  'landing-request':    'Challenge',
  'web-assessment':     'Assessment',
}

const ALL_SOURCES: Exclude<Source, 'all'>[] = ['landing-submission', 'landing-request', 'web-assessment']

// Sentiment → color tokens
const SENTIMENT_COLORS: Record<string, { bg: string; text: string; bar: string }> = {
  calm:        { bg: 'bg-sky-50',    text: 'text-sky-700',    bar: 'bg-sky-400' },
  hopeful:     { bg: 'bg-emerald-50', text: 'text-emerald-700', bar: 'bg-emerald-400' },
  satisfied:   { bg: 'bg-emerald-50', text: 'text-emerald-700', bar: 'bg-emerald-500' },
  confused:    { bg: 'bg-amber-50',  text: 'text-amber-700',  bar: 'bg-amber-400' },
  frustrated:  { bg: 'bg-orange-50', text: 'text-orange-700', bar: 'bg-orange-400' },
  distressed:  { bg: 'bg-rose-50',   text: 'text-rose-700',   bar: 'bg-rose-400' },
}
function sentimentColor(s?: string) {
  if (!s) return { bg: 'bg-gray-50', text: 'text-gray-700', bar: 'bg-gray-400' }
  return SENTIMENT_COLORS[s.toLowerCase()] ?? { bg: 'bg-gray-50', text: 'text-gray-700', bar: 'bg-gray-400' }
}

function rangeFromPreset(preset: Preset): { start: Date; end: Date } | null {
  if (preset === 'custom') return null
  const end = new Date()
  const start = new Date()
  if (preset === '1d')  start.setDate(start.getDate() - 1)
  if (preset === '3d')  start.setDate(start.getDate() - 3)
  if (preset === '7d')  start.setDate(start.getDate() - 7)
  if (preset === '30d') start.setDate(start.getDate() - 30)
  return { start, end }
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}
function fmtDateShort(iso: string) {
  return new Date(iso).toLocaleString(undefined, { month: 'short', day: 'numeric' })
}
// Friendly source labels for the PDF filename — match what users see in the UI
const SOURCE_FILENAME: Record<string, string> = {
  'landing-submission': 'DLL Share a Solution',
  'landing-request':    'DLL Share a Challenge',
  'web-assessment':     'Dayli AI Assessment',
}

function fmtRangeForFilename(startIso: string, endIso: string) {
  const start = new Date(startIso)
  const end = new Date(endIso)
  const sameYear  = start.getFullYear() === end.getFullYear()
  const sameMonth = sameYear && start.getMonth() === end.getMonth()
  const sameDay   = sameMonth && start.getDate() === end.getDate()
  const monthDay = (d: Date) => d.toLocaleString('en-US', { month: 'short', day: 'numeric' })
  if (sameDay)   return `${monthDay(start)}, ${start.getFullYear()}`
  if (sameMonth) return `${start.toLocaleString('en-US', { month: 'short' })} ${start.getDate()}–${end.getDate()}, ${start.getFullYear()}`
  if (sameYear)  return `${monthDay(start)} – ${monthDay(end)}, ${start.getFullYear()}`
  return `${monthDay(start)}, ${start.getFullYear()} – ${monthDay(end)}, ${end.getFullYear()}`
}

// Temporarily swap document.title so the browser uses it as the default
// "Save as PDF" filename, then restore the original. Filename shape:
//   Dayli AI Insights — Share a Challenge — Apr 25–May 1, 2026
function downloadAsPdf(report: { source: string; period_start: string; period_end: string }) {
  const original = document.title
  const friendly = SOURCE_FILENAME[report.source] ?? report.source
  const range = fmtRangeForFilename(report.period_start, report.period_end)
  const filename = `Dayli AI Insights — ${friendly} — ${range}`
  document.title = filename
  setTimeout(() => {
    window.print()
    setTimeout(() => { document.title = original }, 200)
  }, 50)
}

export default function AdminInsightsPage() {
  const router = useRouter()
  const { user, loading, isAdmin, adminLoading } = useUser()

  const [source, setSource] = useState<Source>('all')
  const [preset, setPreset] = useState<Preset>('7d')
  const [customStart, setCustomStart] = useState('')
  const [customEnd, setCustomEnd] = useState('')

  const [previewing, setPreviewing] = useState(false)
  const [previewCounts, setPreviewCounts] = useState<Record<string, number> | null>(null)

  const [running, setRunning] = useState(false)
  const [runError, setRunError] = useState<string | null>(null)

  const [pastReports, setPastReports] = useState<ReportRow[]>([])
  const [activeReport, setActiveReport] = useState<Report | null>(null)

  // Auth gate (server-side check is the real gate; this is just UX)
  useEffect(() => {
    if (loading || adminLoading) return
    if (!user || !isAdmin) router.replace('/')
  }, [loading, adminLoading, user, isAdmin, router])

  function getRange(): { start: string; end: string } | null {
    if (preset === 'custom') {
      if (!customStart || !customEnd) return null
      return { start: new Date(customStart).toISOString(), end: new Date(customEnd).toISOString() }
    }
    const r = rangeFromPreset(preset)
    if (!r) return null
    return { start: r.start.toISOString(), end: r.end.toISOString() }
  }

  function getSelectedSources(): Exclude<Source, 'all'>[] {
    return source === 'all' ? ALL_SOURCES : [source]
  }

  // Fetch chat-count preview when source/range changes
  const refreshPreview = useCallback(async () => {
    const range = getRange()
    if (!range) { setPreviewCounts(null); return }
    setPreviewing(true)
    try {
      const sources = getSelectedSources().join(',')
      const url = `/api/admin/insights/preview?sources=${sources}&period_start=${encodeURIComponent(range.start)}&period_end=${encodeURIComponent(range.end)}`
      const res = await fetch(url)
      if (!res.ok) throw new Error(await res.text())
      const json = await res.json()
      setPreviewCounts(json.counts ?? null)
    } catch {
      setPreviewCounts(null)
    } finally {
      setPreviewing(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source, preset, customStart, customEnd])

  useEffect(() => { if (isAdmin) refreshPreview() }, [refreshPreview, isAdmin])

  // Fetch past reports list
  const refreshPastReports = useCallback(async () => {
    if (!isAdmin) return
    const url = source === 'all'
      ? '/api/admin/insights/reports?limit=50'
      : `/api/admin/insights/reports?source=${source}&limit=50`
    const res = await fetch(url)
    if (!res.ok) return
    const json = await res.json()
    setPastReports(json.reports ?? [])
  }, [source, isAdmin])

  useEffect(() => { refreshPastReports() }, [refreshPastReports])

  async function loadReport(id: string) {
    const res = await fetch(`/api/admin/insights/reports/${id}`)
    if (!res.ok) return
    const json = await res.json()
    setActiveReport(json.report)
  }

  async function handleRun() {
    const range = getRange()
    if (!range) {
      setRunError('Pick a date range')
      return
    }
    setRunning(true)
    setRunError(null)
    setActiveReport(null)
    try {
      const res = await fetch('/api/admin/insights/run', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          sources: getSelectedSources(),
          period_start: range.start,
          period_end: range.end,
        }),
      })
      if (!res.ok) throw new Error(await res.text())
      const json = await res.json()
      const reports: Report[] = json.reports ?? []
      if (reports.length > 0) setActiveReport(reports[0])
      if (json.errors?.length) {
        setRunError(`Some sources failed: ${json.errors.map((e: { source: string; message: string }) => `${e.source}: ${e.message}`).join('; ')}`)
      }
      refreshPastReports()
    } catch (err) {
      setRunError((err as Error).message || 'Run failed')
    } finally {
      setRunning(false)
    }
  }

  if (loading || adminLoading || !user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fdfafb] to-[#F3E8F4] text-[#6a7282]">
        <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading…
      </div>
    )
  }

  const totalSelected = previewCounts
    ? Object.values(previewCounts).reduce((a, b) => a + (b > 0 ? b : 0), 0)
    : null

  return (
    <div className="min-h-screen bg-[#fdfafb]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="h-9 w-9 rounded-full flex items-center justify-center text-[#4A154B] hover:bg-[#F3E8F4] transition-colors group"
              title="Back to Dayli AI"
              aria-label="Back to Dayli AI"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => router.push('/admin/insights')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              title="Admin · Insights"
            >
              <Sparkles className="h-5 w-5 text-[#06b6d4]" />
              <span className="font-serif text-[18px] font-semibold text-[#121928]">Admin</span>
              <span className="px-2 py-0.5 rounded-full bg-[#F3E8F4] text-[#4A154B] text-[10px] font-bold uppercase tracking-wider">Insights</span>
            </button>
          </div>
          <AuthButton />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">

        {/* Hero */}
        <div className="no-print rounded-3xl bg-gradient-to-r from-[#E0F7FA] to-[#F3E8F4] p-6 md:p-8 border border-[#06b6d4]/20">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#0e7490] mb-3">
            <Sparkles className="h-3.5 w-3.5 text-[#06b6d4]" /> Chat Analytics
          </div>
          <h1 className="font-serif text-[32px] md:text-[44px] font-bold leading-tight text-[#121928] tracking-tight">
            Understand what users say, <span className="text-[#4A154B]">and what we miss</span>.
          </h1>
          <p className="text-[15px] text-[#6a7282] mt-2 max-w-2xl">
            Run on-demand analysis across Daily Living Labs chats and Dayli AI assessments — sentiment, top themes, drop-off patterns, and recommendations to tune the agent.
          </p>
        </div>

        {/* Controls card */}
        <div className="no-print bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 md:p-7 space-y-5">
            <div className="flex flex-col md:flex-row md:items-end gap-4">
              <Field label="Source" icon={<Database className="h-3.5 w-3.5" />} className="flex-1 min-w-0">
                <select
                  value={source}
                  onChange={e => setSource(e.target.value as Source)}
                  className="w-full h-11 rounded-xl border border-gray-200 bg-white px-3 pr-9 text-[14px] font-medium text-[#121928] outline-none focus:border-[#4A154B] focus:ring-2 focus:ring-[#F3E8F4] transition-all cursor-pointer"
                >
                  <option value="all">All sources</option>
                  {ALL_SOURCES.map(s => (
                    <option key={s} value={s}>{SOURCE_LABELS[s]}</option>
                  ))}
                </select>
              </Field>

              <Field label="Date range" icon={<Calendar className="h-3.5 w-3.5" />} className="flex-1 min-w-0">
                <select
                  value={preset}
                  onChange={e => setPreset(e.target.value as Preset)}
                  className="w-full h-11 rounded-xl border border-gray-200 bg-white px-3 pr-9 text-[14px] font-medium text-[#121928] outline-none focus:border-[#4A154B] focus:ring-2 focus:ring-[#F3E8F4] transition-all cursor-pointer"
                >
                  <option value="1d">Last 24 hours</option>
                  <option value="3d">Last 3 days</option>
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="custom">Custom range…</option>
                </select>
              </Field>

              {preset === 'custom' && (
                <>
                  <Field label="Start" className="flex-1 min-w-0">
                    <input
                      type="datetime-local"
                      value={customStart}
                      onChange={e => setCustomStart(e.target.value)}
                      className="w-full h-11 rounded-xl border border-gray-200 bg-white px-3 text-[14px] text-[#121928] outline-none focus:border-[#4A154B] focus:ring-2 focus:ring-[#F3E8F4] transition-all"
                    />
                  </Field>
                  <Field label="End" className="flex-1 min-w-0">
                    <input
                      type="datetime-local"
                      value={customEnd}
                      onChange={e => setCustomEnd(e.target.value)}
                      className="w-full h-11 rounded-xl border border-gray-200 bg-white px-3 text-[14px] text-[#121928] outline-none focus:border-[#4A154B] focus:ring-2 focus:ring-[#F3E8F4] transition-all"
                    />
                  </Field>
                </>
              )}

              <button
                onClick={handleRun}
                disabled={running || previewing || totalSelected === 0}
                className="shrink-0 h-11 rounded-full bg-[#4A154B] px-6 text-[14px] font-bold text-white flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#310D32] transition-colors shadow-[0px_8px_20px_0px_rgba(74,21,75,0.25)]"
              >
                {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                {running ? 'Analyzing…' : 'Run analysis'}
              </button>
            </div>

            {/* Pre-run summary strip */}
            <div className="flex items-center gap-4 pt-4 border-t border-[#F3E8F4]">
              <div className="h-10 w-10 rounded-xl bg-[#F3E8F4] flex items-center justify-center shrink-0">
                <MessageSquare className="h-5 w-5 text-[#4A154B]" />
              </div>
              <div className="flex-1 min-w-0">
                {previewing && <div className="text-[13px] text-gray-500">Counting chats in range…</div>}
                {!previewing && previewCounts && totalSelected !== null && (
                  <>
                    <div className="text-[14px]">
                      <span className="text-[28px] font-bold text-[#4A154B] tabular-nums leading-none">{totalSelected}</span>
                      <span className="text-[13px] text-gray-600 ml-2">chats in this window</span>
                    </div>
                    {Object.keys(previewCounts).length > 1 && (
                      <div className="flex flex-wrap gap-2 mt-1.5">
                        {Object.entries(previewCounts).map(([s, n]) => (
                          <span key={s} className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-gray-50 text-[11px] text-gray-600 border border-gray-100">
                            <span className="font-semibold text-gray-800">{n}</span>
                            <span className="text-gray-400">·</span>
                            <span>{SOURCE_SHORT[s] ?? s}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {runError && (
              <div className="flex items-start gap-2 text-[13px] text-rose-700 bg-rose-50 border border-rose-200 rounded-xl p-3">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{runError}</span>
              </div>
            )}
          </div>
        </div>

        {/* Past reports + active report */}
        <div className="grid lg:grid-cols-[300px_1fr] gap-6 items-start">

          {/* Past reports */}
          <div className="no-print bg-white rounded-3xl shadow-sm border border-gray-100 p-4 lg:sticky lg:top-24">
            <div className="px-2 pt-1 pb-3 flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#4A154B]" />
              <h2 className="text-[13px] font-bold text-[#121928] uppercase tracking-wider">Past reports</h2>
              <span className="ml-auto text-[11px] text-gray-400 tabular-nums">{pastReports.length}</span>
            </div>
            {pastReports.length === 0 ? (
              <div className="text-[13px] text-gray-500 px-3 py-6 text-center bg-gray-50/50 rounded-xl">
                No reports yet. Run your first analysis above.
              </div>
            ) : (
              <div className="space-y-1 max-h-[480px] overflow-y-auto pr-1 -mr-1">
                {pastReports.map(r => {
                  const active = activeReport?.id === r.id
                  return (
                    <button
                      key={r.id}
                      onClick={() => loadReport(r.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-[13px] transition-all group ${
                        active
                          ? 'bg-gradient-to-r from-[#F3E8F4] to-[#FBF5FE] ring-1 ring-[#9230E3]/20 shadow-sm'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded ${
                          active ? 'bg-[#4A154B] text-white' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {SOURCE_SHORT[r.source] ?? r.source}
                        </span>
                        <span className="text-[11px] text-gray-400 tabular-nums ml-auto">{r.total_chats ?? 0} chats</span>
                      </div>
                      <div className={`font-medium ${active ? 'text-[#4A154B]' : 'text-[#121928]'}`}>
                        {fmtDateShort(r.period_start)} → {fmtDateShort(r.period_end)}
                      </div>
                      <div className="text-[11px] text-gray-400 mt-0.5">
                        {fmtDate(r.generated_at)}
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Active report or empty state */}
          {activeReport ? (
            <ReportView report={activeReport} />
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Report
// ─────────────────────────────────────────────────────────────────────────────

function ReportView({ report }: { report: Report }) {
  const status = report.by_status ?? {}
  const cat = report.by_category ?? {}
  const total = report.total_chats ?? 0
  const completed = status.completed ?? 0
  const abandoned = status.abandoned ?? 0
  const inProgress = status.in_progress ?? 0
  const completedPct = total > 0 ? Math.round((completed / total) * 100) : 0
  const abandonedPct = total > 0 ? Math.round((abandoned / total) * 100) : 0

  const topCats = Object.entries(cat).sort((a, b) => b[1] - a[1]).slice(0, 6)

  return (
    <div className="space-y-6">
      {/* Report header */}
      <div id="insights-report" className="rounded-3xl bg-gradient-to-r from-[#E0F7FA] to-[#F3E8F4] p-6 md:p-7 border border-[#06b6d4]/20">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-[#0e7490] font-bold mb-1">
              <Sparkles className="h-3 w-3 text-[#06b6d4]" />
              {report.source}
            </div>
            <div className="font-serif text-[24px] md:text-[30px] font-bold leading-tight text-[#121928]">
              {fmtDateShort(report.period_start)} → {fmtDateShort(report.period_end)}
            </div>
            <div className="text-[12px] text-[#6a7282] mt-1">Generated {fmtDate(report.generated_at)} · {report.triggered_by}</div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => downloadAsPdf(report)}
              className="no-print h-10 rounded-full bg-white border border-gray-200 px-4 text-[13px] font-bold text-[#4A154B] flex items-center gap-2 hover:bg-[#F3E8F4] hover:border-[#4A154B]/20 transition-colors shadow-sm"
              title="Save report as PDF"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </button>
            <div className="bg-white rounded-2xl px-5 py-3 text-center shadow-sm border border-white">
              <div className="text-[10px] uppercase tracking-wider text-gray-500">Total chats</div>
              <div className="font-serif text-[36px] font-bold leading-none mt-0.5 tabular-nums text-[#121928]">{total}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Snapshot — stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={<Heart className="h-5 w-5" />}
          accent="emerald"
          label="Completed"
          value={completed}
          sub={`${completedPct}% of all chats`}
        />
        <StatCard
          icon={<AlertTriangle className="h-5 w-5" />}
          accent="orange"
          label="Abandoned"
          value={abandoned}
          sub={`${abandonedPct}% of all chats`}
        />
        <StatCard
          icon={<MessageSquare className="h-5 w-5" />}
          accent="purple"
          label="In progress"
          value={inProgress}
          sub={inProgress > 0 ? 'Still active' : 'None active'}
        />
      </div>

      {/* Period comparison */}
      {report.metrics?.previous_period && (
        <PeriodComparison data={report.metrics.previous_period} />
      )}

      {/* Funnel */}
      {report.metrics?.funnel && (
        <Section icon={<TrendingUp className="h-4 w-4" />} title="Conversion funnel">
          <FunnelView stages={report.metrics.funnel.stages} />
        </Section>
      )}

      {/* Drop-off turn distribution */}
      {report.metrics?.drop_off_turns && report.metrics.drop_off_turns.some(b => b.count > 0) && (
        <Section icon={<Filter className="h-4 w-4" />} title="Where users drop off">
          <p className="text-[13px] text-[#6a7282] -mt-2 mb-5">
            How many messages had been exchanged before users abandoned the chat.
          </p>
          <DropOffHistogram buckets={report.metrics.drop_off_turns} />
        </Section>
      )}

      {/* Persona split — web-assessment only */}
      {report.metrics?.persona_split && report.metrics.persona_split.length > 0 && (
        <Section icon={<Users className="h-4 w-4" />} title="Who is asking">
          <PersonaSplit rows={report.metrics.persona_split} />
        </Section>
      )}


      {/* Top categories */}
      {topCats.length > 0 && (
        <Section icon={<Hash className="h-4 w-4" />} title="Top categories">
          <div className="flex flex-wrap gap-2">
            {topCats.map(([k, v]) => (
              <span key={k} className="inline-flex items-center gap-2 rounded-full bg-[#F3E8F4] px-3 py-1.5 text-[13px] font-medium text-[#4A154B]">
                {k} <span className="bg-white rounded-full px-2 py-0.5 text-[11px] tabular-nums">{v}</span>
              </span>
            ))}
          </div>
        </Section>
      )}

      {/* Sentiment */}
      {report.sentiment_overview && (
        <Section icon={<Heart className="h-4 w-4" />} title="User sentiment">
          {report.sentiment_overview.dominant_sentiment && (
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[12px] uppercase tracking-wider text-gray-500">Dominant</span>
              <SentimentBadge sentiment={report.sentiment_overview.dominant_sentiment} large />
            </div>
          )}
          {report.sentiment_overview.distribution && Object.keys(report.sentiment_overview.distribution).length > 0 && (
            <div className="space-y-2 mb-5">
              {Object.entries(report.sentiment_overview.distribution).sort((a, b) => b[1] - a[1]).map(([k, v]) => {
                const c = sentimentColor(k)
                return (
                  <div key={k} className="flex items-center gap-3">
                    <span className={`text-[12px] font-medium ${c.text} min-w-[90px] capitalize`}>{k}</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${c.bar} transition-all duration-700`} style={{ width: `${Math.min(100, v)}%` }} />
                    </div>
                    <span className="text-[12px] text-gray-500 tabular-nums min-w-[36px] text-right">{v}%</span>
                  </div>
                )
              })}
            </div>
          )}
          {report.sentiment_overview.notable_quotes && report.sentiment_overview.notable_quotes.length > 0 && (
            <div className="space-y-3">
              <div className="text-[11px] uppercase tracking-wider text-gray-500 font-bold">Notable quotes</div>
              {report.sentiment_overview.notable_quotes.map((q, i) => {
                const c = sentimentColor(q.sentiment)
                return (
                  <blockquote key={i} className={`relative pl-4 py-2 ${c.bg} rounded-r-xl border-l-4 ${c.bar.replace('bg-', 'border-')}`}>
                    <Quote className={`absolute top-2 left-2 h-3 w-3 ${c.text} opacity-30`} />
                    <p className="text-[14px] text-gray-800 italic pl-4">&ldquo;{q.quote}&rdquo;</p>
                    <span className={`text-[11px] font-medium ${c.text} pl-4 capitalize`}>— {q.sentiment}</span>
                  </blockquote>
                )
              })}
            </div>
          )}
        </Section>
      )}

      {/* AI success */}
      {report.ai_success_overview && (
        <Section icon={<Sparkles className="h-4 w-4" />} title="AI performance">
          {typeof report.ai_success_overview.score === 'number' && (
            <ScoreGauge score={report.ai_success_overview.score} />
          )}
          <div className="grid md:grid-cols-2 gap-4 mt-5">
            {report.ai_success_overview.what_worked && report.ai_success_overview.what_worked.length > 0 && (
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-7 w-7 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-emerald-700" />
                  </div>
                  <h4 className="text-[12px] uppercase tracking-wider font-bold text-emerald-800">What worked</h4>
                </div>
                <ul className="space-y-2">
                  {report.ai_success_overview.what_worked.map((x, i) => (
                    <li key={i} className="text-[13px] text-gray-700 flex gap-2">
                      <span className="text-emerald-600 shrink-0">✓</span>
                      <span>{x}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {report.ai_success_overview.what_failed && report.ai_success_overview.what_failed.length > 0 && (
              <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-7 w-7 rounded-lg bg-amber-100 flex items-center justify-center">
                    <AlertTriangle className="h-4 w-4 text-amber-700" />
                  </div>
                  <h4 className="text-[12px] uppercase tracking-wider font-bold text-amber-800">What could improve</h4>
                </div>
                <ul className="space-y-2">
                  {report.ai_success_overview.what_failed.map((x, i) => (
                    <li key={i} className="text-[13px] text-gray-700 flex gap-2">
                      <span className="text-amber-600 shrink-0">!</span>
                      <span>{x}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Section>
      )}

      {/* Themes */}
      {report.top_themes && report.top_themes.length > 0 && (
        <Section icon={<Hash className="h-4 w-4" />} title="Top themes">
          <div className="space-y-2">
            {report.top_themes.map((t, i) => (
              <div key={i} className="group flex items-start gap-3 rounded-xl px-3 py-2.5 hover:bg-[#F3E8F4]/50 transition-colors">
                <div className="flex items-center gap-2 min-w-[180px]">
                  <span className="font-semibold text-[#4A154B] text-[14px]">{t.theme}</span>
                  <span className="text-[11px] tabular-nums bg-[#F3E8F4] text-[#4A154B] rounded-full px-2 py-0.5 font-bold">
                    {t.count}
                  </span>
                </div>
                {t.sample_quote && (
                  <p className="text-[13px] italic text-gray-600 flex-1">&ldquo;{t.sample_quote}&rdquo;</p>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Drop-off */}
      {report.drop_off_patterns && report.drop_off_patterns.length > 0 && (
        <Section icon={<AlertTriangle className="h-4 w-4" />} title="Drop-off patterns">
          <div className="space-y-3">
            {report.drop_off_patterns.map((p, i) => (
              <div key={i} className="rounded-2xl border border-orange-100 bg-orange-50/30 p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className="font-semibold text-[#121928] text-[14px]">{p.pattern}</span>
                  <span className="shrink-0 whitespace-nowrap text-[11px] tabular-nums bg-orange-100 text-orange-800 rounded-full px-2.5 py-0.5 font-bold">
                    {p.frequency} {p.frequency === 1 ? 'case' : 'cases'}
                  </span>
                </div>
                {p.recommendation && (
                  <div className="flex items-start gap-2 text-[13px] text-gray-700 pl-1">
                    <ChevronRight className="h-4 w-4 text-[#9230E3] shrink-0 mt-0.5" />
                    <span>{p.recommendation}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Recommendations */}
      {report.recommendations && (
        <div className="bg-gradient-to-r from-[#E0F7FA] to-[#F3E8F4] rounded-3xl p-6 md:p-7 border border-[#06b6d4]/20">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-9 w-9 rounded-xl bg-white flex items-center justify-center shadow-sm">
              <Lightbulb className="h-5 w-5 text-[#06b6d4]" />
            </div>
            <h3 className="font-serif text-[22px] font-bold text-[#121928]">Recommendations</h3>
          </div>
          <p className="text-[15px] text-gray-800 whitespace-pre-wrap leading-relaxed">{report.recommendations}</p>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Subcomponents
// ─────────────────────────────────────────────────────────────────────────────

function Field({ label, icon, children, className = '' }: { label: string; icon?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-500">
        {icon}
        {label}
      </label>
      {children}
    </div>
  )
}

function Section({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-7">
      <div className="flex items-center gap-2 mb-4">
        {icon && (
          <div className="h-7 w-7 rounded-lg bg-[#E0F7FA] flex items-center justify-center text-[#06b6d4]">
            {icon}
          </div>
        )}
        <h3 className="font-serif text-[22px] font-bold text-[#121928]">{title}</h3>
      </div>
      {children}
    </div>
  )
}

const STAT_ACCENTS: Record<string, { bg: string; ring: string; icon: string; value: string }> = {
  emerald: { bg: 'bg-emerald-50',  ring: 'ring-emerald-100', icon: 'bg-emerald-100 text-emerald-700', value: 'text-emerald-900' },
  orange:  { bg: 'bg-orange-50',   ring: 'ring-orange-100',  icon: 'bg-orange-100 text-orange-700',   value: 'text-orange-900' },
  purple:  { bg: 'bg-[#F3E8F4]',   ring: 'ring-[#9230E3]/15', icon: 'bg-white text-[#4A154B]',         value: 'text-[#4A154B]' },
}

function StatCard({ icon, accent, label, value, sub }: { icon: React.ReactNode; accent: string; label: string; value: number; sub: string }) {
  const a = STAT_ACCENTS[accent] ?? STAT_ACCENTS.purple
  return (
    <div className={`${a.bg} ring-1 ${a.ring} rounded-3xl p-5 transition-transform hover:-translate-y-0.5`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`h-9 w-9 rounded-xl ${a.icon} flex items-center justify-center`}>{icon}</div>
      </div>
      <div className={`font-serif text-[36px] font-bold leading-none tabular-nums ${a.value}`}>{value}</div>
      <div className="mt-1 text-[13px] font-semibold text-gray-700">{label}</div>
      <div className="text-[11px] text-gray-500 mt-0.5">{sub}</div>
    </div>
  )
}

function SentimentBadge({ sentiment, large = false }: { sentiment: string; large?: boolean }) {
  const c = sentimentColor(sentiment)
  return (
    <span className={`inline-flex items-center gap-2 rounded-full ${c.bg} ${c.text} font-semibold capitalize ${large ? 'px-3.5 py-1.5 text-[14px]' : 'px-2.5 py-0.5 text-[12px]'}`}>
      <span className={`h-2 w-2 rounded-full ${c.bar}`} />
      {sentiment}
    </span>
  )
}

function ScoreGauge({ score }: { score: number }) {
  const pct = Math.max(0, Math.min(1, score)) * 100
  const tone =
    pct >= 80 ? { color: 'text-emerald-700', bar: 'bg-emerald-500', label: 'Excellent' } :
    pct >= 60 ? { color: 'text-[#4A154B]',    bar: 'bg-[#9230E3]',    label: 'Solid' } :
    pct >= 40 ? { color: 'text-amber-700',   bar: 'bg-amber-400',   label: 'Mixed' } :
                { color: 'text-rose-700',    bar: 'bg-rose-400',    label: 'Needs work' }
  return (
    <div>
      <div className="flex items-baseline gap-3">
        <span className={`font-serif text-[44px] font-bold leading-none ${tone.color} tabular-nums`}>{score.toFixed(2)}</span>
        <span className="text-[14px] text-gray-400 tabular-nums">/ 1.00</span>
        <span className={`ml-auto text-[12px] font-bold uppercase tracking-wider ${tone.color}`}>{tone.label}</span>
      </div>
      <div className="mt-3 h-3 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${tone.bar} transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function PeriodComparison({ data }: { data: NonNullable<NonNullable<Report['metrics']>['previous_period']> }) {
  const d = data.deltas
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-7">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-7 w-7 rounded-lg bg-[#E0F7FA] flex items-center justify-center text-[#06b6d4]">
          <TrendingUp className="h-4 w-4" />
        </div>
        <h3 className="font-serif text-[22px] font-bold text-[#121928]">vs previous period</h3>
        <span className="ml-auto text-[11px] text-gray-500 tabular-nums">{fmtDateShort(data.period_start)} → {fmtDateShort(data.period_end)}</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <DeltaCard label="Total chats"     current={d.total_chats.current}     previous={d.total_chats.previous}     delta={d.total_chats.delta} />
        <DeltaCard label="Completed"       current={d.completed_count.current} previous={d.completed_count.previous} delta={d.completed_count.delta} />
        <DeltaCard label="Completion rate" current={d.completed_pct.current}   previous={d.completed_pct.previous}   delta={d.completed_pct.delta_pts} suffix="%" deltaSuffix=" pts" />
        <DeltaCard label="Abandoned rate"  current={d.abandoned_pct.current}   previous={d.abandoned_pct.previous}   delta={d.abandoned_pct.delta_pts} suffix="%" deltaSuffix=" pts" invertColor />
      </div>
    </div>
  )
}

function DeltaCard({ label, current, previous, delta, suffix = '', deltaSuffix = '', invertColor = false }: {
  label: string; current: number; previous: number; delta: number; suffix?: string; deltaSuffix?: string; invertColor?: boolean
}) {
  const up = delta > 0
  const flat = delta === 0
  // For most stats, "up" is good (emerald). For abandoned rate, "up" is bad (rose).
  const goodUp = !invertColor
  const tone = flat
    ? 'text-gray-500'
    : (up === goodUp ? 'text-emerald-700' : 'text-rose-700')
  const Arrow = up ? ArrowUpRight : ArrowDownRight
  return (
    <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4">
      <div className="text-[11px] uppercase tracking-wider text-gray-500 mb-1">{label}</div>
      <div className="font-serif text-[24px] font-bold text-[#121928] tabular-nums">{current}{suffix}</div>
      <div className="flex items-center gap-1 mt-1 text-[12px]">
        {!flat && <Arrow className={`h-3.5 w-3.5 ${tone}`} />}
        <span className={`tabular-nums font-semibold ${tone}`}>
          {flat ? 'no change' : `${delta > 0 ? '+' : ''}${delta}${deltaSuffix}`}
        </span>
        <span className="text-gray-400 ml-1">vs {previous}{suffix}</span>
      </div>
    </div>
  )
}

function FunnelView({ stages }: { stages: { key: string; label: string; count: number; pct: number }[] }) {
  const max = Math.max(...stages.map(s => s.count), 1)
  return (
    <div className="space-y-3">
      {stages.map((s, i) => {
        const widthPct = Math.max(8, (s.count / max) * 100)
        const dropFromPrev = i > 0 ? stages[i - 1].count - s.count : 0
        return (
          <div key={s.key}>
            <div className="flex items-baseline justify-between mb-1.5">
              <span className="text-[13px] font-semibold text-[#121928]">{s.label}</span>
              <span className="text-[12px] text-gray-500 tabular-nums">
                <span className="font-bold text-[#121928]">{s.count}</span>
                <span className="text-gray-400 ml-1">({s.pct}%)</span>
                {dropFromPrev > 0 && <span className="text-rose-600 ml-2">−{dropFromPrev}</span>}
              </span>
            </div>
            <div className="h-9 bg-gray-100 rounded-xl overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#06b6d4] to-[#9230E3] transition-all duration-700 flex items-center justify-end px-3"
                style={{ width: `${widthPct}%` }}
              >
                <span className="text-[11px] font-bold text-white tabular-nums">{s.count}</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function DropOffHistogram({ buckets }: { buckets: { bucket: string; count: number }[] }) {
  const max = Math.max(...buckets.map(b => b.count), 1)
  const total = buckets.reduce((a, b) => a + b.count, 0)
  const barAreaHeightPx = 180

  // Single-word phase tag under each bar so the columns line up cleanly
  const phase = (i: number) => {
    if (i <= 1) return { tag: 'early', color: 'text-rose-600' }
    if (i <= 3) return { tag: 'mid',   color: 'text-amber-700' }
    return       { tag: 'late',  color: 'text-sky-700' }
  }

  return (
    <div>
      {/* Y-axis label hint */}
      <div className="flex justify-between items-end mb-2">
        <span className="text-[11px] uppercase tracking-wider text-gray-500 font-bold">
          Number of abandoned chats
        </span>
        <span className="text-[11px] text-gray-500 tabular-nums">
          {total} {total === 1 ? 'chat' : 'chats'} total
        </span>
      </div>

      <div className="flex gap-3 border-l border-b border-gray-200 pb-1 pl-2">
        {buckets.map((b, i) => {
          const heightPct = (b.count / max) * 100
          const p = phase(i)
          return (
            <div key={b.bucket} className="flex-1 flex flex-col items-center gap-1.5">
              <div className={`text-[12px] font-bold tabular-nums h-4 ${b.count > 0 ? 'text-[#121928]' : 'text-transparent'}`}>
                {b.count > 0 ? b.count : '0'}
              </div>
              <div
                className="w-full bg-gray-50 rounded-lg flex items-end overflow-hidden border border-gray-100"
                style={{ height: `${barAreaHeightPx}px` }}
              >
                {b.count > 0 && (
                  <div
                    className="w-full rounded-lg bg-gradient-to-t from-orange-500 via-orange-400 to-amber-300 transition-all duration-700 shadow-sm"
                    style={{ height: `${heightPct}%` }}
                    title={`${b.count} abandoned chats ended at ${b.bucket} messages`}
                  />
                )}
              </div>
              <div className="text-[12px] font-bold text-[#121928] tabular-nums">{b.bucket}</div>
              <div className={`text-[10px] uppercase tracking-wider font-bold leading-tight text-center ${p.color}`}>
                {p.tag}
              </div>
            </div>
          )
        })}
      </div>

      {/* X-axis label */}
      <div className="text-center mt-2">
        <span className="text-[11px] uppercase tracking-wider text-gray-500 font-bold">
          Total messages exchanged when chat ended
        </span>
      </div>
    </div>
  )
}


function PersonaSplit({ rows }: { rows: NonNullable<NonNullable<Report['metrics']>['persona_split']> }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {rows.map(r => (
        <div key={r.role} className="rounded-2xl bg-gradient-to-br from-[#F3E8F4] to-[#FBF5FE] border border-[#9230E3]/15 p-5">
          <div className="text-[11px] uppercase tracking-wider text-[#4A154B] font-bold mb-1 capitalize">{r.role}</div>
          <div className="font-serif text-[28px] font-bold text-[#121928] tabular-nums leading-none">{r.count}</div>
          <div className="text-[12px] text-gray-600 mt-1">chats</div>
          <div className="mt-3 pt-3 border-t border-[#9230E3]/10">
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-gray-500">Completion</span>
              <span className="font-bold text-[#121928] tabular-nums">{r.completion_pct}%</span>
            </div>
            {r.top_category && (
              <div className="flex items-center justify-between text-[12px] mt-1">
                <span className="text-gray-500">Top category</span>
                <span className="font-medium text-[#4A154B]">{r.top_category}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 md:p-14 text-center">
      <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-[#E0F7FA] to-[#F3E8F4] flex items-center justify-center shadow-sm mb-4">
        <Sparkles className="h-7 w-7 text-[#06b6d4]" />
      </div>
      <h3 className="font-serif text-[26px] font-bold text-[#121928] mb-2">No report selected</h3>
      <p className="text-[14px] text-[#6a7282] max-w-md mx-auto">
        Pick a source and date range above, then click <span className="font-semibold text-[#4A154B]">Run analysis</span>.
        Or open a past report from the list on the left.
      </p>
    </div>
  )
}
