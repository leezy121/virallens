import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Link2, Zap, MessageCircle, BookOpen, Check, Star } from 'lucide-react'
import AnimatedSection from '../components/AnimatedSection'
import AnimatedCounter from '../components/AnimatedCounter'
import Footer from '../components/Footer'

const heroWords = ['Stop', 'Guessing.', 'Start', 'Going', 'Viral.']

const features = [
  {
    icon: <Link2 className="w-6 h-6" />,
    title: 'Viral Decoder',
    desc: 'Paste any viral video link. AI extracts the hook, script structure, CTA, pacing, and what made it spread.',
    color: 'violet',
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Flop Diagnosis',
    desc: "Compare your video against the viral original. Get specific, actionable reasons why yours underperformed.",
    color: 'coral',
  },
  {
    icon: <MessageCircle className="w-6 h-6" />,
    title: 'AI Coach',
    desc: 'Chat with an AI mentor trained on viral content strategy. Ask anything about hooks, niches, or growth.',
    color: 'cyan',
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: 'Hooks Library',
    desc: 'Browse a growing database of proven viral hooks organized by niche and format.',
    color: 'violet',
    badge: 'Coming Soon',
  },
]

const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    features: ['1 Viral Decode', '1 Flop Diagnosis', '5 AI Coach messages', 'Basic analysis'],
    cta: 'Start Free',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$9.99',
    period: '/month',
    features: ['30 Decodes/month', '30 Diagnoses/month', '50 Coach messages', 'Hooks Library access', 'Priority analysis'],
    cta: 'Go Pro',
    highlighted: true,
  },
  {
    name: 'Credits',
    price: '$4.99',
    period: 'one-time',
    features: ['20 credits', '1 credit = 1 coach msg', '2 credits = 1 analysis', 'Never expires'],
    cta: 'Buy Credits',
    highlighted: false,
  },
]

const testimonials = [
  { name: 'Sarah K.', handle: '@sarahcreates', text: "I couldn't figure out why my videos flopped. ViralLens showed me my hooks were 2 seconds too slow. Fixed it, next video hit 500K.", avatar: '👩🏽‍🦱' },
  { name: 'Marcus T.', handle: '@marcusugc', text: 'The AI Coach is like having a mentor who actually knows the algorithm. Worth every penny.', avatar: '👨🏾' },
  { name: 'Jess L.', handle: '@jessmakes', text: "Decoded 3 viral videos in my niche and finally understood the pattern. My views are up 4x this month.", avatar: '👩🏼' },
]

export default function Landing() {
  return (
    <div className="noise-overlay">
      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-violet-500/20 blur-[120px]"
          />
          <motion.div
            animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-coral-500/15 blur-[100px]"
          />
          <motion.div
            animate={{ x: [0, 15, 0], y: [0, 15, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/2 right-1/3 w-[300px] h-[300px] rounded-full bg-cyan-500/10 blur-[80px]"
          />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-violet-400/30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          {/* Pill badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            <span className="text-sm text-violet-300">AI-Powered Creator Growth</span>
          </motion.div>

          {/* Hero headline - word by word animation */}
          <h1 className="font-display font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-tight mb-6">
            {heroWords.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.12, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                className={`inline-block mr-3 ${i >= 2 ? 'gradient-text' : 'text-white'}`}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10"
          >
            Paste any viral video link. Our AI breaks down exactly why it worked — and why your version didn't.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/auth"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-violet-500 hover:bg-violet-600 text-white font-display font-semibold text-lg transition-all btn-shimmer glow-violet"
            >
              Try Free Analysis
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-white/10 hover:border-white/20 text-gray-300 hover:text-white font-display font-medium text-lg transition-all"
            >
              See How It Works
            </a>
          </motion.div>

          {/* Mock browser window */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.8 }}
            className="mt-16 max-w-3xl mx-auto"
          >
            <div className="glass-card p-1 rounded-2xl">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-coral-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 rounded-md bg-dark-800 text-xs text-gray-500">virallens.app/decode</div>
                </div>
              </div>
              <div className="p-6 md:p-8 space-y-4">
                <div className="h-4 w-3/4 rounded bg-dark-700 animate-pulse" />
                <div className="h-4 w-1/2 rounded bg-dark-700 animate-pulse" />
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="h-24 rounded-lg bg-violet-500/5 border border-violet-500/10 animate-pulse" />
                  <div className="h-24 rounded-lg bg-coral-500/5 border border-coral-500/10 animate-pulse" />
                </div>
                <div className="h-32 rounded-lg bg-dark-700/50 animate-pulse mt-4" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-24 md:py-32 relative" id="how-it-works">
        <div className="max-w-6xl mx-auto px-4">
          <AnimatedSection className="text-center mb-16">
            <h2 className="font-display font-bold text-3xl md:text-5xl text-white mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">Three steps to understanding why some videos blow up — and yours don't. Yet.</p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-[2px] bg-gradient-to-r from-violet-500/50 via-coral-500/50 to-cyan-500/50" />

            {[
              { step: '01', icon: <Link2 className="w-7 h-7" />, title: 'Paste a Viral Link', desc: 'Drop in any TikTok, Reel, or Short that blew up. Add the caption or script.', color: 'violet' },
              { step: '02', icon: <Zap className="w-7 h-7" />, title: 'Paste Your Version', desc: "Add your attempt that didn't perform. Let the AI see both side-by-side.", color: 'coral' },
              { step: '03', icon: <Star className="w-7 h-7" />, title: 'Get AI Breakdown', desc: 'Receive a detailed analysis of hooks, pacing, structure, and exactly what to fix.', color: 'cyan' },
            ].map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.15}>
                <div className="glass-card p-8 text-center relative">
                  <div className={`w-14 h-14 rounded-2xl mx-auto mb-6 flex items-center justify-center bg-${item.color}-500/10 text-${item.color}-400 border border-${item.color}-500/20`}>
                    {item.icon}
                  </div>
                  <span className="text-xs font-mono text-gray-600 absolute top-4 right-4">{item.step}</span>
                  <h3 className="font-display font-semibold text-xl text-white mb-3">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="py-24 md:py-32 relative" id="features">
        <div className="max-w-6xl mx-auto px-4">
          <AnimatedSection className="text-center mb-16">
            <h2 className="font-display font-bold text-3xl md:text-5xl text-white mb-4">
              Everything You Need to <span className="gradient-text">Go Viral</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">Powered by AI that actually understands what makes content spread.</p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="glass-card p-8 h-full relative overflow-hidden group">
                  {feature.badge && (
                    <span className="absolute top-4 right-4 px-2 py-0.5 text-xs font-medium rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                      {feature.badge}
                    </span>
                  )}
                  <div className={`w-12 h-12 rounded-xl mb-5 flex items-center justify-center ${
                    feature.color === 'violet' ? 'bg-violet-500/10 text-violet-400' :
                    feature.color === 'coral' ? 'bg-coral-500/10 text-coral-400' :
                    'bg-cyan-500/10 text-cyan-400'
                  }`}>
                    {feature.icon}
                  </div>
                  <h3 className="font-display font-semibold text-xl text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                  {/* Hover glow */}
                  <div className={`absolute -bottom-1/2 -right-1/2 w-full h-full rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                    feature.color === 'violet' ? 'bg-violet-500/5' :
                    feature.color === 'coral' ? 'bg-coral-500/5' :
                    'bg-cyan-500/5'
                  }`} />
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="py-24 relative">
        <div className="max-w-5xl mx-auto px-4">
          <div className="glass-card p-12 rounded-3xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
              <div>
                <AnimatedCounter end={10000} suffix="+" />
                <p className="text-gray-500 mt-2 text-sm">Videos Analyzed</p>
              </div>
              <div>
                <AnimatedCounter end={2500} suffix="+" />
                <p className="text-gray-500 mt-2 text-sm">Creators Growing</p>
              </div>
              <div>
                <AnimatedCounter end={85} suffix="%" />
                <p className="text-gray-500 mt-2 text-sm">Report View Growth</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-24 relative">
        <div className="max-w-6xl mx-auto px-4">
          <AnimatedSection className="text-center mb-16">
            <h2 className="font-display font-bold text-3xl md:text-5xl text-white mb-4">
              Creators <span className="gradient-text">Love It</span>
            </h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="glass-card p-6 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-dark-700 flex items-center justify-center text-lg">{t.avatar}</div>
                    <div>
                      <p className="text-sm font-medium text-white">{t.name}</p>
                      <p className="text-xs text-gray-500">{t.handle}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">{t.text}</p>
                  <div className="flex gap-0.5 mt-4">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section className="py-24 md:py-32 relative" id="pricing">
        <div className="max-w-6xl mx-auto px-4">
          <AnimatedSection className="text-center mb-16">
            <h2 className="font-display font-bold text-3xl md:text-5xl text-white mb-4">
              Simple, Creator-Friendly <span className="gradient-text">Pricing</span>
            </h2>
            <p className="text-gray-400 text-lg">Start free. Upgrade when you're ready to go all-in.</p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6 items-start">
            {pricingPlans.map((plan, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className={`glass-card p-8 relative ${plan.highlighted ? 'border-violet-500/40 glow-violet' : ''}`}>
                  {plan.highlighted && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-semibold rounded-full bg-violet-500 text-white">
                      Most Popular
                    </span>
                  )}
                  <h3 className="font-display font-semibold text-xl text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="font-display font-bold text-4xl text-white">{plan.price}</span>
                    <span className="text-sm text-gray-500">{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-gray-400">
                        <Check className="w-4 h-4 text-violet-400 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/auth"
                    className={`block text-center py-3 rounded-xl font-display font-medium transition-all ${
                      plan.highlighted
                        ? 'bg-violet-500 hover:bg-violet-600 text-white btn-shimmer'
                        : 'bg-dark-700 hover:bg-dark-600 text-gray-300'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-violet-500/10 blur-[120px]"
          />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <AnimatedSection>
            <h2 className="font-display font-bold text-4xl md:text-6xl text-white mb-6">
              Your Next Video Could Be <span className="gradient-text">THE One.</span>
            </h2>
            <p className="text-lg text-gray-400 mb-10">
              Join thousands of creators using AI to crack the algorithm.
            </p>
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 px-10 py-5 rounded-xl bg-violet-500 hover:bg-violet-600 text-white font-display font-semibold text-lg transition-all btn-shimmer glow-violet"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </div>
  )
}
