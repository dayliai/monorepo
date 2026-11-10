/**
 * POST /api/contact
 *
 * Sends the Partner and Connect form submissions by email through Resend.
 * Runs as a Vercel function (this file must stay in the Vercel project's
 * Root Directory under api/). Secrets are read only here, from environment
 * variables, and never reach the browser bundle:
 *   RESEND_API_KEY      Resend API key
 *   CONTACT_TO_EMAIL    where messages go (comma-separated for several)
 *   CONTACT_FROM_EMAIL  verified sender, e.g. "DLL website <website@forms.dailylivinglabs.com>"
 *
 * If any of them is missing, it answers 503 "not_configured" and the form
 * keeps showing its "not accepting messages yet" note.
 *
 * Setup and testing: see apps/landing/FORMS.md.
 */

export interface ContactEnv {
  RESEND_API_KEY?: string
  CONTACT_TO_EMAIL?: string
  CONTACT_FROM_EMAIL?: string
}

interface Deps {
  fetch: typeof fetch
  now: () => number
}

interface FieldRule {
  label: string
  max: number
  required?: boolean
  email?: boolean
}

type FormId = 'partner' | 'connect'

/** Field names match the `name` attributes in the site's forms. */
export const FORMS: Record<FormId, { title: string; subjectField: string; fields: Record<string, FieldRule> }> = {
  partner: {
    title: 'Partner form',
    subjectField: 'organization',
    fields: {
      organization: { label: 'Organization name', required: true, max: 200 },
      description: { label: 'Short description', max: 2000 },
      name: { label: 'Contact name', max: 120 },
      email: { label: 'Contact email', required: true, max: 254, email: true },
    },
  },
  connect: {
    title: 'Connect form',
    subjectField: 'name',
    fields: {
      name: { label: 'Name', required: true, max: 120 },
      email: { label: 'Email', required: true, max: 254, email: true },
      message: { label: 'Message', max: 5000 },
    },
  },
}

/** Submissions faster than this are treated as bots and silently dropped. */
export const MIN_FILL_MS = 3000
const MAX_BODY_CHARS = 20_000
const RESEND_URL = 'https://api.resend.com/emails'
const EMAIL_RE = /^[^\s@<>()",;:\\]+@[^\s@<>()",;:\\]+\.[^\s@<>()",;:\\]+$/

const json = (status: number, body: unknown, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers },
  })

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v)

/** Escape submitted text so it can't inject HTML into the email. */
export const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')

/** One line, no control characters, for the subject. */
const oneLine = (s: string, max = 120) => {
  const clean = s.replace(/[\u0000-\u001f\u007f]+/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > max ? `${clean.slice(0, max - 1)}…` : clean
}

export async function handleContact(
  request: Request,
  env: ContactEnv,
  deps: Deps = { fetch: (...args) => fetch(...args), now: Date.now },
): Promise<Response> {
  if (request.method !== 'POST') return json(405, { ok: false, code: 'method_not_allowed' }, { allow: 'POST' })

  // Not set up yet: the form keeps its "not accepting messages yet" note.
  const key = env.RESEND_API_KEY?.trim()
  const to = (env.CONTACT_TO_EMAIL ?? '').split(',').map((s) => s.trim()).filter(Boolean)
  const from = env.CONTACT_FROM_EMAIL?.trim()
  if (!key || !to.length || !from) return json(503, { ok: false, code: 'not_configured' })

  const raw = await request.text()
  if (raw.length > MAX_BODY_CHARS) return json(413, { ok: false, code: 'too_large' })
  let data: unknown
  try {
    data = JSON.parse(raw)
  } catch {
    return json(400, { ok: false, code: 'bad_request' })
  }
  if (!isRecord(data) || typeof data.form !== 'string' || !(data.form in FORMS)) {
    return json(400, { ok: false, code: 'bad_request' })
  }
  const form = FORMS[data.form as FormId]

  // Spam: a filled-in hidden field, or a form sent too fast. Answer "ok" so bots learn nothing.
  const honeypot = typeof data.website === 'string' ? data.website : ''
  const startedAt = typeof data.startedAt === 'number' ? data.startedAt : NaN
  const elapsed = deps.now() - startedAt
  if (honeypot.trim() !== '' || !Number.isFinite(elapsed) || elapsed < MIN_FILL_MS) {
    return json(200, { ok: true })
  }

  // Validate every field: required, valid email, length limits.
  const input = isRecord(data.fields) ? data.fields : {}
  const values: Record<string, string> = {}
  const errors: Record<string, string> = {}
  for (const [name, rule] of Object.entries(form.fields)) {
    const value = typeof input[name] === 'string' ? (input[name] as string).trim() : ''
    values[name] = value
    if (rule.required && !value) errors[name] = `Please enter your ${rule.label.toLowerCase()}.`
    else if (value.length > rule.max) errors[name] = `Please keep this under ${rule.max} characters.`
    else if (rule.email && value && !EMAIL_RE.test(value)) errors[name] = 'Please enter an email like name@example.com.'
  }
  if (Object.keys(errors).length) return json(400, { ok: false, code: 'invalid', errors })

  // Build the email: form name plus every field, escaped for HTML.
  const rows = Object.entries(form.fields).map(([name, rule]) => ({ label: rule.label, value: values[name] }))
  const subject = `[DLL website] ${form.title}: ${oneLine(values[form.subjectField])}`
  const text = [`${form.title} (dailylivinglabs.com)`, '', ...rows.map((r) => `${r.label}:\n${r.value || '(not provided)'}\n`)].join('\n')
  const html = [
    `<h2 style="font-family:sans-serif">${escapeHtml(form.title)}</h2>`,
    '<table style="font-family:sans-serif;border-collapse:collapse">',
    ...rows.map(
      (r) =>
        `<tr><th style="text-align:left;vertical-align:top;padding:6px 12px 6px 0">${escapeHtml(r.label)}</th>` +
        `<td style="padding:6px 0;white-space:pre-wrap">${r.value ? escapeHtml(r.value) : '<em>(not provided)</em>'}</td></tr>`,
    ),
    '</table>',
    '<p style="font-family:sans-serif;color:#555">Sent from the dailylivinglabs.com website. Reply to answer the sender.</p>',
  ].join('')

  // Reply-To is the visitor's validated email, so replying in Gmail goes to them.
  const replyTo = values.email
  let res: Response
  try {
    res = await deps.fetch(RESEND_URL, {
      method: 'POST',
      headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
      body: JSON.stringify({ from, to, reply_to: replyTo, subject, text, html }),
    })
  } catch (err) {
    console.error('[contact] Resend request failed', err)
    return json(502, { ok: false, code: 'send_failed' })
  }
  if (!res.ok) {
    // Log the reason for the team; never send Resend's details to the visitor.
    console.error('[contact] Resend rejected the email', res.status, await res.text().catch(() => ''))
    return json(502, { ok: false, code: 'send_failed' })
  }
  return json(200, { ok: true })
}

/** Vercel entry point (Web-standard handler). */
export function POST(request: Request) {
  return handleContact(request, process.env)
}
