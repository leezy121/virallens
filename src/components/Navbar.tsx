import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Zap, LogOut, Settings, LayoutDashboard } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const isLanding = location.pathname === '/'

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-950/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-coral-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-white">ViralLens</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <Link to="/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Dashboard
                </Link>
                <Link to="/decode" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Decode
                </Link>
                <Link to="/diagnose" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Diagnose
                </Link>
                <Link to="/coach" className="text-sm text-gray-400 hover:text-white transition-colors">
                  AI Coach
                </Link>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20">
                  <span className="text-sm">🪙</span>
                  <span className="text-sm font-medium text-violet-400">{profile?.credits ?? 0}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                {isLanding && (
                  <>
                    <a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">Features</a>
                    <a href="#pricing" className="text-sm text-gray-400 hover:text-white transition-colors">Pricing</a>
                  </>
                )}
                <Link
                  to="/auth"
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-violet-500 hover:bg-violet-600 text-white transition-colors btn-shimmer"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-gray-400 hover:text-white"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-dark-900 border-t border-white/5"
          >
            <div className="px-4 py-4 space-y-3">
              {user ? (
                <>
                  <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg bg-violet-500/10">
                    <span>🪙</span>
                    <span className="text-sm font-medium text-violet-400">{profile?.credits ?? 0} credits</span>
                  </div>
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm text-gray-300 hover:text-white">Dashboard</Link>
                  <Link to="/decode" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm text-gray-300 hover:text-white">Decode</Link>
                  <Link to="/diagnose" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm text-gray-300 hover:text-white">Diagnose</Link>
                  <Link to="/coach" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm text-gray-300 hover:text-white">AI Coach</Link>
                  <Link to="/settings" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm text-gray-300 hover:text-white">Settings</Link>
                  <button onClick={handleSignOut} className="block w-full text-left px-3 py-2 text-sm text-coral-500">Sign Out</button>
                </>
              ) : (
                <>
                  <Link to="/auth" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm font-medium text-violet-400">Get Started</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
