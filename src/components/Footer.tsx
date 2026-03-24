import { Zap } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-dark-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-coral-500 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-white">ViralLens</span>
            </div>
            <p className="text-sm text-gray-500 max-w-xs">
              Built for creators who refuse to stay small. AI-powered viral video analysis.
            </p>
          </div>
          <div>
            <h4 className="font-display font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2">
              <li><a href="#features" className="text-sm text-gray-500 hover:text-violet-400 transition-colors">Features</a></li>
              <li><a href="#pricing" className="text-sm text-gray-500 hover:text-violet-400 transition-colors">Pricing</a></li>
              <li><Link to="/auth" className="text-sm text-gray-500 hover:text-violet-400 transition-colors">Sign Up</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-gray-500 hover:text-violet-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-violet-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-violet-400 transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/5 text-center">
          <p className="text-xs text-gray-600">© 2026 ViralLens. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
