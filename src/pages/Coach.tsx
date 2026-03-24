import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Send, ArrowLeft, Lock, Sparkles, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { chatWithCoach } from '../lib/ai'
import { deductCredits, COSTS } from '../lib/credits'
import { supabase } from '../lib/supabase'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function Coach() {
  const { profile, refreshProfile } = useAuth()
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hey! I'm your ViralLens Coach 🎯 I'm here to help you grow on TikTok, Reels, and Shorts. Ask me anything about hooks, scripting, trends, posting strategy, or why your content isn't hitting. What are you working on?",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const hasCredits = (profile?.credits ?? 0) >= COSTS.coach

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return
    if (!hasCredits) return

    const userMessage: Message = { role: 'user', content: input.trim() }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const success = await deductCredits(profile!.id, COSTS.coach, 'AI Coach message')
      if (!success) {
        setMessages([...newMessages, { role: 'assistant', content: "You're out of credits! Upgrade to keep chatting." }])
        setLoading(false)
        return
      }

      // Save user message
      const conversationId = messages.length <= 1 ? crypto.randomUUID() : undefined
      await supabase.from('coach_messages').insert({
        user_id: profile!.id,
        role: 'user',
        content: userMessage.content,
        credits_used: COSTS.coach,
      })

      // Call AI
      const aiResult = await chatWithCoach({
        messages: newMessages.map(m => ({ role: m.role, content: m.content })),
      })

      const assistantMessage: Message = {
        role: 'assistant',
        content: aiResult.response || aiResult.content || "I'm having trouble connecting right now. Try again in a moment!",
      }

      setMessages([...newMessages, assistantMessage])

      // Save assistant message
      await supabase.from('coach_messages').insert({
        user_id: profile!.id,
        role: 'assistant',
        content: assistantMessage.content,
        credits_used: 0,
      })

      await refreshProfile()
    } catch (err: any) {
      setMessages([
        ...newMessages,
        { role: 'assistant', content: 'Something went wrong. Please try again!' },
      ])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="min-h-screen pt-16 flex flex-col">
      {/* Header */}
      <div className="border-b border-white/5 bg-dark-950/80 backdrop-blur-xl px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="text-gray-500 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <h1 className="font-display font-semibold text-sm text-white">AI Coach</h1>
              <p className="text-xs text-gray-500">Your viral content mentor</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20">
            <span className="text-xs">🪙</span>
            <span className="text-xs font-medium text-violet-400">{profile?.credits ?? 0}</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-5">
          {messages.map((message, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center flex-shrink-0 mt-1">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              )}
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  message.role === 'user'
                    ? 'bg-violet-500 text-white rounded-br-md'
                    : 'bg-dark-800 text-gray-300 rounded-bl-md border border-white/5'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-dark-700 flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="w-4 h-4 text-gray-400" />
                </div>
              )}
            </motion.div>
          ))}

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="bg-dark-800 border border-white/5 px-4 py-3 rounded-2xl rounded-bl-md">
                <div className="flex gap-1">
                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0 }} className="w-2 h-2 rounded-full bg-violet-400" />
                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }} className="w-2 h-2 rounded-full bg-violet-400" />
                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }} className="w-2 h-2 rounded-full bg-violet-400" />
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-white/5 bg-dark-950/80 backdrop-blur-xl px-4 py-4">
        <div className="max-w-3xl mx-auto">
          {!hasCredits ? (
            <div className="flex items-center justify-center gap-2 py-3 rounded-xl bg-dark-800 border border-white/5 text-gray-500 text-sm">
              <Lock className="w-4 h-4" />
              Out of credits.
              <Link to="/settings" className="text-violet-400 hover:underline">Upgrade →</Link>
            </div>
          ) : (
            <div className="flex gap-3">
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask your coach anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                className="flex-1 px-4 py-3 rounded-xl bg-dark-800 border border-white/5 focus:border-violet-500/50 focus:outline-none text-white text-sm placeholder:text-gray-600 transition-colors disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="px-4 py-3 rounded-xl bg-violet-500 hover:bg-violet-600 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          )}
          <p className="text-xs text-gray-600 mt-2 text-center">1 credit per message • {profile?.credits ?? 0} credits remaining</p>
        </div>
      </div>
    </div>
  )
}
