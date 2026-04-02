import { useState, useRef, useEffect } from 'react'
import { SUBMISSION_SYSTEM_PROMPT, REQUEST_SYSTEM_PROMPT } from '@dayli/supabase'
import type { ChatMessage } from '@dayli/supabase'
import { supabase } from '../lib/supabase'

interface AgentChatProps {
  mode: 'submission' | 'request'
  adlCategory?: string
  onClose: () => void
  fullPage?: boolean
}

export default function AgentChat({ mode, adlCategory, onClose, fullPage = false }: AgentChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const systemPrompt = mode === 'submission' ? SUBMISSION_SYSTEM_PROMPT : REQUEST_SYSTEM_PROMPT

  const initialGreeting = mode === 'submission'
    ? `Hi there! I'd love to hear about a solution you've found for ${adlCategory || 'daily living'} challenges. What's something that's made a real difference for you?`
    : `Hi! I'm here to listen and understand a ${adlCategory || 'daily living'} challenge you're facing. Take your time — what's been difficult for you?`

  useEffect(() => {
    setMessages([{ role: 'assistant', content: initialGreeting }])
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const uploadPhoto = async (file: File): Promise<string | null> => {
    const ext = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const path = `uploads/${fileName}`

    const { error } = await supabase.storage.from('agent-uploads').upload(path, file)
    if (error) {
      console.error('Upload failed:', error)
      return null
    }

    const { data } = supabase.storage.from('agent-uploads').getPublicUrl(path)
    return data.publicUrl
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return

    setIsUploading(true)
    const urls: string[] = []

    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue
      const url = await uploadPhoto(file)
      if (url) urls.push(url)
    }

    if (urls.length > 0) {
      setUploadedPhotos(prev => [...prev, ...urls])
      const photoMsg: ChatMessage = {
        role: 'user',
        content: `[Shared ${urls.length} photo${urls.length > 1 ? 's' : ''}]`,
      }
      setMessages(prev => [...prev, photoMsg])
    }

    setIsUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const parseStructuredData = (text: string) => {
    const submissionMatch = text.match(/<submission>([\s\S]*?)<\/submission>/)
    if (submissionMatch) {
      try { return { type: 'submission' as const, data: JSON.parse(submissionMatch[1]) } }
      catch { return null }
    }
    const requestMatch = text.match(/<request>([\s\S]*?)<\/request>/)
    if (requestMatch) {
      try { return { type: 'request' as const, data: JSON.parse(requestMatch[1]) } }
      catch { return null }
    }
    return null
  }

  const saveToSupabase = async (parsed: { type: 'submission' | 'request'; data: Record<string, unknown> }, conversationLog: ChatMessage[]) => {
    try {
      if (parsed.type === 'submission') {
        const { error } = await supabase.from('community_submissions').insert({
          adl_category: parsed.data.adl_category as string,
          title: parsed.data.title as string,
          description: parsed.data.description as string,
          what_made_it_work: (parsed.data.what_made_it_work as string) || null,
          person_name: parsed.data.person_name as string,
          email: (parsed.data.email as string) || null,
          notify_on_publish: (parsed.data.notify_on_publish as boolean) || false,
          conversation_log: conversationLog,
          status: 'pending',
          website_url: (parsed.data.website_url as string) || null,
          pricing: (parsed.data.pricing as string) || null,
          contact_name: (parsed.data.contact_name as string) || null,
          contact_email: (parsed.data.contact_email as string) || null,
          contact_phone: (parsed.data.contact_phone as string) || null,
          photos: uploadedPhotos,
          tags: (parsed.data.tags as string[]) || [],
        })
        if (error) throw error
      } else {
        const { error } = await supabase.from('community_requests').insert({
          adl_category: parsed.data.adl_category as string,
          challenge_description: parsed.data.challenge_description as string,
          what_tried: (parsed.data.what_tried as string) || null,
          person_name: parsed.data.person_name as string,
          email: (parsed.data.email as string) || null,
          notify_on_solution: (parsed.data.notify_on_solution as boolean) || false,
          conversation_log: conversationLog,
          status: 'pending',
          condition_context: (parsed.data.condition_context as string) || null,
          daily_impact: (parsed.data.daily_impact as string) || null,
          environment: (parsed.data.environment as string) || null,
          contact_name: (parsed.data.contact_name as string) || null,
          contact_email: (parsed.data.contact_email as string) || null,
          contact_phone: (parsed.data.contact_phone as string) || null,
          photos: uploadedPhotos,
          urgency: (parsed.data.urgency as string) || null,
        })
        if (error) throw error
      }

      const email = (parsed.data.contact_email || parsed.data.email) as string
      const shouldNotify = parsed.type === 'submission'
        ? parsed.data.notify_on_publish
        : parsed.data.notify_on_solution
      if (shouldNotify && email) {
        await supabase.from('contacts').upsert(
          { email, name: (parsed.data.contact_name || parsed.data.person_name) as string, source: parsed.type },
          { onConflict: 'email' }
        )
      }

      setSuccess(true)
    } catch (err) {
      console.error('Failed to save:', err)
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || isThinking) return

    const userMessage: ChatMessage = { role: 'user', content: input.trim() }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setIsThinking(true)
    setError(null)

    try {
      const apiMessages = newMessages.filter((_, i) => i > 0)

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            messages: apiMessages,
            system: systemPrompt,
            agentType: mode,
          }),
        }
      )

      const data = await response.json()
      if (data.error) throw new Error(data.error)

      const assistantMessage: ChatMessage = { role: 'assistant', content: data.message }
      const updatedMessages = [...newMessages, assistantMessage]
      setMessages(updatedMessages)

      const parsed = parseStructuredData(data.message)
      if (parsed) {
        await saveToSupabase(parsed, updatedMessages)
      }
    } catch (err) {
      setError((err as Error).message || 'Something went wrong. Please try again.')
    } finally {
      setIsThinking(false)
    }
  }

  const stripXml = (text: string) => {
    return text
      .replace(/<submission>[\s\S]*?<\/submission>/g, '')
      .replace(/<request>[\s\S]*?<\/request>/g, '')
      .trim()
  }

  const containerHeight = fullPage ? 'h-[calc(100vh-12rem)]' : 'h-[400px]'

  if (success) {
    return (
      <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${fullPage ? 'min-h-[60vh]' : ''}`}>
        <div className="w-16 h-16 rounded-full bg-dayli-vibrant/10 flex items-center justify-center mb-6">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9230E3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="font-heading text-2xl font-bold text-dayli-deep mb-2">
          Thank you!
        </h3>
        <p className="font-body text-dayli-deep/70 mb-6 max-w-md">
          {mode === 'submission'
            ? 'We\'ve received your solution. Our team will review it and add it to the community database.'
            : 'We\'ve received your challenge. Our problem-solving team will get to work on finding solutions for you.'}
        </p>
        <button
          onClick={onClose}
          className="bg-dayli-vibrant text-white px-6 py-2.5 rounded-full font-semibold hover:bg-dayli-vibrant/90 transition-colors"
        >
          {fullPage ? 'Back to Contribute' : 'Close'}
        </button>
      </div>
    )
  }

  return (
    <div className={`flex flex-col ${containerHeight}`}>
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-4 py-2.5 rounded-2xl font-body text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-dayli-vibrant text-white rounded-br-md'
                  : 'bg-dayli-pale text-dayli-deep rounded-bl-md'
              }`}
            >
              {msg.content.startsWith('[Shared') ? (
                <span className="italic opacity-80">{msg.content}</span>
              ) : (
                stripXml(msg.content)
              )}
            </div>
          </div>
        ))}

        {uploadedPhotos.length > 0 && (
          <div className="flex gap-2 flex-wrap px-2">
            {uploadedPhotos.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`Upload ${i + 1}`}
                className="w-16 h-16 object-cover rounded-lg border border-dayli-pale"
              />
            ))}
          </div>
        )}

        {isThinking && (
          <div className="flex justify-start">
            <div className="bg-dayli-pale px-4 py-3 rounded-2xl rounded-bl-md">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-dayli-vibrant/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-dayli-vibrant/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-dayli-vibrant/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div className="px-4 py-2 bg-red-50 border-t border-dayli-error/20">
          <p className="text-dayli-error text-sm font-body">{error}</p>
          <button
            onClick={sendMessage}
            className="text-dayli-vibrant text-sm font-semibold mt-1 hover:underline"
          >
            Retry
          </button>
        </div>
      )}

      <div className="border-t border-dayli-pale p-3 flex gap-2 items-center">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="text-dayli-deep/50 hover:text-dayli-vibrant transition-colors disabled:opacity-50 p-2"
          title="Attach photos"
        >
          {isUploading ? (
            <svg width="20" height="20" viewBox="0 0 24 24" className="animate-spin" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="12" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          )}
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2.5 rounded-full bg-dayli-bg border border-dayli-pale focus:border-dayli-vibrant focus:outline-none font-body text-sm text-dayli-deep placeholder:text-dayli-deep/40"
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || isThinking}
          className="bg-dayli-vibrant text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-dayli-vibrant/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 2L11 13" /><path d="M22 2L15 22L11 13L2 9L22 2Z" />
          </svg>
        </button>
      </div>
    </div>
  )
}
