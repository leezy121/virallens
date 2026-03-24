import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Link2, Zap, MessageCircle, ArrowRight, Clock, Rocket } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

interface Analysis {
  id: string
  type: string
  viral_link: string
  created_at: string
}

export default function Dashboard() {
  const { profile } = useAuth()
  const [recentAnalyses, setRecentAnalyses] = useState<Analysis[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRecent() {
      if (!profile) return
      const { data } = await supabase
        .from('analyses')
        .select('id, type, viral_link, created_at')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(5)
      setRecentAnalyses(data || [])
      setLoading(false)
    }
    fetchRecent()
  }, [profile])

  const quickActions = [
    {
      icon: <Link2 className="w-7 h-7" />,
      title: 'Decode a Viral Video',
      desc: 'Break down why a video went viral',
      to: '/decode',
      color: 'violet',
      cost: '2 credits',
    },
    {
      icon: <Zap className="w-7 h-7" />,
      title: 'Diagnose My Flop',
      desc: 'Compare your video vs the original',
      to: '/diagnose',
      color: 'coral',
      cost: '2 credits',
    },
    {
      icon: <MessageCircle className="w-7 h-7" />,
      title: 'Talk to AI Coach',
      desc: 'Get personalized growth advice',
      to: '/coach',
      color: 'cyan',
      cost: '1 credit/msg',
    },
  ]

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="font-display font-bold text-3xl md:text-4xl text-white mb-2">
            Welcome back{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''} 👋
          </h1>
          <p className="text-gray-400">
            You have <span className="text-violet-400 font-semibold">{profile?.credits ?? 0} credits</span> remaining.
            {(profile?.credits ?? 0) < 5 && (
              <Link to="/settings" className="text-coral-400 ml-1 hover:underline">Get more →</Link>
            )}
          </p>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-5 mb-12">
          {quickActions.map((action, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link to={action.to} className="block glass-card p-6 group cursor-pointer h-full">
                <div className={`w-14 h-14 rounded-2xl mb-5 flex items-center justify-center ${
                  action.color === 'violet' ? 'bg-violet-500/10 text-violet-400' :
                  action.color === 'coral' ? 'bg-coral-500/10 text-coral-400' :
                  'bg-cyan-500/10 text-cyan-400'
                }`}>
                  {action.icon}
                </div>
                <h3 className="font-display font-semibold text-lg text-white mb-1 group-hover:text-violet-400 transition-colors">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-500 mb-4">{action.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">{action.cost}</span>
                  <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="font-display font-semibold text-xl text-white mb-5 flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-500" />
            Recent Activity
          </h2>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 rounded-xl bg-dark-800 animate-pulse" />
              ))}
            </div>
          ) : recentAnalyses.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <Rocket className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="font-display font-semibold text-lg text-white mb-2">No analyses yet</h3>
              <p className="text-sm text-gray-500 mb-6">Let's decode your first viral video!</p>
              <Link
                to="/decode"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-500 hover:bg-violet-600 text-white text-sm font-medium transition-colors btn-shimmer"
              >
                Start First Analysis
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentAnalyses.map((analysis) => (
                <Link
                  key={analysis.id}
                  to={`/${analysis.type}?id=${analysis.id}`}
                  className="flex items-center justify-between p-4 rounded-xl bg-dark-800 hover:bg-dark-700 border border-white/5 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      analysis.type === 'decode' ? 'bg-violet-500/10 text-violet-400' : 'bg-coral-500/10 text-coral-400'
                    }`}>
                      {analysis.type === 'decode' ? <Link2 className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white capitalize">{analysis.type} Analysis</p>
                      <p className="text-xs text-gray-500 truncate max-w-xs">{analysis.viral_link}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-600">{new Date(analysis.created_at).toLocaleDateString()}</span>
                    <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-violet-400 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
