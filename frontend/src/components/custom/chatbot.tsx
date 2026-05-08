import { useState, useRef, useEffect, useCallback } from 'react'
import { MessageCircle, X, Send, ChevronDown } from 'lucide-react'

interface GeminiContent {
    role: 'user' | 'model'
    parts: { text: string }[]
}

interface DisplayMessage {
    role: 'user' | 'assistant'
    content: string
}

type Phase = 'idle' | 'checking' | 'disabled' | 'ready' | 'error'

const GREETING = "Hi! I'm Erik's portfolio assistant. Ask me anything about his work or background."

function updateLast(msgs: DisplayMessage[], content: string): DisplayMessage[] {
    const updated = [...msgs]
    updated[updated.length - 1] = { ...updated[updated.length - 1], content }
    return updated
}

export function Chatbot() {
    const [isOpen, setIsOpen] = useState(false)
    const [phase, setPhase] = useState<Phase>('idle')
    const [displayMessages, setDisplayMessages] = useState<DisplayMessage[]>([
        { role: 'assistant', content: GREETING }
    ])
    const [input, setInput] = useState('')
    const [isGenerating, setIsGenerating] = useState(false)

    const historyRef = useRef<GeminiContent[]>([])
    const hasCheckedRef = useRef(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [displayMessages])

    const checkConfig = useCallback(async () => {
        if (hasCheckedRef.current) return
        hasCheckedRef.current = true
        setPhase('checking')
        try {
            const res = await fetch('/config.json', { cache: 'no-cache' })
            const { chatEnabled } = await res.json()
            setPhase(chatEnabled ? 'ready' : 'disabled')
            if (chatEnabled) setTimeout(() => inputRef.current?.focus(), 50)
        } catch {
            setPhase('ready')
            setTimeout(() => inputRef.current?.focus(), 50)
        }
    }, [])

    const handleOpen = () => {
        setIsOpen(true)
        if (phase === 'idle') checkConfig()
    }

    const sendMessage = async () => {
        const userMsg = input.trim()
        if (!userMsg || isGenerating) return

        setInput('')
        setIsGenerating(true)
        setDisplayMessages(prev => [
            ...prev,
            { role: 'user', content: userMsg },
            { role: 'assistant', content: '' },
        ])

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg, history: historyRef.current }),
            })

            if (res.status === 429) {
                setDisplayMessages(prev => updateLast(prev, "I've hit my daily limit. Try again tomorrow!"))
                return
            }

            if (!res.ok) {
                setDisplayMessages(prev => updateLast(prev, 'Something went wrong. Please try again.'))
                return
            }

            const { reply } = await res.json()
            historyRef.current = [
                ...historyRef.current,
                { role: 'user', parts: [{ text: userMsg }] },
                { role: 'model', parts: [{ text: reply }] },
            ]
            setDisplayMessages(prev => updateLast(prev, reply))
        } catch {
            setDisplayMessages(prev => updateLast(prev, 'Something went wrong. Please try again.'))
        } finally {
            setIsGenerating(false)
            setTimeout(() => inputRef.current?.focus(), 50)
        }
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
            {isOpen && (
                <div className="w-[360px] h-[520px] flex flex-col rounded-2xl border border-white/10 bg-black/85 backdrop-blur-md shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-200">

                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5 shrink-0">
                        <div className="flex items-center gap-2">
                            <span className="text-base">👾</span>
                            <span className="text-white text-sm font-semibold">Erik's Assistant</span>
                            {phase === 'ready' && <span className="w-1.5 h-1.5 rounded-full bg-green-400" />}
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white/40 hover:text-white transition-colors"
                        >
                            <ChevronDown size={18} />
                        </button>
                    </div>

                    <div className="flex-1 flex flex-col overflow-hidden">
                        {phase === 'checking' && (
                            <div className="flex-1 flex items-center justify-center">
                                <p className="text-white/40 text-sm animate-pulse">Connecting...</p>
                            </div>
                        )}

                        {phase === 'disabled' && (
                            <div className="flex-1 flex flex-col items-center justify-center gap-3 px-8 text-center">
                                <span className="text-4xl">🛸</span>
                                <p className="text-white/60 text-sm leading-relaxed">
                                    The AI assistant is temporarily unavailable. Check back soon!
                                </p>
                            </div>
                        )}

                        {phase === 'error' && (
                            <div className="flex-1 flex flex-col items-center justify-center gap-3 px-8 text-center">
                                <p className="text-red-400 text-sm font-medium">Something went wrong</p>
                                <button
                                    onClick={() => { hasCheckedRef.current = false; checkConfig() }}
                                    className="text-purple-400 text-xs hover:text-purple-300 transition-colors"
                                >
                                    Try again
                                </button>
                            </div>
                        )}

                        {phase === 'ready' && (
                            <>
                                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                                    {displayMessages.map((msg, i) => (
                                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[82%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                                                msg.role === 'user'
                                                    ? 'bg-purple-600 text-white rounded-br-sm'
                                                    : 'bg-white/10 text-white/80 rounded-bl-sm'
                                            }`}>
                                                {msg.content || (
                                                    <span className="inline-flex gap-1 items-center">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce [animation-delay:0ms]" />
                                                        <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce [animation-delay:150ms]" />
                                                        <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce [animation-delay:300ms]" />
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>

                                <div className="px-3 pb-3 shrink-0">
                                    <div className="flex gap-2 items-end border border-white/10 rounded-xl bg-white/5 px-3 py-2">
                                        <textarea
                                            ref={inputRef}
                                            value={input}
                                            onChange={e => setInput(e.target.value)}
                                            onKeyDown={e => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault()
                                                    sendMessage()
                                                }
                                            }}
                                            placeholder="Ask me anything..."
                                            rows={1}
                                            className="flex-1 bg-transparent text-white text-sm placeholder-white/30 resize-none outline-none leading-relaxed"
                                        />
                                        <button
                                            onClick={sendMessage}
                                            disabled={!input.trim() || isGenerating}
                                            className="text-purple-400 hover:text-purple-300 disabled:opacity-30 transition-colors shrink-0 pb-0.5"
                                        >
                                            <Send size={16} />
                                        </button>
                                    </div>
                                    <p className="text-white/20 text-[10px] text-center mt-1.5">Powered by Gemini · free tier</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            <button
                onClick={isOpen ? () => setIsOpen(false) : handleOpen}
                className="w-14 h-14 rounded-full bg-purple-600 hover:bg-purple-500 shadow-lg hover:shadow-purple-500/30 transition-all duration-200 flex items-center justify-center"
                aria-label={isOpen ? 'Close chat' : 'Open chat'}
            >
                {isOpen
                    ? <X size={22} className="text-white" />
                    : <MessageCircle size={22} className="text-white" />
                }
            </button>
        </div>
    )
}
