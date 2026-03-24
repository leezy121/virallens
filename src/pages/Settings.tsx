import { motion } from 'framer-motion'
import { ArrowLeft, User, CreditCard, LogOut, Crown, Coins, ExternalLink } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Settings() {
  const { profile, user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-white transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-white">Settings</h1>
        </motion.div>

        <div className="space-y-5">
          {/* Account Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <User className="w-5 h-5 text-gray-400" />
              <h2 className="font-display font-semibold text-white">Account</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500">Name</label>
                <p className="text-sm text-white mt-0.5">{profile?.full_name || 'Not set'}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Email</label>
                <p className="text-sm text-white mt-0.5">{user?.email || 'N/A'}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Member since</label>
                <p className="text-sm text-white mt-0.5">
                  {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Current Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <Crown className="w-5 h-5 text-violet-400" />
              <h2 className="font-display font-semibold text-white">Current Plan</h2>
            </div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-lg font-display font-bold text-white capitalize">{profile?.plan || 'Free'}</p>
                <p className="text-xs text-gray-500">
                  {profile?.plan === 'pro' ? '$9.99/month' : profile?.plan === 'credits' ? 'Pay as you go' : 'Free tier'}
                </p>
              </div>
              {profile?.plan !== 'pro' && (
                <a
                  href="#"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-500 hover:bg-violet-600 text-white text-sm font-medium transition-colors btn-shimmer"
                >
                  <Crown className="w-4 h-4" />
                  Upgrade to Pro
                </a>
              )}
            </div>
            <p className="text-xs text-gray-600">
              To set up Stripe payments, add your Stripe publishable key and create a checkout session endpoint.
              <a href="https://stripe.com/docs/billing/subscriptions" target="_blank" rel="noopener noreferrer" className="text-violet-400 ml-1 hover:underline inline-flex items-center gap-0.5">
                Stripe Docs <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </motion.div>

          {/* Credits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <Coins className="w-5 h-5 text-yellow-400" />
              <h2 className="font-display font-semibold text-white">Credits</h2>
            </div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-4xl font-display font-bold gradient-text">{profile?.credits ?? 0}</p>
                <p className="text-xs text-gray-500 mt-1">credits remaining</p>
              </div>
              <a
                href="#"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-700 hover:bg-dark-600 text-gray-300 text-sm font-medium transition-colors"
              >
                <CreditCard className="w-4 h-4" />
                Buy 20 Credits — $4.99
              </a>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-dark-800 text-center">
                <p className="text-xs text-gray-500">Decode</p>
                <p className="text-sm font-medium text-white">2 credits</p>
              </div>
              <div className="p-3 rounded-lg bg-dark-800 text-center">
                <p className="text-xs text-gray-500">Diagnose</p>
                <p className="text-sm font-medium text-white">2 credits</p>
              </div>
              <div className="p-3 rounded-lg bg-dark-800 text-center">
                <p className="text-xs text-gray-500">Coach msg</p>
                <p className="text-sm font-medium text-white">1 credit</p>
              </div>
            </div>
          </motion.div>

          {/* Sign Out */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-dark-800 hover:bg-dark-700 border border-white/5 text-coral-400 text-sm font-medium transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
