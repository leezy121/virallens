import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link2, Search, Sparkles, Clock, Target, Lightbulb, ArrowLeft, Lock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { decodeVideo } from '../lib/ai'
import { deductCredits, COSTS } from '../lib/credits'
import { supabase } from '../lib/supabase'

interface DecodeResult {
  hook: string
  scriptStructure: string
  whyViral: string
  keyTakeaways: string[]
}

export default function Decode() {
  const { profile, refreshProfile } = useAuth()
  const [viralLink, setViralLink] = useState('')
  const [viralScript, setViralScript] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<DecodeResult | null>(null)
  const [error, setError] = useState('')

  const hasCredits = (profile?.credits ?? 0) >= COSTS.decode

  const handleDecode = async () => {
    if (!viralLink.trim()) {
      setError('Please paste a video link')
      return
    }
    if (!viralScript.trim()) {
      setError('Please paste or describe the video script/caption')
      return
    }
    if (!hasCredits) {
      setError('Not enough credits. Please upgrade or buy more.')
      return
    }

    setError('')
    setLoading(true)
    setResult(null)

    try {
      // Deduct credits
      const success = await deductCredits(profile!.id, COSTS.decode, 'Viral video decode')
      if (!success) {
        setError('Not enough credits')
        setLoading(false)
        return
      }

      // Call AI
      const aiResult = await decodeVideo({ viralLink, viralScript })

      // Save analysis
      await supabase.from('analyses').insert({
        user_id: profile!.id,
        type: 'decode',
        viral_link: viralLink,
        viral_script: viralScript,
        ai_result: aiResult,
        credits_used: COSTS.decode,
      })

      setResult(aiResult)
      await refreshProfile()
    } catch (err: any) {
      setError(err.message || 'Analysis failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const resultCards = result ? [
    { icon: <Clock className="w-5 h-5" />, title: 'The Hook (First 3 Seconds)', content: result.hook, color: 'violet' },
    { icon: <Target className="w-5 h-5" />, title: 'Script Structure', content: result.scriptStructure, color: 'coral' },
    { icon: <Sparkles className="w-5 h-5" />, title: 'Why It Went Viral', content: result.whyViral, color: 'cyan' },
  ] : []

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-white transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400">
              <Link2 className="w-5 h-5" />
            </div>
            <h1 className="font-display font-bold text-2xl md:text-3xl text-white">Viral Decoder</h1>
          </div>
          <p className="text-gray-400 text-sm">Paste a viral video link and its script. AI will break down exactly why it blew up.</p>
        </motion.div>

        {/* Input Section */}
        {!result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 md:p-8 mb-6"
          >
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Viral Video Link</label>
                <div className="relative">
                  <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="url"
                    placeholder="https://tiktok.com/... or https://instagram.com/reel/..."
                    value={viralLink}
                    onChange={(e) => setViralLink(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-dark-800 border border-white/5 focus:border-violet-500/50 focus:outline-none text-white text-sm placeholder:text-gray-600 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Video Script / Caption</label>
                <textarea
                  placeholder="Paste the video's caption, script, or describe what happens in the video..."
                  value={viralScript}
                  onChange={(e) => setViralScript(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl bg-dark-800 border border-white/5 focus:border-violet-500/50 focus:outline-none text-white text-sm placeholder:text-gray-600 transition-colors resize-none"
                />
              </div>

              {error && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-coral-500 bg-coral-500/10 px-4 py-2 rounded-lg">
                  {error}
                </motion.p>
              )}

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Cost: {COSTS.decode} credits • You have {profile?.credits ?? 0}</span>
                <button
                  onClick={handleDecode}
                  disabled={loading || !hasCredits}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-500 hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-display font-medium transition-colors btn-shimmer"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : !hasCredits ? (
                    <><Lock className="w-4 h-4" /> No Credits</>
                  ) : (
                    <><Search className="w-4 h-4" /> Decode</>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass-card p-12 text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-500 to-coral-500 flex items-center justify-center"
              >
                <Sparkles className="w-8 h-8 text-white" />
              </motion.div>
              <p className="font-display font-semibold text-white text-lg mb-2">Analyzing viral patterns...</p>
              <p className="text-sm text-gray-500">Breaking down hooks, structure, and virality signals</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-5"
            >
              {resultCards.map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                  className="glass-card p-6"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`${
                      card.color === 'violet' ? 'text-violet-400' :
                      card.color === 'coral' ? 'text-coral-400' :
                      'text-cyan-400'
                    }`}>{card.icon}</span>
                    <h3 className="font-display font-semibold text-white">{card.title}</h3>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{card.content}</p>
                </motion.div>
              ))}

              {/* Key Takeaways */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="glass-card p-6"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-5 h-5 text-yellow-400" />
                  <h3 className="font-display font-semibold text-white">Key Takeaways</h3>
                </div>
                <ul className="space-y-2">
                  {result.keyTakeaways.map((t, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="text-violet-400 mt-0.5">•</span>
                      {t}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => { setResult(null); setViralLink(''); setViralScript('') }}
                  className="px-5 py-2.5 rounded-xl bg-dark-700 hover:bg-dark-600 text-sm text-gray-300 transition-colors"
                >
                  New Analysis
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
