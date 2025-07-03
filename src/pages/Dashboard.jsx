import React, { useState, useEffect } from 'react'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import { Music, Play, Users, Clock, TrendingUp, Sparkles, Volume2 } from 'lucide-react'

// Animated Counter Component
const AnimatedCounter = ({ value, duration = 2000 }) => {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    let startTime = null
    const startValue = 0
    const endValue = parseInt(value) || 0
    
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentCount = Math.floor(startValue + (endValue - startValue) * easeOutQuart)
      
      setCount(currentCount)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    requestAnimationFrame(animate)
  }, [value, duration])
  
  return <span>{count.toLocaleString()}</span>
}

// Gradient Text Component
const GradientText = ({ children, className = "" }) => (
  <span className={`bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent ${className}`}>
    {children}
  </span>
)

// Typewriter Effect Component
const TypewriterText = ({ text, delay = 50 }) => {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  
  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, delay)
      return () => clearTimeout(timeout)
    }
  }, [currentIndex, delay, text])
  
  return (
    <span className="relative">
      {displayText}
      <Motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1, repeat: Infinity }}
        className="ml-1"
      >
        |
      </Motion.span>
    </span>
  )
}

// Floating Particles Background
const FloatingParticles = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }))
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <Motion.div
          key={particle.id}
          className="absolute rounded-full bg-purple-500/10"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
          }}
        />
      ))}
    </div>
  )
}

// Animated Button Component
const AnimatedButton = ({ children, onClick, className = "", variant = "primary" }) => {
  const variants = {
    primary: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
    secondary: "bg-white/10 hover:bg-white/20 backdrop-blur-sm",
    ghost: "hover:bg-white/10"
  }
  
  return (
    <Motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${variants[variant]} ${className}`}
    >
      {children}
    </Motion.button>
  )
}

// Music Wave Visualizer
const MusicWaveVisualizer = () => {
  const bars = Array.from({ length: 12 }, (_, i) => i)
  
  return (
    <div className="flex items-center justify-center space-x-1">
      {bars.map((bar) => (
        <Motion.div
          key={bar}
          className="w-1 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full"
          animate={{
            height: [10, 30, 10],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: bar * 0.1,
          }}
        />
      ))}
    </div>
  )
}

// Hero Section Component
const DashboardHero = () => {
  const [_isPlaying, _setIsPlaying] = useState(false)
  
  return (
    <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      <FloatingParticles />
      
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-purple-900/20 rounded-3xl" />
      
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <Motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center mb-6">
            <Motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-2xl"
            >
              <Music className="h-12 w-12 text-white" />
            </Motion.div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            <GradientText>
              <TypewriterText text="Your Music Universe" delay={100} />
            </GradientText>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Discover the rhythm of your soul through data
          </p>
        </Motion.div>
        
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <AnimatedButton
            onClick={() => _setIsPlaying(!_isPlaying)}
            className="flex items-center gap-2"
          >
            <Play className="h-5 w-5" />
            Explore Your Journey
          </AnimatedButton>
          
          <AnimatedButton variant="secondary" className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            View Analytics
          </AnimatedButton>
        </Motion.div>
        
        {/* Music Visualizer */}
        <Motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-8"
        >
          <MusicWaveVisualizer />
        </Motion.div>
      </div>
    </div>
  )
}

// Enhanced Stats Card Component
const StatsCard = ({ title, value, icon, gradient, delay = 0 }) => {
  const Icon = icon
  return (
  <Motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ scale: 1.05, y: -5 }}
    className="relative group"
  >
    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300" />
    <div className="relative bg-black/50 backdrop-blur-xl rounded-2xl p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${gradient}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <Sparkles className="h-5 w-5 text-purple-400 opacity-60" />
      </div>
      
      <h3 className="text-sm font-medium text-gray-400 mb-2">{title}</h3>
      <p className="text-3xl font-bold text-white">
        <AnimatedCounter value={value} />
      </p>
    </div>
  </Motion.div>
  )
}

// Now Playing Card Component
const NowPlayingCard = () => {
  const [isPlaying, _setIsPlaying] = useState(true)
  
  return (
    <Motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="relative group"
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300" />
      <div className="relative bg-black/50 backdrop-blur-xl rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Music className="h-8 w-8 text-white" />
            </div>
            {isPlaying && (
              <Motion.div
                className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Volume2 className="h-4 w-4 text-green-400" />
              <span className="text-sm font-medium text-green-400">Now Playing</span>
            </div>
            <h4 className="font-semibold text-white mb-1">Discovering Your Music...</h4>
            <p className="text-sm text-gray-400">Connect your Last.fm account</p>
          </div>
        </div>
      </div>
    </Motion.div>
  )
}

// Main Dashboard Component
const Dashboard = () => {
  const mockStats = [
    { title: "Total Scrobbles", value: "42,069", icon: Music, gradient: "from-purple-500 to-pink-500", delay: 0.1 },
    { title: "Top Artist", value: "Loading", icon: Users, gradient: "from-blue-500 to-purple-500", delay: 0.2 },
    { title: "Hours Listened", value: "1,337", icon: Clock, gradient: "from-green-500 to-blue-500", delay: 0.3 },
    { title: "Artists Discovered", value: "2,420", icon: TrendingUp, gradient: "from-orange-500 to-red-500", delay: 0.4 },
  ]
  
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="glass-card p-8 relative overflow-hidden">
        <DashboardHero />
      </div>
      
      {/* Now Playing Section */}
      <NowPlayingCard />
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockStats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            gradient={stat.gradient}
            delay={stat.delay}
          />
        ))}
      </div>
      
      {/* Quick Actions */}
      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="glass-card p-6"
      >
        <h3 className="text-2xl font-bold text-white mb-6">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <AnimatedButton variant="secondary" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            View Top Artists
          </AnimatedButton>
          <AnimatedButton variant="secondary" className="flex items-center gap-2">
            <Music className="h-4 w-4" />
            Browse Top Tracks
          </AnimatedButton>
          <AnimatedButton variant="secondary" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Analyze Trends
          </AnimatedButton>
        </div>
      </Motion.div>
    </div>
  )
}

export default Dashboard
