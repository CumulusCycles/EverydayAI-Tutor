import { useState, useRef, useEffect } from 'react'

const CHAT_API_URL: string = import.meta.env.VITE_CHAT_API_URL ?? ''

interface Message {
  role: 'user' | 'assistant'
  content: string
  citations?: CitationSource[]
}

interface CitationSource {
  source: string
}

interface BedrockCitation {
  retrievedReferences?: Array<{
    location?: { s3Location?: { uri: string } }
  }>
}

interface ApiResponse {
  response: string
  citations?: BedrockCitation[]
}

function extractCitations(raw: BedrockCitation[]): CitationSource[] {
  const seen = new Set<string>()
  const results: CitationSource[] = []
  for (const c of raw) {
    for (const ref of c.retrievedReferences ?? []) {
      const uri = ref.location?.s3Location?.uri ?? ''
      const source = uri.split('/').pop()?.replace(/\.md$/, '') ?? ''
      if (source && !seen.has(source)) {
        seen.add(source)
        results.push({ source })
      }
    }
  }
  return results
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  async function sendMessage() {
    const text = input.trim()
    if (!text || isLoading) return

    setInput('')
    setError(null)
    setMessages((prev) => [...prev, { role: 'user', content: text }])
    setIsLoading(true)

    try {
      const res = await fetch(CHAT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const data: ApiResponse = await res.json()
      const citations = extractCitations(data.citations ?? [])

      setMessages((prev) => [...prev, { role: 'assistant', content: data.response, citations }])
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void sendMessage()
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat panel */}
      {isOpen && (
        <div
          className="w-[360px] bg-white rounded-2xl shadow-2xl border border-brand-gray flex flex-col overflow-hidden"
          style={{ height: '480px' }}
        >
          {/* Header */}
          <div className="bg-brand-navy px-4 py-3 flex items-center justify-between shrink-0">
            <div>
              <p className="text-white font-bold text-sm">EverydayAI Tutor</p>
              <p className="text-[#94a3b8] text-xs">Ask me about the channel</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="text-[#94a3b8] hover:text-white transition-colors p-1"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M1 1l12 12M13 1L1 13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
            {messages.length === 0 && (
              <p className="text-brand-slate text-sm text-center mt-8 leading-relaxed">
                Hi! Ask me about the EverydayAI Tutor channel, content, or its creator.
              </p>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`rounded-xl px-3 py-2 text-sm max-w-[85%] leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-brand-orange text-white'
                      : 'bg-brand-beige text-brand-charcoal'
                  }`}
                >
                  {msg.content}
                </div>
                {msg.citations && msg.citations.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5 max-w-[85%]">
                    {msg.citations.map((c) => (
                      <span
                        key={c.source}
                        className="text-[10px] bg-[#f1f5f9] text-brand-slate px-2 py-0.5 rounded-full"
                      >
                        {c.source}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start">
                <div className="bg-brand-beige rounded-xl px-3 py-2 text-sm text-brand-slate">
                  Thinking…
                </div>
              </div>
            )}
            {error && <p className="text-red-500 text-xs text-center">{error}</p>}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-brand-gray px-3 py-3 flex items-center gap-2 shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question…"
              disabled={isLoading}
              className="flex-1 text-sm text-brand-charcoal placeholder:text-brand-slate border border-brand-gray rounded-lg px-3 py-2 outline-none focus:border-brand-orange transition-colors disabled:opacity-50"
            />
            <button
              onClick={() => void sendMessage()}
              disabled={isLoading || !input.trim()}
              aria-label="Send message"
              className="w-9 h-9 rounded-lg bg-brand-orange flex items-center justify-center text-white hover:opacity-[0.88] transition-opacity disabled:opacity-40 shrink-0"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
        className="w-14 h-14 rounded-full bg-brand-orange text-white shadow-lg hover:opacity-[0.88] transition-opacity flex items-center justify-center shrink-0"
      >
        {isOpen ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M4 4l12 12M16 4L4 16" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
    </div>
  )
}
