import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Link2, ArrowLeft, Search, Lock, Sparkles, Target, AlertTriangle, CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { diagnoseFlop } from '../lib/ai'
import { deductCredits, COSTS } from '../lib/credits'
import { supabase } from '../lib/supabase'

interface DiagnoseResult {
  hookComparison: { viral: string; yours: string }
  structureComparison: { viral: string; yours: string }
  captionComparison: { viral: string; yours: string }
  verdict: string
  actionPlan: string[]
}

export default function Diagnose() {
  const { profile, refreshProfile } = useAuth()
  const [viralLink, setViralLink] = useState('')
  const [viralScript, setViralScript] = useState('')
  const [userLink, setUserLink] = useState('')
  const [userScript, setUserScript] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<DiagnoseResult | null>(null)
  const [error, setError] = useState('')

  const hasCredits = (profile?.credits ?? 0) >= COSTS.diagnose

  const handleDiagnose = async () => {
    if (!viralLink.trim() || !viralScript.trim() || !userLink.trim() || !userScript.trim()) {
      setError('Please fill in all fields for both videos')
      return
    }
    if (!hasCredits) {
      setError('Not enough credits')
      return
    }

    setError('')
    setLoading(true)
    setResult(null)

    try {
      const success = await deductCredits(profile!.id, COSTS.diagnose, 'Flop diagnosis')
      if (!success) {
        setError('Not enough credits')
        setLoading(false)
        return
      }

      const aiResult = await diagnoseFlop({ viralLink, viralScript, userLink, userScript })

      await supabase.from('analyses').insert({
        user_id: profile!.id,
        type: 'diagnose',
        viral_link: viralLink,
        viral_script: viralScript,
        user_link: userLink,
        user_script: userScript,
        ai_result: aiResult,
        credits_used: COSTS.diagnose,
      })

      setResult(aiResult)
      await refreshProfile()
    } catch (err: any) {
      setError(err.message || 'Diagnosis failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const comparisons = result ? [
    { title: 'Hook', viral: result.hookComparison.viral, yours: result.hookComparison.yours },
    { title: 'Structure', viral: result.structureComparison.viral, yours: result.structureComparison.yours },
    { title: 'Caption & Hashtags', viral: result.captionComparison.viral, yours: result.captionComparison.yours },
  ] : []

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-white transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-coral-500/10 flex items-center justify-center text-coral-400">
              <Zap className="w-5 h-5" />
            </div>
            <h1 className="font-display font-bold text-2xl md:text-3xl text-white">Flop Diagnosis</h1>
          </div>
          <p className="text-gray-400 text-sm">Compare a viral video with your version. AI tells you exactly why yours underperformed.</p>
        </motion.div>

        {/* Input Section */}
        {!result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="grid md:grid-cols-2 gap-5 mb-6">
              {/* Viral Original */}
              <div className="glass-card p-6" style={{ borderColor: 'rgba(139, 92, 246, 0.2)' }}>
                <h3 className="font-display font-semibold text-violet-400 mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> The Viral Original
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5">Video Link</label>
                    <div className="relative">
                      <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                      <input
                        type="url"
                        placeholder="Paste viral video link..."
                        value={viralLink}
                        onChange={(e) => setViralLink(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-dark-800 border border-white/5 focus:border-violet-500/50 focus:outline-none text-white text-sm placeholder:text-gray-600 transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5">Script / Caption</label>
                    <textarea
                      placeholder="Paste caption or describe the video..."
                      value={viralScript}
                      onChange={(e) => setViralScript(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2.5 rounded-lg bg-dark-800 border border-white/5 focus:border-violet-500/50 focus:outline-none text-white text-sm placeholder:text-gray-600 transition-colors resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Your Version */}
              <div className="glass-card p-6" style={{ borderColor: 'rgba(255, 107, 107, 0.2)' }}>
                <h3 className="font-display font-semibold text-coral-400 mb-4 flex items-center gap-2">
                  <Target className="w-4 h-4" /> Your Version
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5">Video Link</label>
                    <div className="relative">
                      <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                      <input
                        type="url"
                        placeholder="Paste your video link..."
                        value={userLink}
                        onChange={(e) => setUserLink(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-dark-800 border border-white/5 focus:border-coral-500/50 focus:outline-none text-white text-sm placeholder:text-gray-600 transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5">Script / Caption</label>
                    <textarea
                      placeholder="Paste your caption or describe your video..."
                      value={userScript}
                      onChange={(e) => setUserScript(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2.5 rounded-lg bg-dark-800 border border-white/5 focus:border-coral-500/50 focus:outline-none text-white text-sm placeholder:text-gray-600 transition-colors resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-coral-500 bg-coral-500/10 px-4 py-2 rounded-lg mb-4">
                {error}
              </motion.p>
            )}

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Cost: {COSTS.diagnose} credits • You have {profile?.credits ?? 0}</span>
              <button
                onClick={handleDiagnose}
                disabled={loading || !hasCredits}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-coral-500 hover:from-violet-600 hover:to-coral-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-display font-medium transition-all btn-shimmer"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : !hasCredits ? (
                  <><Lock className="w-4 h-4" /> No Credits</>
                ) : (
                  <><Zap className="w-4 h-4" /> Compare & Diagnose</>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* Loading */}
        <AnimatePresence>
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass-card p-12 text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-500 to-coral-500 flex items-center justify-center"
              >
                <Zap className="w-8 h-8 text-white" />
              </motion.div>
              <p className="font-display font-semibold text-white text-lg mb-2">Diagnosing your content...</p>
              <p className="text-sm text-gray-500">Comparing hooks, pacing, structure, and engagement signals</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
              {/* Comparisons */}
              {comparisons.map((comp, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-6"
                >
                  <h3 className="font-display font-semibold text-white mb-4">{comp.title}</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-violet-500/5 border border-violet-500/10">
                      <span className="text-xs font-medium text-violet-400 mb-2 block">Viral Original</span>
                      <p className="text-sm text-gray-300 whitespace-pre-wrap">{comp.viral}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-coral-500/5 border border-coral-500/10">
                      <span className="text-xs font-medium text-coral-400 mb-2 block">Your Version</span>
                      <p className="text-sm text-gray-300 whitespace-pre-wrap">{comp.yours}</p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Verdict */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card p-6 border-coral-500/20"
              >
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-coral-400" />
                  <h3 className="font-display font-semibold text-white">Verdict</h3>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{result.verdict}</p>
              </motion.div>

              {/* Action Plan */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-card p-6 border-green-500/20"
              >
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <h3 className="font-display font-semibold text-white">Action Plan</h3>
                </div>
                <ul className="space-y-2">
                  {result.actionPlan.map((step, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="text-green-400 font-mono text-xs mt-0.5">{i + 1}.</span>
                      {step}
                    </li>
                  ))}
                </ul>
              </motion.div>

              <button
                onClick={() => { setResult(null); setViralLink(''); setViralScript(''); setUserLink(''); setUserScript('') }}
                className="px-5 py-2.5 rounded-xl bg-dark-700 hover:bg-dark-600 text-sm text-gray-300 transition-colors"
              >
                New Diagnosis
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
