import { useEffect, useRef, useState, type FormEvent } from 'react'
import { buttonClass } from '../ui/Button'
import { contactEmail } from '../../data/site'

export interface Field {
  id: string
  /** Field name sent to the server (must match api/contact.ts) */
  name: string
  label: string
  type?: 'text' | 'email' | 'textarea'
  autoComplete?: string
  required?: boolean
  placeholder?: string
}

interface SimpleFormProps {
  /** Which form this is, for the server and the email subject */
  formId: 'partner' | 'connect'
  fields: Field[]
  submitLabel?: string
  /** Show "(required)" after required field labels */
  markRequired?: boolean
}

type Status = 'idle' | 'sending' | 'error' | 'sent' | 'not_ready'

const NOT_READY = "Thanks for your interest! Our form isn't accepting messages yet. Please check back soon."
const SENT = "Thanks! Your message has been sent. The Daily Living Labs team will get back to you soon."

const inputCls =
  'w-full px-[.8em] py-[.65em] rounded-[10px] border-2 border-dll-field-border bg-dll-card text-dll-ink placeholder:text-dll-muted aria-[invalid=true]:border-[3px] aria-[invalid=true]:!border-dll-err'

/** Same messages as the prototype's validate(). */
function errorFor(field: Field, value: string, el: HTMLInputElement | HTMLTextAreaElement | null) {
  if (field.required && !value.trim()) return `Please enter your ${field.label.toLowerCase()}.`
  if (field.type === 'email' && value && el && !el.checkValidity()) return 'Please enter an email like name@example.com.'
  return ''
}

/**
 * Accessible form from the prototype, sending to /api/contact.
 * - Field errors are written in text under each field, linked with
 *   aria-describedby, and focus moves to the first field that needs fixing.
 * - While sending, the button says "Sending…" (also announced) and ignores clicks.
 * - Success (only after the email is accepted) or "not accepting messages
 *   yet" replaces the form and receives focus.
 * - If sending fails, an error message is announced and everything typed is kept.
 */
export default function SimpleForm({ formId, fields, submitLabel = 'Send', markRequired }: SimpleFormProps) {
  const [values, setValues] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [attempt, setAttempt] = useState(0)
  const [status, setStatus] = useState<Status>('idle')
  const refs = useRef<Record<string, HTMLInputElement | HTMLTextAreaElement | null>>({})
  const doneRef = useRef<HTMLDivElement>(null)
  const startedAt = useRef(Date.now())
  const honeypot = useRef<HTMLInputElement>(null)

  // After a failed submit has rendered its messages, move focus to the first problem.
  useEffect(() => {
    if (!attempt) return
    const first = fields.find((f) => errors[f.id])
    if (first) refs.current[first.id]?.focus()
  }, [attempt])

  useEffect(() => {
    if (status === 'sent' || status === 'not_ready') doneRef.current?.focus()
  }, [status])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (status === 'sending') return

    const next: Record<string, string> = {}
    for (const f of fields) {
      const msg = errorFor(f, values[f.id] ?? '', refs.current[f.id])
      if (msg) next[f.id] = msg
    }
    setErrors(next)
    if (Object.keys(next).length) {
      setStatus('idle')
      setAttempt((n) => n + 1)
      return
    }

    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          form: formId,
          website: honeypot.current?.value ?? '',
          startedAt: startedAt.current,
          fields: Object.fromEntries(fields.map((f) => [f.name, values[f.id] ?? ''])),
        }),
      })
      // No function here yet (404) or not set up (503): keep today's note.
      if (res.status === 404 || res.status === 503) return setStatus('not_ready')
      const body = await res.json().catch(() => null)
      if (res.ok && body?.ok) return setStatus('sent')
      if (res.status === 400 && body?.code === 'invalid' && body.errors) {
        // Show the server's messages under the matching fields.
        const serverErrors: Record<string, string> = {}
        for (const f of fields) if (body.errors[f.name]) serverErrors[f.id] = body.errors[f.name]
        if (Object.keys(serverErrors).length) {
          setErrors(serverErrors)
          setStatus('idle')
          setAttempt((n) => n + 1)
          return
        }
      }
      setStatus('error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent' || status === 'not_ready') {
    return (
      <div
        ref={doneRef}
        role="status"
        tabIndex={-1}
        className="bg-dll-mint text-dll-ink rounded-[14px] px-5 py-[18px] font-semibold outline-none"
      >
        {status === 'sent' ? SENT : NOT_READY}
      </div>
    )
  }

  const sending = status === 'sending'

  return (
    <form noValidate onSubmit={onSubmit} className="grid gap-4">
      {fields.map((f) => {
        const err = errors[f.id]
        const errId = `${f.id}-err`
        const common = {
          id: f.id,
          name: f.name,
          autoComplete: f.autoComplete,
          required: f.required,
          placeholder: f.placeholder,
          value: values[f.id] ?? '',
          'aria-invalid': err ? true : undefined,
          'aria-describedby': err ? errId : undefined,
          className: inputCls,
        }
        return (
          <div key={f.id}>
            <label htmlFor={f.id} className="block font-bold mb-1">
              {f.label}
              {markRequired && f.required && (
                // Screen readers already hear "required" from the field itself
                <span aria-hidden="true" className="font-normal text-dll-muted"> (required)</span>
              )}
            </label>
            {f.type === 'textarea' ? (
              <textarea
                {...common}
                ref={(el) => (refs.current[f.id] = el)}
                onChange={(e) => setValues((v) => ({ ...v, [f.id]: e.target.value }))}
                className={`${inputCls} min-h-[110px]`}
              />
            ) : (
              <input
                {...common}
                type={f.type ?? 'text'}
                ref={(el) => (refs.current[f.id] = el)}
                onChange={(e) => setValues((v) => ({ ...v, [f.id]: e.target.value }))}
              />
            )}
            {err && (
              <p id={errId} className="text-dll-err font-bold text-[.92rem] mt-[6px] mb-0">
                <span aria-hidden="true">⚠ </span>Error: {err}
              </p>
            )}
          </div>
        )
      })}

      {/* Spam trap: hidden from people and screen readers; bots tend to fill it in. */}
      <div aria-hidden="true" className="absolute -left-[10000px] w-px h-px overflow-hidden">
        <label htmlFor={`${formId}-website`}>Leave this field empty</label>
        <input ref={honeypot} id={`${formId}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      {status === 'error' && (
        <p role="alert" className="text-dll-err font-bold m-0">
          <span aria-hidden="true">⚠ </span>Error: Your message couldn't be sent. Please try again, or email us at{' '}
          <a href={`mailto:${contactEmail}`} className="text-dll-err">
            {contactEmail}
          </a>
          .
        </p>
      )}

      <div>
        <button
          type="submit"
          aria-disabled={sending || undefined}
          className={buttonClass('primary', 'md', 'aria-disabled:opacity-80 aria-disabled:cursor-progress')}
        >
          {sending ? 'Sending…' : submitLabel}
        </button>
      </div>
      {/* Announces "Sending…" to screen readers */}
      <p role="status" className="sr-only">
        {sending ? 'Sending…' : ''}
      </p>
    </form>
  )
}
