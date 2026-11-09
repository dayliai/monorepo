import { useEffect, useRef, useState, type FormEvent } from 'react'
import { buttonClass } from '../ui/Button'

export interface Field {
  id: string
  /** Field name sent to the form service */
  name: string
  label: string
  type?: 'text' | 'email' | 'textarea'
  autoComplete?: string
  required?: boolean
  placeholder?: string
}

interface SimpleFormProps {
  fields: Field[]
  submitLabel?: string
  /** Show "(required)" after required field labels */
  markRequired?: boolean
}

const NOT_READY = "Thanks for your interest! Our form isn't accepting messages yet. Please check back soon."

const inputCls =
  'w-full px-[.8em] py-[.65em] rounded-[10px] border-2 border-dll-field-border bg-dll-card text-dll-ink placeholder:text-dll-muted aria-[invalid=true]:border-[3px] aria-[invalid=true]:!border-dll-err'

/** Same messages as the prototype's validate(). */
function errorFor(field: Field, value: string, el: HTMLInputElement | HTMLTextAreaElement | null) {
  if (field.required && !value.trim()) return `Please enter your ${field.label.toLowerCase()}.`
  if (field.type === 'email' && value && el && !el.checkValidity()) return 'Please enter an email like name@example.com.'
  return ''
}

/**
 * Accessible form from the prototype: errors are written in text under each
 * field (not color alone), linked with aria-describedby, and focus moves to
 * the first field that needs fixing. On success, a status message replaces
 * the form and receives focus.
 */
export default function SimpleForm({ fields, submitLabel = 'Send', markRequired }: SimpleFormProps) {
  const [values, setValues] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [attempt, setAttempt] = useState(0)
  const [done, setDone] = useState(false)
  const refs = useRef<Record<string, HTMLInputElement | HTMLTextAreaElement | null>>({})
  const okRef = useRef<HTMLDivElement>(null)

  // After a failed submit has rendered its messages, move focus to the first problem.
  useEffect(() => {
    if (!attempt) return
    const first = fields.find((f) => errors[f.id])
    if (first) refs.current[first.id]?.focus()
  }, [attempt])

  useEffect(() => {
    if (done) okRef.current?.focus()
  }, [done])

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const next: Record<string, string> = {}
    for (const f of fields) {
      const msg = errorFor(f, values[f.id] ?? '', refs.current[f.id])
      if (msg) next[f.id] = msg
    }
    setErrors(next)
    if (Object.keys(next).length) {
      setAttempt((n) => n + 1)
      return
    }
    // No form service yet: show the "not accepting messages yet" note, as in the prototype.
    // When a Formspree ID is ready, send `values` to https://formspree.io/f/<id> here.
    setDone(true)
  }

  if (done) {
    return (
      <div ref={okRef} role="status" tabIndex={-1} className="bg-dll-mint text-dll-ink rounded-[14px] px-5 py-[18px] font-semibold outline-none">
        {NOT_READY}
      </div>
    )
  }

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
      <div>
        <button type="submit" className={buttonClass('primary')}>
          {submitLabel}
        </button>
      </div>
    </form>
  )
}
